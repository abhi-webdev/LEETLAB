import React, { useEffect } from 'react';
import { useProblemStore } from '../store/useProblemStore';
import { Link } from 'react-router-dom';
import { Edit2, ShieldAlert, Code2 } from 'lucide-react';

const AdminCreatedProblems = () => {
  const { createdProblems, getCreatedProblemsByUser, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getCreatedProblemsByUser();
  }, [getCreatedProblemsByUser]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY": return "text-success bg-success/10 border-success/20";
      case "MEDIUM": return "text-warning bg-warning/10 border-warning/20";
      case "HARD": return "text-error bg-error/10 border-error/20";
      default: return "text-base-content bg-base-300 border-base-300";
    }
  };

  if (isProblemsLoading) {
    return (
      <div className="bg-base-200/50 backdrop-blur-xl border border-base-300 p-8 rounded-[2.5rem] shadow-2xl flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-200/50 backdrop-blur-xl border border-base-300 p-8 rounded-[2.5rem] shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-base-content flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-primary" />
          Problems Created By You
          <span className="badge badge-primary">{createdProblems?.length || 0}</span>
        </h3>
        <Link to="/add-problem" className="btn btn-primary btn-sm">Add New</Link>
      </div>

      {!createdProblems || createdProblems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">You haven't created any problems yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {createdProblems.map((problem) => (
            <div key={problem.id} className="p-4 rounded-2xl bg-base-300/50 border border-base-300 flex items-center justify-between hover:border-primary/30 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-base-content group-hover:text-primary transition-colors">{problem.title}</h4>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(problem.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <Link to={`/edit-problem/${problem.id}`} className="btn btn-ghost btn-sm btn-circle hover:bg-primary/10 hover:text-primary transition-colors tooltip" data-tip="Edit Problem">
                <Edit2 className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCreatedProblems;
