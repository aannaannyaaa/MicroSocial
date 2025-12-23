import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Like from "../models/Like";
import Post from "../models/Post";
import { fail, ok } from "../utils/errorResponse";

export const toggleLike = async (req: AuthRequest, res: Response) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) return res.status(404).json(fail(404, "Post not found"));

  const existing = await Like.findOne({ userId: req.userId, postId });
  let isLiked: boolean;

  if (existing) {
    await existing.deleteOne();
    post.likeCount = Math.max(0, post.likeCount - 1);
    isLiked = false;
  } else {
    await Like.create({ userId: req.userId, postId });
    post.likeCount += 1;
    isLiked = true;
  }

  await post.save();
  res.json(ok({ postId, isLiked, likeCount: post.likeCount }, "Toggled like"));
};
