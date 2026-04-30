import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useContestStore = create((set, get) => ({
  contests: [],
  contest: null,
  leaderboard: [],
  isContestsLoading: false,
  isContestLoading: false,
  isCreating: false,
  isJoining: false,
  isSubmitting: false,

  getAllContests: async () => {
    try {
      set({ isContestsLoading: true });
      const res = await axiosInstance.get("/contest/all");
      set({ contests: res.data.contests });
    } catch (error) {
      console.log("Error getting contests", error);
      toast.error("Error fetching contests");
    } finally {
      set({ isContestsLoading: false });
    }
  },

  getContestById: async (id) => {
    try {
      set({ isContestLoading: true });
      const res = await axiosInstance.get(`/contest/${id}`);
      set({ contest: res.data.contest });
    } catch (error) {
      console.log("Error getting contest", error);
      toast.error("Error fetching contest");
    } finally {
      set({ isContestLoading: false });
    }
  },

  createContest: async (data) => {
    try {
      set({ isCreating: true });
      const res = await axiosInstance.post("/contest/create", data);
      toast.success(res.data.message);
      // Refresh contests list
      get().getAllContests();
      return res.data.contest;
    } catch (error) {
      console.log("Error creating contest", error);
      toast.error(error.response?.data?.error || "Error creating contest");
      return null;
    } finally {
      set({ isCreating: false });
    }
  },

  joinContest: async (id) => {
    try {
      set({ isJoining: true });
      const res = await axiosInstance.post(`/contest/${id}/join`);
      toast.success(res.data.message);
      // Refresh contest detail
      get().getContestById(id);
    } catch (error) {
      console.log("Error joining contest", error);
      toast.error(error.response?.data?.error || "Error joining contest");
    } finally {
      set({ isJoining: false });
    }
  },

  getLeaderboard: async (id) => {
    try {
      const res = await axiosInstance.get(`/contest/${id}/leaderboard`);
      set({ leaderboard: res.data.leaderboard });
    } catch (error) {
      console.log("Error getting leaderboard", error);
      toast.error("Error fetching leaderboard");
    }
  },

  submitContestSolution: async (contestId, data) => {
    try {
      set({ isSubmitting: true });
      const res = await axiosInstance.post(`/contest/${contestId}/submit`, data);
      toast.success(res.data.message);
      // Refresh leaderboard
      get().getLeaderboard(contestId);
      return res.data;
    } catch (error) {
      console.log("Error submitting solution", error);
      toast.error(error.response?.data?.error || "Error submitting solution");
      return null;
    } finally {
      set({ isSubmitting: false });
    }
  },

  deleteContest: async (id) => {
    try {
      const res = await axiosInstance.delete(`/contest/${id}`);
      toast.success(res.data.message);
      get().getAllContests();
    } catch (error) {
      console.log("Error deleting contest", error);
      toast.error("Error deleting contest");
    }
  },

  declareWinner: async (contestId, winnerId) => {
    try {
      const res = await axiosInstance.post(`/contest/${contestId}/declare-winner`, {
        winnerId,
      });
      toast.success(res.data.message);
      // Refresh contest detail
      get().getContestById(contestId);
      return res.data;
    } catch (error) {
      console.log("Error declaring winner", error);
      toast.error(error.response?.data?.error || "Error declaring winner");
      return null;
    }
  },
}));
