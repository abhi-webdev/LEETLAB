import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executionRoutes from "./routes/executeCode.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        // origin: "http://localhost:5173"
        origin: ["http://localhost:5173", process.env.CLIENT_URL],
        credentials: true,
    }),
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);

app.get("/", (req, res) => {
    res.send("Hello gyus, welcome to leetlab");
});

app.listen(port, () => {
    console.log(`server app listening on port ${port}!`);
});
