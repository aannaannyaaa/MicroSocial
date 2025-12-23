import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Post from "../models/Post";
import Like from "../models/Like";
import Comment from "../models/Comment";
import { fail, ok } from "../utils/errorResponse";

export const createPost = async (req: AuthRequest, res: Response) => {
  const { content, imageUrl } = req.body;
  if (!content) return res.status(400).json(fail(400, "Content required"));

  const post = await Post.create({
    userId: req.userId,
    content,
    imageUrl
  });

  res.status(201).json(ok(post, "Post created"));
};

export const getFeed = async (req: AuthRequest, res: Response) => {
  const page = parseInt((req.query.page as string) || "1", 10);
  const limit = parseInt((req.query.limit as string) || "10", 10);
  const skip = (page - 1) * limit;

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("userId", "username avatar")
    .lean();

  const total = await Post.countDocuments();

  const withLikeFlag = await Promise.all(
    posts.map(async (p) => {
      const liked = await Like.findOne({
        userId: req.userId,
        postId: p._id
      });
      return { ...p, isLiked: !!liked };
    })
  );

  res.json(
    ok(
      {
        posts: withLikeFlag,
        pagination: { page, limit, total }
      },
      "Feed"
    )
  );
};

export const getUserPosts = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  const posts = await Post.find({ userId })
    .sort({ createdAt: -1 })
    .populate("userId", "username avatar")
    .lean();

  res.json(ok({ posts }, "User posts"));
};
