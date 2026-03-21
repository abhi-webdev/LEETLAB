import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllSubmission, getAllTheSubmissionsForProblem, getSubmissionForProblem } from "../controllers/submission.controller.js";

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submission", authMiddleware, getAllSubmission);
submissionRoutes.get("/get-submission/:problemId", authMiddleware, getSubmissionForProblem);
submissionRoutes.get("/get-submissions-count/:problemId", authMiddleware, getAllTheSubmissionsForProblem);
    
export default submissionRoutes;