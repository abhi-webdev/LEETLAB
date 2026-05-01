import React, { useState, useEffect, useMemo } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  Loader,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Clock,
  ChevronRight,
  Code2,
  Users,
  Home,
  CheckCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import { useAuthStore } from "../store/useAuthStore";
import Submission from "../components/Submission";
import SubmissionsList from "../components/SubmissionList";

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, markProblemSolved, problem, isProblemLoading } = useProblemStore();
  const { authUser } = useAuthStore();

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [hasUserEditedCode, setHasUserEditedCode] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { executeCode, submission, isExecuting } = useExecutionStore();

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
    getSubmissionForProblem(id);
  }, [getProblemById, getSubmissionCountForProblem, getSubmissionForProblem, id]);

  const latestSavedSubmission = useMemo(
    () => submissions?.find((item) => item.sourceCode) || null,
    [submissions]
  );

  const initialCode = useMemo(
    () =>
      latestSavedSubmission?.sourceCode ||
      problem?.codeSnippets?.[selectedLanguage] ||
      "",
    [latestSavedSubmission?.sourceCode, problem, selectedLanguage]
  );

  const editorCode = hasUserEditedCode ? code : initialCode;

  const testcases = useMemo(
    () =>
      problem?.testcases?.map((tc) => ({
        input: tc.input,
        output: tc.output,
      })) || [],
    [problem]
  );

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, getSubmissionForProblem, id]);

  console.log("submission", submissions);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode("");
    setHasUserEditedCode(false);
  };

  const handleRunCode = async (e, isSubmit = false) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      const result = await executeCode(editorCode, language_id, stdin, expected_outputs, id, isSubmit);

      if (isSubmit && result?.submission?.status === "Accepted") {
        markProblemSolved(id, authUser?.id);
      }

      if (isSubmit && result?.submission) {
        getSubmissionCountForProblem(id);
        getSubmissionForProblem(id);
      }
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none">
            <p className="text-lg mb-6">{problem.description}</p>

            {problem.examples && (
              <>
                <h3 className="text-xl font-bold mb-4">Examples:</h3>
                {Object.entries(problem.examples).map(
                  ([lang, example]) => (
                    <div
                      key={lang}
                      className="bg-base-200 p-6 rounded-xl mb-6 font-mono"
                    >
                      <div className="mb-4">
                        <div className="text-indigo-300 mb-2 text-base font-semibold">
                          Input:
                        </div>
                        <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                          {example.input}
                        </span>
                      </div>
                      <div className="mb-4">
                        <div className="text-indigo-300 mb-2 text-base font-semibold">
                          Output:
                        </div>
                        <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                          {example.output}
                        </span>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="text-emerald-300 mb-2 text-base font-semibold">
                            Explanation:
                          </div>
                          <p className="text-base-content/70 text-lg font-sem">
                            {example.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                )}
              </>
            )}

            {problem.constraints && (
              <>
                <h3 className="text-xl font-bold mb-4">Constraints:</h3>
                <div className="bg-base-200 p-6 rounded-xl mb-6">
                  <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                    {problem.constraints}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return (
          <SubmissionsList
            submissions={submissions}
            isLoading={isSubmissionsLoading}
          />
        );
      case "discussion":
        return (
          <div className="p-4 text-center text-base-content/70">
            No discussions yet
          </div>
        );
      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-base-200 p-6 rounded-xl">
                <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                  {problem.hints}
                </span>
              </div>
            ) : (
              <div className="text-center text-base-content/70">
                No hints available
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-base-300 w-full overflow-hidden">
      {/* Navbar - flex-none so it doesn't shrink */}
      <nav className="navbar bg-base-100 border-b border-base-300 px-4 flex-col md:flex-row items-start md:items-center py-2 gap-4 flex-none z-10">
        <div className="flex-1 w-full md:w-auto">
          <Link to={"/"} className="flex items-center gap-2 text-primary">
            <Home className="w-5 h-5" />
            <span className="font-bold hidden sm:inline">Home</span>
            <ChevronRight className="w-4 h-4 text-base-content/50" />
          </Link>
          <div className="mt-1 flex items-center gap-4">
            <h1 className="text-lg font-bold truncate max-w-xs sm:max-w-md">{problem.title}</h1>
            <div className="hidden lg:flex items-center gap-3 text-xs text-base-content/60">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated {new Date(problem.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {submissionCount} Submissions</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <button className={`btn btn-ghost btn-sm btn-circle ${isBookmarked ? "text-primary" : ""}`} onClick={() => setIsBookmarked(!isBookmarked)}>
            <Bookmark className="w-4 h-4" />
          </button>
          <select className="select select-bordered select-sm w-32" value={selectedLanguage} onChange={handleLanguageChange}>
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
            ))}
          </select>
          <button
            className={`btn btn-primary btn-sm gap-2 ${isExecuting ? "loading" : ""}`}
            onClick={(e) => handleRunCode(e, false)}
            disabled={isExecuting}
          >
            {!isExecuting && <Play className="w-3 h-3" />} Run
          </button>
          <button
            className="btn btn-success btn-sm gap-2"
            onClick={(e) => handleRunCode(e, true)}
            disabled={isExecuting}
          >
            Submit
          </button>
        </div>
      </nav>

      {/* Main Workspace */}
      <div className="flex flex-col lg:flex-row flex-1 p-2 gap-2 min-h-0 overflow-y-auto lg:overflow-hidden">

        {/* Left Panel - Problem Details */}
        <div className="flex-1 bg-base-100 rounded-xl flex flex-col border border-base-300 shadow-sm overflow-hidden min-h-[500px] lg:min-h-0">
          {/* Tabs Header */}
          <div className="flex border-b border-base-300 bg-base-200/50 flex-none px-2 pt-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <button className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'description' ? 'border-primary text-primary' : 'border-transparent text-base-content/70 hover:text-base-content'}`} onClick={() => setActiveTab('description')}><FileText className="w-4 h-4" /> Description</button>
            <button className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'submissions' ? 'border-primary text-primary' : 'border-transparent text-base-content/70 hover:text-base-content'}`} onClick={() => setActiveTab('submissions')}><Code2 className="w-4 h-4" /> Submissions</button>
            <button className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'discussion' ? 'border-primary text-primary' : 'border-transparent text-base-content/70 hover:text-base-content'}`} onClick={() => setActiveTab('discussion')}><MessageSquare className="w-4 h-4" /> Discussion</button>
            <button className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'hints' ? 'border-primary text-primary' : 'border-transparent text-base-content/70 hover:text-base-content'}`} onClick={() => setActiveTab('hints')}><Lightbulb className="w-4 h-4" /> Hints</button>
          </div>
          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-base-100">
            {renderTabContent()}
          </div>
        </div>

        {/* Right Panel - Code & Console */}
        <div className="flex-1 flex flex-col gap-2 min-h-[800px] lg:min-h-0">

          {/* Top Right - Editor */}
          <div className="flex-[3] bg-base-100 rounded-xl flex flex-col border border-base-300 shadow-sm overflow-hidden min-h-[400px]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-base-300 bg-base-200/50 flex-none">
              <div className="flex items-center gap-2 text-sm font-medium text-base-content/70">
                <Code2 className="w-4 h-4" /> Code
              </div>
            </div>
            <div className="flex-1 w-full min-h-0 relative">
              <Editor
                height="100%"
                language={selectedLanguage.toLowerCase()}
                theme="vs-dark"
                value={editorCode}
                onChange={(value) => {
                  setCode(value || "");
                  setHasUserEditedCode(true);
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 16,
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </div>
          </div>

          {/* Bottom Right - Console / Test Cases */}
          <div className="flex-[2] bg-base-100 rounded-xl flex flex-col border border-base-300 shadow-sm overflow-hidden min-h-[300px]">
            <div className="flex items-center px-4 py-2 border-b border-base-300 bg-base-200/50 flex-none">
              <div className="flex items-center gap-2 text-sm font-medium text-base-content/70">
                <CheckCircle className="w-4 h-4" /> Test Cases
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-base-100">
              {submission ? (
                <Submission submission={submission} />
              ) : (
                <div className="flex flex-col gap-4">
                  {testcases.map((testCase, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <div className="text-sm font-semibold text-base-content/70">Case {index + 1}</div>
                      <div className="bg-base-200 rounded-lg p-3 font-mono text-sm">
                        <div className="text-base-content/50 mb-1">Input:</div>
                        <div className="text-base-content">{testCase.input}</div>
                        <div className="text-base-content/50 mt-3 mb-1">Expected Output:</div>
                        <div className="text-base-content">{testCase.output}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
