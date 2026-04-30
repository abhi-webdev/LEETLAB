import React from "react";
import { Link } from "react-router-dom";
import { Users, Clock, Trophy, Trash2 } from "lucide-react";
import ContestTimer from "./ContestTimer";
import { useAuthStore } from "../store/useAuthStore";

const statusConfig = {
  UPCOMING: {
    badge: "badge-info",
    glow: "shadow-info/20",
    border: "border-info/30",
    label: "Upcoming",
  },
  ACTIVE: {
    badge: "badge-success",
    glow: "shadow-success/20",
    border: "border-success/30",
    label: "🔴 Live",
  },
  ENDED: {
    badge: "badge-neutral",
    glow: "shadow-neutral/10",
    border: "border-neutral/30",
    label: "Ended",
  },
};

const ContestCard = ({ contest, onDelete }) => {
  const { authUser } = useAuthStore();
  const status = contest.liveStatus || "UPCOMING";
  const config = statusConfig[status];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`card bg-base-200 border ${config.border} shadow-lg ${config.glow} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="card-body p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`badge ${config.badge} badge-sm font-bold ${status === "ACTIVE" ? "animate-pulse" : ""}`}>
                {config.label}
              </span>
              {contest.isJoined && (
                <span className="badge badge-outline badge-success badge-sm">Joined</span>
              )}
            </div>
            <Link to={`/contest/${contest.id}`}>
              <h2 className="card-title text-lg hover:text-primary transition-colors cursor-pointer">
                {contest.title}
              </h2>
            </Link>
          </div>
          {authUser?.role === "ADMIN" && onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete(contest.id);
              }}
              className="btn btn-ghost btn-sm btn-circle text-error"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Description */}
        {contest.description && (
          <p className="text-sm text-gray-400 line-clamp-2 mt-1">
            {contest.description}
          </p>
        )}

        {/* Timer */}
        <div className="mt-3">
          {status === "UPCOMING" && (
            <div>
              <span className="text-xs text-gray-500 mb-1 block">Starts in</span>
              <ContestTimer targetDate={contest.startTime} />
            </div>
          )}
          {status === "ACTIVE" && (
            <div>
              <span className="text-xs text-gray-500 mb-1 block">Ends in</span>
              <ContestTimer targetDate={contest.endTime} />
            </div>
          )}
          {status === "ENDED" && (
            <p className="text-sm text-gray-500">
              Ended {formatDate(contest.endTime)}
            </p>
          )}
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-base-300">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {contest._count?.participants || 0}
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              {contest._count?.problems || 0} problems
            </span>
          </div>
          <Link
            to={`/contest/${contest.id}`}
            className="btn btn-primary btn-sm"
          >
            {status === "ENDED" ? "Results" : status === "ACTIVE" ? "Enter" : "View"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;
