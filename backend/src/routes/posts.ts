import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  createPost,
  getFeed,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController";

const router = Router();

// Feed
router.get("/feed", auth, getFeed);

// Create text post
router.post("/", auth, createPost);

// Single post
router.get("/:postId", auth, getPostById);

// Update post
router.put("/:postId", auth, updatePost);

// Delete post
router.delete("/:postId", auth, deletePost);

// User posts (paginated, ?page=&limit=)
router.get("/user/:userId", auth, getUserPosts);

export default router;
