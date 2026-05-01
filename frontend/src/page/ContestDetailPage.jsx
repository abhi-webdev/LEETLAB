import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useContestStore } from "../store/useContestStore";
import {
  Loader,
  Trophy,
  ArrowLeft,
  Users,
  CheckCircle,
  Play,
  Crown,
  Award,
} from "lucide-react";
import ContestTimer from "../components/ContestTimer";
import ContestLeaderboard from "../components/ContestLeaderboard";
import Editor from "@monaco-editor/react";

const languageOptions = [
  { value: 63, label: "JavaScript", monaco: "javascript" },
  { value: 71, label: "Python", monaco: "python" },
  { value: 62, label: "Java", monaco: "java" },
];

function ContestDetailPage() {
  const { id } = useParams();
  const {
    contest,
    isContestLoading,
    getContestById,
    joinContest,
    isJoining,
    submitContestSolution,
    isSubmitting,
    declareWinner,
  } = useContestStore();
  const [activeProblemIndex, setActiveProblemIndex] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [code, setCode] = useState("");
  const [languageId, setLanguageId] = useState(63);
  const [results, setResults] = useState(null);
  const [declaringWinner, setDeclaringWinner] = useState(false);

  useEffect(() => {
    getContestById(id);
  }, [id, getContestById]);

  const handleJoin = async () => {
    await joinContest(id);
  };

  const handleSubmit = async () => {
    if (!contest?.problems?.[activeProblemIndex]) return;

    const problem = contest.problems[activeProblemIndex].problem;
    const testcases = problem.testcases;

    if (!Array.isArray(testcases) || testcases.length === 0) return;

    const result = await submitContestSolution(id, {
      source_code: code,
      language_id: languageId,
      stdin: testcases.map((tc) => tc.input),
      expected_outputs: testcases.map((tc) => tc.output),
      problemId: problem.id,
    });

    if (result) {
      setResults(result.submission);
    }
  };

  const handleProblemChange = (index) => {
    setActiveProblemIndex(index);
    setCode("");
    setResults(null);
  };

  const handleLanguageChange = (value) => {
    setLanguageId(value);
    setCode("");
    setResults(null);
  };

  const handleDeclareWinner = async (winnerId) => {
    setDeclaringWinner(true);
    await declareWinner(id, winnerId);
    setDeclaringWinner(false);
  };

  if (isContestLoading || !contest) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  const liveStatus = contest.liveStatus;
  const activeProblem = contest.problems?.[activeProblemIndex]?.problem;
  const contestProblem = contest.problems?.[activeProblemIndex];
  const isActive = liveStatus === "ACTIVE";
  const isJoined = contest.isJoined;
  const isCreator = contest.isCreator;
  const langName = languageOptions
    .find((l) => l.value === languageId)
    ?.label?.toUpperCase();
  const snippets = activeProblem?.codeSnippets;
  const initialCode =
    snippets && typeof snippets === "object"
      ? snippets[langName] || snippets[Object.keys(snippets)[0]] || ""
      : "";
  const isLeaderboardVisible = showLeaderboard || isCreator;

  const statusColors = {
    UPCOMING: "text-info",
    ACTIVE: "text-success",
    ENDED: "text-gray-400",
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Contest Header */}
      <div className="sticky top-0 z-50 bg-base-100/80 backdrop-blur-lg border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/contests" className="btn btn-ghost btn-sm btn-circle">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-bold text-lg flex items-center gap-2">
                  {contest.title}
                  {isCreator && (
                    <span className="badge badge-primary badge-sm">Creator</span>
                  )}
                </h1>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`font-semibold ${statusColors[liveStatus]}`}>
                    {liveStatus === "ACTIVE" ? "🔴 LIVE" : liveStatus}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {contest._count?.participants || 0} participants
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {(liveStatus === "ACTIVE" || liveStatus === "UPCOMING") && (
                <ContestTimer
                  targetDate={
                    liveStatus === "UPCOMING"
                      ? contest.startTime
                      : contest.endTime
                  }
                  label={liveStatus === "UPCOMING" ? "Starts in" : "Ends in"}
                />
              )}
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className={`btn btn-sm gap-1 ${
                  isLeaderboardVisible ? "btn-primary" : "btn-ghost"
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden md:inline">Leaderboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Winner Banner */}
      {contest.winner && (
        <div className="bg-gradient-to-r from-yellow-500/20 via-amber-500/10 to-yellow-500/20 border-b border-yellow-500/30">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center gap-3">
            <Crown className="w-6 h-6 text-yellow-400" />
            <span className="font-bold text-lg">
              Winner:{" "}
              <span className="text-yellow-400">{contest.winner.name}</span>
            </span>
            <div className="avatar">
              <div className="w-8 h-8 rounded-full ring ring-yellow-400 ring-offset-base-100 ring-offset-1">
                <img
                  src={
                    contest.winner.image ||
                    `https://api.dicebear.com/9.x/adventurer/svg?seed=${contest.winner.email}`
                  }
                  alt={contest.winner.name}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Problem List Sidebar */}
        <div className="w-64 border-r border-base-300 bg-base-200/50 overflow-y-auto hidden md:block">
          <div className="p-3">
            <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-3 px-2">
              Problems
            </h3>
            {contest.problems?.map((cp, idx) => (
              <button
                key={cp.id}
                onClick={() => handleProblemChange(idx)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg mb-1 transition-all text-left ${
                  idx === activeProblemIndex
                    ? "bg-primary/20 text-primary border-l-2 border-primary"
                    : "hover:bg-base-300"
                }`}
              >
                <span className="font-mono text-xs text-gray-500 w-5">
                  {idx + 1}
                </span>
                <span className="flex-1 text-sm font-medium truncate">
                  {cp.problem.title}
                </span>
                <span className="text-xs text-gray-400">{cp.points}pt</span>
              </button>
            ))}
          </div>
        </div>

        {/* Problem Content & Editor */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Problem Description */}
          <div className="lg:w-1/2 overflow-y-auto p-6 border-r border-base-300">
            {/* Join Banner */}
            {!isJoined && !isCreator && liveStatus !== "ENDED" && (
              <div className="alert alert-info mb-6">
                <div className="flex items-center justify-between w-full">
                  <span>Join this contest to start solving problems!</span>
                  <button
                    onClick={handleJoin}
                    disabled={isJoining}
                    className="btn btn-sm btn-primary"
                  >
                    {isJoining ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      "Join Contest"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Mobile problem tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto md:hidden pb-2">
              {contest.problems?.map((cp, idx) => (
                <button
                  key={cp.id}
                  onClick={() => handleProblemChange(idx)}
                  className={`btn btn-sm whitespace-nowrap ${
                    idx === activeProblemIndex ? "btn-primary" : "btn-ghost"
                  }`}
                >
                  {idx + 1}. {cp.problem.title}
                </button>
              ))}
            </div>

            {activeProblem && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold">{activeProblem.title}</h2>
                  <span
                    className={`badge text-xs font-bold text-white ${
                      activeProblem.difficulty === "EASY"
                        ? "badge-success"
                        : activeProblem.difficulty === "MEDIUM"
                        ? "badge-warning"
                        : "badge-error"
                    }`}
                  >
                    {activeProblem.difficulty}
                  </span>
                  <span className="badge badge-outline badge-sm">
                    {contestProblem.points} pts
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {(activeProblem.tags || []).map((tag, i) => (
                    <span
                      key={i}
                      className="badge badge-outline badge-warning badge-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <div className="prose prose-invert max-w-none mb-6">
                  <p className="whitespace-pre-wrap text-gray-300">
                    {activeProblem.description}
                  </p>
                </div>

                {/* Examples */}
                {activeProblem.examples && (
                  <div className="space-y-4 mb-6">
                    <h3 className="font-bold text-lg">Examples</h3>
                    {(Array.isArray(activeProblem.examples)
                      ? activeProblem.examples
                      : Object.values(activeProblem.examples)
                    ).map((ex, i) => (
                      <div
                        key={i}
                        className="bg-base-200 rounded-xl p-4 border border-base-300"
                      >
                        <p className="text-sm mb-1">
                          <strong>Input:</strong>{" "}
                          <code className="bg-base-300 px-2 py-0.5 rounded">
                            {ex.input}
                          </code>
                        </p>
                        <p className="text-sm mb-1">
                          <strong>Output:</strong>{" "}
                          <code className="bg-base-300 px-2 py-0.5 rounded">
                            {ex.output}
                          </code>
                        </p>
                        {ex.explanation && (
                          <p className="text-sm text-gray-400 mt-1">
                            <strong>Explanation:</strong> {ex.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {activeProblem.constraints && (
                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-2">Constraints</h3>
                    <div className="bg-base-200 rounded-xl p-4 border border-base-300">
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">
                        {activeProblem.constraints}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="lg:w-1/2 flex flex-col bg-base-200/30">
            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-base-300 bg-base-200/50">
              <select
                className="select select-sm select-bordered bg-base-300"
                value={languageId}
                onChange={(e) => handleLanguageChange(parseInt(e.target.value))}
              >
                {languageOptions.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isJoined || !isActive}
                  className="btn btn-sm btn-primary gap-1"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  Submit
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-[400px]">
              <Editor
                height="100%"
                language={
                  languageOptions.find((l) => l.value === languageId)?.monaco ||
                  "javascript"
                }
                value={code || initialCode}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  padding: { top: 12 },
                }}
              />
            </div>

            {/* Results Panel */}
            {results && (
              <div className="border-t border-base-300 bg-base-200 p-4 max-h-60 overflow-y-auto">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold">Results</h3>
                  <span
                    className={`badge ${
                      results.status === "Accepted"
                        ? "badge-success"
                        : "badge-error"
                    } badge-sm`}
                  >
                    {results.status}
                  </span>
                </div>
                <div className="space-y-1">
                  {results.testcases?.map((tc, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg ${
                        tc.passed
                          ? "bg-success/10 text-success"
                          : "bg-error/10 text-error"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        Test Case {tc.testCase}: {tc.status}
                      </span>
                      {tc.time && (
                        <span className="text-xs opacity-60 ml-auto">
                          {tc.time}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard Panel */}
        {isLeaderboardVisible && (
          <div className="w-80 border-l border-base-300 bg-base-200/50 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Leaderboard
              </h3>

              <ContestLeaderboard participants={contest.participants || []} />

              {/* Admin Creator: Declare Winner section */}
              {isCreator && !contest.winner && (
                <div className="mt-6 pt-4 border-t border-base-300">
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-warning">
                    <Crown className="w-4 h-4" />
                    Declare Winner
                  </h4>

                  {contest.participants?.length > 0 ? (
                    <div className="space-y-2">
                      {/* Auto-declare top scorer */}
                      <button
                        onClick={() => handleDeclareWinner(null)}
                        disabled={declaringWinner}
                        className="btn btn-warning btn-sm w-full gap-2"
                      >
                        {declaringWinner ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          <Award className="w-4 h-4" />
                        )}
                        Declare Top Scorer as Winner
                      </button>

                      {/* Or pick manually */}
                      <div className="divider text-xs text-gray-500">
                        or select manually
                      </div>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {contest.participants.map((p) => (
                          <button
                            key={p.userId}
                            onClick={() => handleDeclareWinner(p.userId)}
                            disabled={declaringWinner}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-base-300 transition-colors text-left text-sm"
                          >
                            <div className="avatar">
                              <div className="w-6 h-6 rounded-full">
                                <img
                                  src={
                                    p.user?.image ||
                                    `https://api.dicebear.com/9.x/adventurer/svg?seed=${p.user?.email}`
                                  }
                                  alt={p.user?.name}
                                />
                              </div>
                            </div>
                            <span className="flex-1 truncate">
                              {p.user?.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {p.score} pts
                            </span>
                            <Crown className="w-3 h-3 text-yellow-400 opacity-0 group-hover:opacity-100" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No participants to declare as winner
                    </p>
                  )}
                </div>
              )}

              {/* Winner already declared */}
              {contest.winner && (
                <div className="mt-6 pt-4 border-t border-base-300">
                  <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 rounded-xl p-4 border border-yellow-500/20 text-center">
                    <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Contest Winner</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full ring ring-yellow-400 ring-offset-base-100 ring-offset-1">
                          <img
                            src={
                              contest.winner.image ||
                              `https://api.dicebear.com/9.x/adventurer/svg?seed=${contest.winner.email}`
                            }
                            alt={contest.winner.name}
                          />
                        </div>
                      </div>
                      <span className="font-bold text-lg text-yellow-400">
                        {contest.winner.name}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContestDetailPage;
