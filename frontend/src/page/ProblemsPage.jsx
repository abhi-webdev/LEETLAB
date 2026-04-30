import React, { useEffect, useState, useMemo } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  Loader,
  Search,
  CheckCircle2,
  Circle,
  Code2,
  Filter,
  BarChart3,
  Tag,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

// ── Data structure topic icons/colors ──────────────────────────
const topicConfig = {
  "Array":        { color: "from-blue-500 to-blue-600",    bg: "bg-blue-500/10",  border: "border-blue-500/30",  text: "text-blue-400" },
  "String":       { color: "from-green-500 to-green-600",  bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400" },
  "Hash Table":   { color: "from-purple-500 to-purple-600",bg: "bg-purple-500/10",border: "border-purple-500/30",text: "text-purple-400" },
  "Dynamic Programming": { color: "from-red-500 to-red-600", bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400" },
  "Math":         { color: "from-amber-500 to-amber-600",  bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
  "Sorting":      { color: "from-cyan-500 to-cyan-600",    bg: "bg-cyan-500/10",  border: "border-cyan-500/30",  text: "text-cyan-400" },
  "Greedy":       { color: "from-emerald-500 to-emerald-600",bg: "bg-emerald-500/10",border: "border-emerald-500/30",text: "text-emerald-400" },
  "Tree":         { color: "from-teal-500 to-teal-600",    bg: "bg-teal-500/10",  border: "border-teal-500/30",  text: "text-teal-400" },
  "Graph":        { color: "from-indigo-500 to-indigo-600",bg: "bg-indigo-500/10",border: "border-indigo-500/30",text: "text-indigo-400" },
  "Stack":        { color: "from-orange-500 to-orange-600",bg: "bg-orange-500/10",border: "border-orange-500/30",text: "text-orange-400" },
  "Queue":        { color: "from-pink-500 to-pink-600",    bg: "bg-pink-500/10",  border: "border-pink-500/30",  text: "text-pink-400" },
  "Linked List":  { color: "from-violet-500 to-violet-600",bg: "bg-violet-500/10",border: "border-violet-500/30",text: "text-violet-400" },
  "Binary Search":{ color: "from-sky-500 to-sky-600",      bg: "bg-sky-500/10",   border: "border-sky-500/30",   text: "text-sky-400" },
  "Recursion":    { color: "from-rose-500 to-rose-600",    bg: "bg-rose-500/10",  border: "border-rose-500/30",  text: "text-rose-400" },
  "Two Pointers": { color: "from-lime-500 to-lime-600",    bg: "bg-lime-500/10",  border: "border-lime-500/30",  text: "text-lime-400" },
  "Bit Manipulation": { color: "from-fuchsia-500 to-fuchsia-600",bg: "bg-fuchsia-500/10",border: "border-fuchsia-500/30",text: "text-fuchsia-400" },
};

const defaultTopicStyle = { color: "from-gray-500 to-gray-600", bg: "bg-gray-500/10", border: "border-gray-500/30", text: "text-gray-400" };

function getTopicStyle(tag) {
  return topicConfig[tag] || defaultTopicStyle;
}

function ProblemsPage() {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();
  const { authUser } = useAuthStore();

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTags, setSelectedTags] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, SOLVED, UNSOLVED
  const [showAllTopics, setShowAllTopics] = useState(false);

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  // ── Extract unique tags with problem counts ──
  const tagStats = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagMap = {};
    problems.forEach((p) => {
      (p.tags || []).forEach((t) => {
        if (!tagMap[t]) tagMap[t] = { tag: t, total: 0, solved: 0 };
        tagMap[t].total++;
        const isSolved = (p.solvedBy || []).some((s) => s.userId === authUser?.id);
        if (isSolved) tagMap[t].solved++;
      });
    });
    return Object.values(tagMap).sort((a, b) => b.total - a.total);
  }, [problems, authUser]);

  // ── Overall stats ──
  const stats = useMemo(() => {
    if (!Array.isArray(problems)) return { total: 0, solved: 0, easy: 0, medium: 0, hard: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 };
    let solved = 0, easy = 0, medium = 0, hard = 0, easySolved = 0, mediumSolved = 0, hardSolved = 0;
    problems.forEach((p) => {
      const isSolved = (p.solvedBy || []).some((s) => s.userId === authUser?.id);
      if (isSolved) solved++;
      if (p.difficulty === "EASY") { easy++; if (isSolved) easySolved++; }
      if (p.difficulty === "MEDIUM") { medium++; if (isSolved) mediumSolved++; }
      if (p.difficulty === "HARD") { hard++; if (isSolved) hardSolved++; }
    });
    return { total: problems.length, solved, easy, medium, hard, easySolved, mediumSolved, hardSolved };
  }, [problems, authUser]);

  // ── Filter problems ──
  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => difficulty === "ALL" || p.difficulty === difficulty)
      .filter((p) => {
        if (selectedTags.length === 0) return true;
        return selectedTags.some((t) => (p.tags || []).includes(t));
      })
      .filter((p) => {
        if (statusFilter === "ALL") return true;
        const isSolved = (p.solvedBy || []).some((s) => s.userId === authUser?.id);
        return statusFilter === "SOLVED" ? isSolved : !isSolved;
      });
  }, [problems, search, difficulty, selectedTags, statusFilter, authUser]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const visibleTopics = showAllTopics ? tagStats : tagStats.slice(0, 8);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 w-full">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold">
            <Code2 className="inline w-9 h-9 mr-2 text-primary" />
            <span className="text-primary">Problems</span>
          </h1>
          <p className="mt-2 text-gray-400 text-lg">
            Practice data structures & algorithms to ace your interviews
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ══════════════ LEFT SIDEBAR ══════════════ */}
          <div className="lg:w-72 flex-shrink-0 space-y-5">
            {/* ── Progress Card ── */}
            <div className="bg-base-200 rounded-2xl p-5 border border-base-300">
              <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Your Progress
              </h3>
              <div className="flex items-center justify-center mb-4">
                <div className="radial-progress text-primary" style={{ "--value": stats.total ? Math.round((stats.solved / stats.total) * 100) : 0, "--size": "5rem", "--thickness": "6px" }} role="progressbar">
                  <span className="text-lg font-bold">{stats.solved}/{stats.total}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-success font-medium">Easy</span>
                  <span className="text-gray-400">{stats.easySolved}/{stats.easy}</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-1.5">
                  <div className="bg-success rounded-full h-1.5 transition-all" style={{ width: `${stats.easy ? (stats.easySolved / stats.easy) * 100 : 0}%` }}></div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-warning font-medium">Medium</span>
                  <span className="text-gray-400">{stats.mediumSolved}/{stats.medium}</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-1.5">
                  <div className="bg-warning rounded-full h-1.5 transition-all" style={{ width: `${stats.medium ? (stats.mediumSolved / stats.medium) * 100 : 0}%` }}></div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-error font-medium">Hard</span>
                  <span className="text-gray-400">{stats.hardSolved}/{stats.hard}</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-1.5">
                  <div className="bg-error rounded-full h-1.5 transition-all" style={{ width: `${stats.hard ? (stats.hardSolved / stats.hard) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>

            {/* ── Topics / Data Structure Tags ── */}
            <div className="bg-base-200 rounded-2xl p-5 border border-base-300">
              <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Topics
              </h3>
              <div className="space-y-1.5">
                {visibleTopics.map(({ tag, total, solved }) => {
                  const style = getTopicStyle(tag);
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                        isSelected
                          ? `${style.bg} ${style.border} border ${style.text}`
                          : "hover:bg-base-300"
                      }`}
                    >
                      <span className={`font-medium ${isSelected ? style.text : ""}`}>
                        {tag}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500">{solved}/{total}</span>
                        {solved === total && total > 0 && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
              {tagStats.length > 8 && (
                <button
                  onClick={() => setShowAllTopics(!showAllTopics)}
                  className="btn btn-ghost btn-sm w-full mt-2 gap-1 text-gray-400"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAllTopics ? "rotate-180" : ""}`} />
                  {showAllTopics ? "Show less" : `Show all (${tagStats.length})`}
                </button>
              )}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="btn btn-ghost btn-xs w-full mt-2 text-gray-500"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* ══════════════ MAIN CONTENT ══════════════ */}
          <div className="flex-1 min-w-0">
            {/* ── Filter Bar ── */}
            <div className="flex flex-wrap gap-3 mb-5 items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  className="input input-bordered bg-base-200 w-full pl-10 input-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Difficulty */}
              <select
                className="select select-bordered select-sm bg-base-200"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="ALL">All Levels</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>

              {/* Status */}
              <select
                className="select select-bordered select-sm bg-base-200"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="SOLVED">✅ Solved</option>
                <option value="UNSOLVED">⬜ Unsolved</option>
              </select>
            </div>

            {/* ── Active Tag Filters ── */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs text-gray-500 self-center">
                  <Filter className="w-3 h-3 inline mr-1" />
                  Filtered by:
                </span>
                {selectedTags.map((tag) => {
                  const style = getTopicStyle(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`badge ${style.bg} ${style.border} border ${style.text} gap-1 cursor-pointer hover:opacity-80`}
                    >
                      {tag} ×
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── Results count ── */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">
                Showing <span className="font-bold text-white">{filteredProblems.length}</span> of {problems.length} problems
              </p>
            </div>

            {/* ══════════════ PROBLEM LIST ══════════════ */}
            <div className="space-y-2">
              {filteredProblems.length > 0 ? (
                filteredProblems.map((problem, index) => {
                  const isSolved = (problem.solvedBy || []).some(
                    (s) => s.userId === authUser?.id
                  );
                  return (
                    <Link
                      key={problem.id}
                      to={`/problem/${problem.id}`}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200 hover:shadow-lg group ${
                        isSolved
                          ? "bg-success/5 border-success/20 hover:border-success/40"
                          : "bg-base-200 border-base-300 hover:border-primary/40 hover:bg-base-200/80"
                      }`}
                    >
                      {/* Solved indicator */}
                      <div className="flex-shrink-0">
                        {isSolved ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-600" />
                        )}
                      </div>

                      {/* Number */}
                      <span className="text-sm text-gray-500 font-mono w-8">
                        {index + 1}.
                      </span>

                      {/* Title + Tags */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                          {problem.title}
                        </h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(problem.tags || []).map((tag, i) => {
                            const style = getTopicStyle(tag);
                            return (
                              <span
                                key={i}
                                className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${style.bg} ${style.text}`}
                              >
                                {tag}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Difficulty */}
                      <span
                        className={`badge badge-sm font-bold text-white flex-shrink-0 ${
                          problem.difficulty === "EASY"
                            ? "badge-success"
                            : problem.difficulty === "MEDIUM"
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        {problem.difficulty}
                      </span>

                      {/* Arrow */}
                      <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors flex-shrink-0" />
                    </Link>
                  );
                })
              ) : (
                <div className="text-center py-16 bg-base-200 rounded-2xl border border-base-300">
                  <Code2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-gray-500 text-lg">No problems match your filters</p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setDifficulty("ALL");
                      setSelectedTags([]);
                      setStatusFilter("ALL");
                    }}
                    className="btn btn-ghost btn-sm mt-3"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemsPage;
