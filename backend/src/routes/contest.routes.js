import express from "express";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import {
  createContest,
  getAllContests,
  getContestById,
  updateContest,
  deleteContest,
  joinContest,
  getLeaderboard,
  submitContestSolution,
  declareWinner,
} from "../controllers/contest.controller.js";

const contestRoutes = express.Router();

// Admin routes
contestRoutes.post("/create", authMiddleware, checkAdmin, createContest);
contestRoutes.put("/:id", authMiddleware, checkAdmin, updateContest);
contestRoutes.delete("/:id", authMiddleware, checkAdmin, deleteContest);
contestRoutes.post("/:id/declare-winner", authMiddleware, declareWinner);

// User routes
contestRoutes.get("/all", authMiddleware, getAllContests);
contestRoutes.get("/:id", authMiddleware, getContestById);
contestRoutes.post("/:id/join", authMiddleware, joinContest);
contestRoutes.get("/:id/leaderboard", authMiddleware, getLeaderboard);
contestRoutes.post("/:id/submit", authMiddleware, submitContestSolution);

export default contestRoutes;
