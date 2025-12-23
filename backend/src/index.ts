import express from "express";
import cors from "cors";
import { config } from "./config/env";
import { connectDB } from "./config/database";
import { errorHandler } from "./middleware/errorHandler";

import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import likeRoutes from "./routes/likes";
import commentRoutes from "./routes/comments";
import userRoutes from "./routes/users";

const app = express();

app.use(
  cors({
    origin: [config.frontendUrl, "http://localhost:8081"],
    credentials: true
  })
);
app.use(express.json());

connectDB();

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "OK" });
});

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/like", likeRoutes);
app.use("/comment", commentRoutes);
app.use("/user", userRoutes)

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Backend running on http://localhost:${config.port}`);
});
