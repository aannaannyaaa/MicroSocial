import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Comment from "../models/Comment";
import Post from "../models/Post";
import { fail, ok } from "../utils/errorResponse";

export const addComment = async (req: AuthRequest, res: Response) => {
  const { postId } = req.params;
  const { content } = req.body;
  if (!content) return res.status(400).json(fail(400, "Content required"));

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json(fail(404, "Post not found"));

  const comment = await Comment.create({
    userId: req.userId,
    postId,
    content
  });

  post.commentCount += 1;
  await post.save();

  res.status(201).json(ok(comment, "Comment added"));
};

export const getComments = async (req: AuthRequest, res: Response) => {
  const { postId } = req.params;
  const comments = await Comment.find({ postId })
    .sort({ createdAt: -1 })
    .populate("userId", "username avatar");

  res.json(ok(comments, "Comments"));
};
