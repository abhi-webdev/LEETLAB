import React, { useState, useEffect } from "react";
import { useContestStore } from "../store/useContestStore";
import { useProblemStore } from "../store/useProblemStore";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Trophy, Plus, X, Search } from "lucide-react";
import toast from "react-hot-toast";

function CreateContestPage() {
  const { createContest, isCreating } = useContestStore();
  const { problems, getAllProblems } = useProblemStore();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProblemSelector, setShowProblemSelector] = useState(false);

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  const filteredProblems = (problems || []).filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedProblems.find((sp) => sp.problemId === p.id)
  );

  const handleAddProblem = (problem) => {
    setSelectedProblems((prev) => [
      ...prev,
      {
        problemId: problem.id,
        title: problem.title,
        difficulty: problem.difficulty,
        points: 100,
        order: prev.length,
      },
    ]);
    setShowProblemSelector(false);
    setSearchQuery("");
  };

  const handleRemoveProblem = (problemId) => {
    setSelectedProblems((prev) =>
      prev.filter((p) => p.problemId !== problemId).map((p, i) => ({ ...p, order: i }))
    );
  };

  const handlePointsChange = (problemId, points) => {
    setSelectedProblems((prev) =>
      prev.map((p) => (p.problemId === problemId ? { ...p, points: parseInt(points) || 0 } : p))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Title is required");
    if (!startTime) return toast.error("Start time is required");
    if (!endTime) return toast.error("End time is required");
    if (selectedProblems.length === 0) return toast.error("Add at least one problem");
    if (new Date(startTime) >= new Date(endTime))
      return toast.error("Start time must be before end time");

    const result = await createContest({
      title: title.trim(),
      description: description.trim(),
      startTime,
      endTime,
      problems: selectedProblems.map((p) => ({
        problemId: p.problemId,
        points: p.points,
        order: p.order,
      })),
    });

    if (result) {
      navigate("/contests");
    }
  };

  const getDiffColor = (diff) => {
    switch (diff) {
      case "EASY": return "badge-success";
      case "MEDIUM": return "badge-warning";
      case "HARD": return "badge-error";
      default: return "badge-neutral";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-12 px-4">
      {/* Background glow */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary opacity-10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary opacity-10 blur-3xl rounded-full"></div>

      <div className="z-10 w-full max-w-3xl">
        <h1 className="text-3xl font-extrabold mb-2">
          <Trophy className="inline w-8 h-8 mr-2 text-primary" />
          Create <span className="text-primary">Contest</span>
        </h1>
        <p className="text-gray-400 mb-8">Set up a new coding contest for students</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Contest Title *</span>
            </label>
            <input
              type="text"
              className="input input-bordered bg-base-200 w-full"
              placeholder="e.g. Weekly Challenge #1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered bg-base-200 w-full h-24"
              placeholder="Describe the contest rules and objectives..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Time inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Start Time *
                </span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered bg-base-200 w-full"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-1">
                  <Clock className="w-4 h-4" /> End Time *
                </span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered bg-base-200 w-full"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Selected Problems */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Problems ({selectedProblems.length} selected)
              </span>
            </label>

            {selectedProblems.length > 0 && (
              <div className="space-y-2 mb-4">
                {selectedProblems.map((p, idx) => (
                  <div
                    key={p.problemId}
                    className="flex items-center gap-3 bg-base-200 rounded-xl px-4 py-3 border border-base-300"
                  >
                    <span className="font-mono text-sm text-gray-500 w-6">
                      {idx + 1}.
                    </span>
                    <span className="flex-1 font-medium">{p.title}</span>
                    <span className={`badge ${getDiffColor(p.difficulty)} badge-sm`}>
                      {p.difficulty}
                    </span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        className="input input-bordered input-sm bg-base-300 w-20 text-center"
                        value={p.points}
                        onChange={(e) => handlePointsChange(p.problemId, e.target.value)}
                        min="1"
                      />
                      <span className="text-xs text-gray-400">pts</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveProblem(p.problemId)}
                      className="btn btn-ghost btn-sm btn-circle text-error"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Problem Button / Selector */}
            {!showProblemSelector ? (
              <button
                type="button"
                onClick={() => setShowProblemSelector(true)}
                className="btn btn-outline btn-sm gap-2 border-dashed"
              >
                <Plus className="w-4 h-4" /> Add Problem
              </button>
            ) : (
              <div className="bg-base-200 rounded-xl border border-base-300 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    className="input input-sm input-bordered bg-base-300 flex-1"
                    placeholder="Search problems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowProblemSelector(false);
                      setSearchQuery("");
                    }}
                    className="btn btn-ghost btn-sm btn-circle"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredProblems.length > 0 ? (
                    filteredProblems.map((problem) => (
                      <button
                        key={problem.id}
                        type="button"
                        onClick={() => handleAddProblem(problem)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-base-300 transition-colors text-left"
                      >
                        <span className="font-medium text-sm">{problem.title}</span>
                        <span className={`badge ${getDiffColor(problem.difficulty)} badge-sm`}>
                          {problem.difficulty}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4 text-sm">
                      No problems found
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating...
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5" />
                  Create Contest
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/contests")}
              className="btn btn-ghost"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateContestPage;
