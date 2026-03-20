import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
import {db} from "../libs/db.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;
    const userId = req.user.id;

    // validate testCases
    if (!userId) {
      return res.status(400).json({ error: "User not found" });
    }

    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or missing test Cases" });
    }

    //2. prepeare each test cases for judge0
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    // 3. Send this batch of submission to judge0

    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((res) => res.token);

    // 4. Pool judge0 for the result of all submit

    const result = await pollBatchResults(tokens);

    console.log("Result ----------");
    console.log(result);

    // Analyze testcase result
    let allPassed = true;
    const detailedResults = result.map((result, i) => {
      const stdout = result.stdout.trim();
      const expected_output = expected_outputs[i].trim();
      const passed = stdout === expected_output;

      if (!passed) allPassed = false;

      return {
        testcase: i + 1,
        passed,
        stdout,
        expected_output,
        stderr: result.stderr,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
        compile_output: result.compile_output || null,
        status: result.status.description,
      };

      // console.log(`Testcase #${i+1}`);
      // console.log(`Input testcase for #${i+1} : ${stdin[i]}`);
      // console.log(`Expected Output for the testcase ${expected_output}`);
      // console.log(`Actual Output  ${stdout}`);

      // console.log(`Matched testcase for #${i+1} : ${passed}`);
    });

    console.log(detailedResults);
    // store submission sumarray

    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((res) => res.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
        status: allPassed ? "Accepted" : "Wrong answer",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
      },
    });

    // if all passed = true mark problem as solved for the current user
    if(allPassed){
      await db.problemSolved.upsert({
        where : {
          userId_problemId : {
            userId, problemId
          }
        },
        update : {

        },
        create : {
          userId, problemId
        }
      })
    }

    // 8. Save individual testcase result
    const testCaseResults = detailedResults.map((result) => {
      return {
        submissionId: submission.id,
        testCase: result.testcase,
        passed: result.passed,
        stdout: result.stdout,
        expected: result.expected_output,
        compileOutput : result.compile_output, 
        stderr: result.stderr,
        status: result.status,
        memory: result.memory,
        time: result.time,
      };
    })

    await db.testCaseResult.createMany({
      data : testCaseResults
    })

    const submissionWithTestcase = await db.submission.findUnique({
      where : {
        id : submission.id
      },
      include : {
        testcases : true
      }
    })
    return res.status(200).json({
      success : true,
      message: "Code executed successfully",
      submission : submissionWithTestcase
    });
  } catch (error) {
    console.error("Error executing code", error);
    return res.status(500).json({ error: "Error executing code" });
  }
};
