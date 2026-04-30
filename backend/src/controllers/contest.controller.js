import { db } from "../libs/db.js";
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

// Helper: compute live status from timestamps
function computeStatus(contest) {
  const now = new Date();
  const start = new Date(contest.startTime);
  const end = new Date(contest.endTime);
  if (now < start) return "UPCOMING";
  if (now >= start && now <= end) return "ACTIVE";
  return "ENDED";
}

// ─── Admin: Create Contest ──────────────────────────────────────
export const createContest = async (req, res) => {
  try {
    const { title, description, startTime, endTime, problems } = req.body;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({ error: "Title, startTime, and endTime are required" });
    }

    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: "Start time must be before end time" });
    }

    const contest = await db.contest.create({
      data: {
        title,
        description: description || "",
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        createdBy: req.user.id,
        problems: {
          create: (problems || []).map((p, index) => ({
            problemId: p.problemId,
            order: p.order ?? index,
            points: p.points ?? 100,
          })),
        },
      },
      include: {
        problems: { include: { problem: true } },
        _count: { select: { participants: true } },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Contest created successfully",
      contest,
    });
  } catch (error) {
    console.error("Error creating contest:", error);
    return res.status(500).json({ error: "Failed to create contest" });
  }
};

// ─── Get All Contests ───────────────────────────────────────────
export const getAllContests = async (req, res) => {
  try {
    const contests = await db.contest.findMany({
      include: {
        _count: { select: { participants: true, problems: true } },
        creator: { select: { id: true, name: true, image: true } },
        participants: {
          where: { userId: req.user.id },
          select: { id: true },
        },
      },
      orderBy: { startTime: "desc" },
    });

    const contestsWithStatus = contests.map((c) => ({
      ...c,
      liveStatus: computeStatus(c),
      isJoined: c.participants.length > 0,
    }));

    return res.status(200).json({
      success: true,
      message: "Contests fetched successfully",
      contests: contestsWithStatus,
    });
  } catch (error) {
    console.error("Error fetching contests:", error);
    return res.status(500).json({ error: "Failed to fetch contests" });
  }
};

// ─── Get Contest By ID ──────────────────────────────────────────
export const getContestById = async (req, res) => {
  try {
    const { id } = req.params;

    const contest = await db.contest.findUnique({
      where: { id },
      include: {
        problems: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                difficulty: true,
                tags: true,
                description: true,
                examples: true,
                constraints: true,
                testcases: true,
                codeSnippets: true,
                referenceSolutions: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
        participants: {
          include: {
            user: { select: { id: true, name: true, image: true, email: true } },
          },
          orderBy: { score: "desc" },
        },
        creator: { select: { id: true, name: true, image: true } },
        winner: { select: { id: true, name: true, image: true, email: true } },
        _count: { select: { participants: true, submissions: true } },
      },
    });

    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }

    const isJoined = contest.participants.some((p) => p.userId === req.user.id);
    const isCreator = contest.createdBy === req.user.id;

    return res.status(200).json({
      success: true,
      message: "Contest fetched successfully",
      contest: {
        ...contest,
        liveStatus: computeStatus(contest),
        isJoined,
        isCreator,
      },
    });
  } catch (error) {
    console.error("Error fetching contest:", error);
    return res.status(500).json({ error: "Failed to fetch contest" });
  }
};

// ─── Admin: Update Contest ──────────────────────────────────────
export const updateContest = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startTime, endTime, problems } = req.body;

    const existing = await db.contest.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Contest not found" });
    }

    // If problems array is provided, replace all contest problems
    if (problems) {
      await db.contestProblem.deleteMany({ where: { contestId: id } });
      await db.contestProblem.createMany({
        data: problems.map((p, index) => ({
          contestId: id,
          problemId: p.problemId,
          order: p.order ?? index,
          points: p.points ?? 100,
        })),
      });
    }

    const contest = await db.contest.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
      },
      include: {
        problems: { include: { problem: true } },
        _count: { select: { participants: true } },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Contest updated successfully",
      contest,
    });
  } catch (error) {
    console.error("Error updating contest:", error);
    return res.status(500).json({ error: "Failed to update contest" });
  }
};

// ─── Admin: Delete Contest ──────────────────────────────────────
export const deleteContest = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db.contest.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Contest not found" });
    }

    await db.contest.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Contest deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contest:", error);
    return res.status(500).json({ error: "Failed to delete contest" });
  }
};

// ─── User: Join Contest ─────────────────────────────────────────
export const joinContest = async (req, res) => {
  try {
    const { id } = req.params;

    const contest = await db.contest.findUnique({ where: { id } });
    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }

    const liveStatus = computeStatus(contest);
    if (liveStatus === "ENDED") {
      return res.status(400).json({ error: "This contest has already ended" });
    }

    const existing = await db.contestParticipant.findUnique({
      where: { contestId_userId: { contestId: id, userId: req.user.id } },
    });

    if (existing) {
      return res.status(400).json({ error: "You have already joined this contest" });
    }

    const participant = await db.contestParticipant.create({
      data: {
        contestId: id,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Joined contest successfully",
      participant,
    });
  } catch (error) {
    console.error("Error joining contest:", error);
    return res.status(500).json({ error: "Failed to join contest" });
  }
};

