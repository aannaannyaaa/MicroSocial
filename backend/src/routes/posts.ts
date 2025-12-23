import { Router } from "express";
import { auth } from "../middleware/auth";
import { createPost, getFeed, getUserPosts } from "../controllers/postController";

const router = Router();

router.get("/feed", auth, getFeed);
router.post("/upload", auth, createPost);
router.get("/user/:userId", auth, getUserPosts);

export default router;
