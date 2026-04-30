import React, { useEffect, useState } from "react";
import { useContestStore } from "../store/useContestStore";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Loader, Plus, Trophy, Filter } from "lucide-react";
import ContestCard from "../components/ContestCard";

function ContestListPage() {
  const { contests, isContestsLoading, getAllContests, deleteContest } = useContestStore();
  const { authUser } = useAuthStore();
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    getAllContests();
  }, [getAllContests]);

  const filteredContests = contests.filter((c) => {
    if (filter === "ALL") return true;
    return c.liveStatus === filter;
  });

  if (isContestsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 w-full">
      {/* Background glow */}
      <div className="absolute top-16 left-0 w-full md:w-1/3 h-1/3 bg-primary opacity-20 blur-3xl rounded-md"></div>
      <div className="absolute top-32 right-0 w-1/4 h-1/4 bg-secondary opacity-15 blur-3xl rounded-full"></div>

      {/* Header */}
      <div className="z-10 w-full max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold">
              <Trophy className="inline w-9 h-9 mr-2 text-primary" />
              <span className="text-primary">Contests</span>
            </h1>
            <p className="mt-2 text-gray-400 text-lg">
              Compete with other students in timed coding challenges
            </p>
          </div>
          {authUser?.role === "ADMIN" && (
            <Link to="/create-contest" className="btn btn-primary gap-2">
              <Plus className="w-5 h-5" />
              Create Contest
            </Link>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["ALL", "ACTIVE", "UPCOMING", "ENDED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm ${
                filter === f ? "btn-primary" : "btn-ghost border-base-300"
              }`}
            >
              {f === "ACTIVE" && "🔴 "}
              {f === "ALL"
                ? `All (${contests.length})`
                : `${f.charAt(0) + f.slice(1).toLowerCase()} (${contests.filter((c) => c.liveStatus === f).length})`}
            </button>
          ))}
        </div>

        {/* Contest Grid */}
        {filteredContests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredContests.map((contest) => (
              <ContestCard
                key={contest.id}
                contest={contest}
                onDelete={deleteContest}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg text-gray-500">
              {filter === "ALL"
                ? "No contests available yet"
                : `No ${filter.toLowerCase()} contests`}
            </p>
            {authUser?.role === "ADMIN" && filter === "ALL" && (
              <Link to="/create-contest" className="btn btn-primary mt-4">
                Create the first contest
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContestListPage;
