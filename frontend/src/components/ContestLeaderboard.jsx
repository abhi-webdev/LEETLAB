import React from "react";
import { Trophy, Medal } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ContestLeaderboard = ({ leaderboard = [], participants = [] }) => {
  const { authUser } = useAuthStore();

  // Use participants if leaderboard is empty (from contest detail)
  const data = leaderboard.length > 0
    ? leaderboard
    : participants.map((p, i) => ({
        rank: i + 1,
        userId: p.userId,
        name: p.user?.name || "Anonymous",
        image: p.user?.image,
        email: p.user?.email,
        score: p.score,
      }));

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return "text-yellow-400";
      case 2:
        return "text-gray-300";
      case 3:
        return "text-amber-600";
      default:
        return "text-gray-400";
    }
  };

  const getRankIcon = (rank) => {
    if (rank <= 3) {
      return <Trophy className={`w-5 h-5 ${getRankStyle(rank)}`} />;
    }
    return <span className="text-gray-500 font-mono w-5 text-center">{rank}</span>;
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Medal className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>No participants yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-sm">
        <thead>
          <tr className="text-gray-400">
            <th className="w-12">#</th>
            <th>User</th>
            <th className="text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr
              key={entry.userId}
              className={`hover:bg-base-300/50 transition-colors ${
                entry.userId === authUser?.id ? "bg-primary/10 border-l-2 border-primary" : ""
              }`}
            >
              <td>
                <div className="flex items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full">
                      <img
                        src={
                          entry.image ||
                          `https://api.dicebear.com/9.x/adventurer/svg?seed=${entry.email}`
                        }
                        alt={entry.name}
                      />
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-sm">
                      {entry.name}
                      {entry.userId === authUser?.id && (
                        <span className="text-primary text-xs ml-1">(You)</span>
                      )}
                    </span>
                  </div>
                </div>
              </td>
              <td className="text-right">
                <span className={`font-bold ${entry.rank <= 3 ? getRankStyle(entry.rank) : ""}`}>
                  {entry.score}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContestLeaderboard;
