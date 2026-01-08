import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Like from "../models/Like";
import Post from "../models/Post";
import { fail, ok } from "../utils/errorResponse";
import mongoose from "mongoose";

export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json(fail(400, "Invalid post ID"));
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json(fail(404, "Post not found"));
    }

    const existingLike = await Like.findOne({ 
      userId: req.userId, 
      postId: post._id 
    });

    let isLiked: boolean;
    let likeCount: number;

    if (existingLike) {
      // Unlike
      await Like.findByIdAndDelete(existingLike._id);
      post.likeCount = Math.max(0, post.likeCount - 1);
      isLiked = false;
    } else {
      // Like
      await Like.create({ 
        userId: req.userId, 
        postId: post._id 
      });
      post.likeCount += 1;
      isLiked = true;
    }

    await post.save();

    res.json(
      ok({ 
        postId: post._id.toString(), 
        isLiked, 
        likeCount: post.likeCount 
      }, "Like toggled successfully")
    );
  } catch (error) {
    res.status(500).json(fail(500, "Failed to toggle like"));
  }
};