// ─── Leaderboard ────────────────────────────────────────────────
export const getLeaderboard = async (req, res) => {
  try {
    const { id } = req.params;

    const participants = await db.contestParticipant.findMany({
      where: { contestId: id },
      include: {
        user: { select: { id: true, name: true, image: true, email: true } },
      },
      orderBy: { score: "desc" },
    });

    // Assign ranks
    const leaderboard = participants.map((p, index) => ({
      rank: index + 1,
      userId: p.userId,
      name: p.user.name,
      image: p.user.image,
      email: p.user.email,
      score: p.score,
      joinedAt: p.joinedAt,
    }));

    return res.status(200).json({
      success: true,
      message: "Leaderboard fetched successfully",
      leaderboard,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};

// ─── Contest Submit Solution ────────────────────────────────────
export const submitContestSolution = async (req, res) => {
  try {
    const { id: contestId } = req.params;
    const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;
    const userId = req.user.id;

    // 1. Validate contest exists and is active
    const contest = await db.contest.findUnique({
      where: { id: contestId },
      include: { problems: true },
    });

    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }

    const liveStatus = computeStatus(contest);
    if (liveStatus !== "ACTIVE") {
      return res.status(400).json({ error: "Contest is not currently active" });
    }

    // 2. Validate user has joined the contest
    const participant = await db.contestParticipant.findUnique({
      where: { contestId_userId: { contestId, userId } },
    });

    if (!participant) {
      return res.status(400).json({ error: "You must join the contest first" });
    }

    // 3. Find the contest problem to get points
    const contestProblem = contest.problems.find((cp) => cp.problemId === problemId);
    if (!contestProblem) {
      return res.status(400).json({ error: "This problem is not part of the contest" });
    }

    // 4. Check if already solved this problem in the contest
    const alreadySolved = await db.contestSubmission.findFirst({
      where: { contestId, userId, problemId, isAccepted: true },
    });

    // 5. Execute code via Judge0 (same as normal execution)
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or Missing test cases" });
    }

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((r) => r.token);
    const results = await pollBatchResults(tokens);

    let allPassed = true;
    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = stdout === expected_output;
      if (!passed) allPassed = false;
      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
      };
    });

    const testCaseResults = detailedResults.map((result) => ({
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    // 6. Create submission record
    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
      },
    });

    // 7. Create test case results
    await db.testCaseResult.createMany({
      data: testCaseResults.map((tc) => ({ ...tc, submissionId: submission.id })),
    });

    // 8. Create contest submission record
    const contestSub = await db.contestSubmission.create({
      data: {
        contestId,
        userId,
        problemId,
        submissionId: submission.id,
        isAccepted: allPassed,
        points: allPassed && !alreadySolved ? contestProblem.points : 0,
      },
    });

    // 9. Update participant score if solved for the first time
    if (allPassed && !alreadySolved) {
      await db.contestParticipant.update({
        where: { contestId_userId: { contestId, userId } },
        data: { score: { increment: contestProblem.points } },
      });

      // Also mark problem as solved globally
      await db.problemSolved.upsert({
        where: { userId_problemId: { userId, problemId } },
        update: {},
        create: { userId, problemId },
      });
    }

    // 10. Get full submission with test cases
    const submissionWithTestCase = await db.submission.findUnique({
      where: { id: submission.id },
      include: { testcases: true },
    });

    return res.status(200).json({
      success: true,
      message: allPassed ? "All test cases passed!" : "Some test cases failed",
      submission: submissionWithTestCase,
      contestSubmission: contestSub,
    });
  } catch (error) {
    console.error("Error submitting contest solution:", error.message);
    return res.status(500).json({ error: "Failed to submit contest solution" });
  }
};

// ─── Admin: Declare Winner ──────────────────────────────────────
export const declareWinner = async (req, res) => {
  try {
    const { id } = req.params;
    const { winnerId } = req.body;

    const contest = await db.contest.findUnique({
      where: { id },
      include: { participants: true },
    });

    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }

    // Only the creator can declare the winner
    if (contest.createdBy !== req.user.id) {
      return res.status(403).json({ error: "Only the contest creator can declare a winner" });
    }

    // If no winnerId provided, auto-pick the top scorer
    let finalWinnerId = winnerId;
    if (!finalWinnerId) {
      const topParticipant = await db.contestParticipant.findFirst({
        where: { contestId: id },
        orderBy: { score: "desc" },
      });
      if (!topParticipant) {
        return res.status(400).json({ error: "No participants in this contest" });
      }
      finalWinnerId = topParticipant.userId;
    }

    // Verify the winner is a participant
    const isParticipant = contest.participants.some((p) => p.userId === finalWinnerId);
    if (!isParticipant) {
      return res.status(400).json({ error: "Winner must be a contest participant" });
    }

    // Update ranks for all participants
    const sortedParticipants = await db.contestParticipant.findMany({
      where: { contestId: id },
      orderBy: { score: "desc" },
    });

    for (let i = 0; i < sortedParticipants.length; i++) {
      await db.contestParticipant.update({
        where: { id: sortedParticipants[i].id },
        data: { rank: i + 1 },
      });
    }

    const updated = await db.contest.update({
      where: { id },
      data: { winnerId: finalWinnerId, status: "ENDED" },
      include: {
        winner: { select: { id: true, name: true, image: true, email: true } },
        participants: {
          include: { user: { select: { id: true, name: true, image: true } } },
          orderBy: { score: "desc" },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: `Winner declared: ${updated.winner.name}`,
      contest: updated,
    });
  } catch (error) {
    console.error("Error declaring winner:", error);
    return res.status(500).json({ error: "Failed to declare winner" });
  }
};
