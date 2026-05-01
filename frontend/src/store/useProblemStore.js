import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  createdProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,
  isUpdating: false,

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });

      const res = await axiosInstance.get("/problems/get-all-problems");

      set({ problems: res.data.problems });
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.get(`/problems/get-problem/${id}`);

      set({ problem: res.data.problem });
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved-problems");

      set({ solvedProblems: res.data.problems });
    } catch (error) {
      console.log("Error getting solved problems", error);
      toast.error("Error getting solved problems");
    }
  },

  getCreatedProblemsByUser: async () => {
    try {
      set({ isProblemsLoading: true });
      const res = await axiosInstance.get("/problems/get-created-problems");
      set({ createdProblems: res.data.problems });
    } catch (error) {
      console.log("Error getting created problems", error);
      toast.error("Error getting created problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  updateProblem: async (id, data) => {
    try {
      set({ isUpdating: true });
      const res = await axiosInstance.put(`/problems/update-problem/${id}`, data);
      toast.success(res.data.message || "Problem updated successfully");
      return res.data.problem;
    } catch (error) {
      console.log("Error updating problem", error);
      toast.error(error.response?.data?.error || "Error updating problem");
      throw error;
    } finally {
      set({ isUpdating: false });
    }
  },

  markProblemSolved: (problemId, userId) => {
    set((state) => ({
      problems: state.problems.map((problem) => {
        if (problem.id !== problemId) return problem;

        const solvedBy = problem.solvedBy || [];
        const alreadyMarked = solvedBy.some((entry) => entry.userId === userId);

        return alreadyMarked
          ? problem
          : {
              ...problem,
              solvedBy: [...solvedBy, { userId, problemId }],
            };
      }),
    }));
  }

  
}));
