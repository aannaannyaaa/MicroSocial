import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Post, { MAX_CONTENT_LENGTH } from "../models/Post";
import Like from "../models/Like";
import Comment from "../models/Comment";
import { fail, ok } from "../utils/errorResponse";
import mongoose from "mongoose";

const parsePagination = (req: AuthRequest) => {
  const page = Math.max(
    1,
    parseInt((req.query.page as string) || "1", 10)
  );
  const limit = Math.min(
    50,
    Math.max(1, parseInt((req.query.limit as string) || "10", 10))
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// Helper to normalize post for frontend
const normalizePost = (
  post: any, // lean() or populated doc
  isLiked: boolean,
  comments: any[] = []
) => ({
  _id: post._id.toString(),
  content: post.content,
  author: post.userId,
  likes: [],
  likesCount: post.likeCount || 0,
  comments,
  commentsCount: post.commentCount || comments.length || 0,
  createdAt: post.createdAt.toISOString(),
  updatedAt: post.updatedAt.toISOString(),
  isLiked,
});

// Create text-only post
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const rawContent = (req.body.content || "").toString().trim();

    if (!rawContent) {
      return res.status(400).json(fail(400, "Content required"));
    }

    if (rawContent.length > MAX_CONTENT_LENGTH) {
      return res
        .status(400)
        .json(
          fail(
            400,
            `Content exceeds ${MAX_CONTENT_LENGTH} characters`
          )
        );
    }

    const post = await Post.create({
      userId: req.userId,
      content: rawContent,
    });

    const populated = await Post.findById(post._id)
      .populate("userId", "username name avatar")
      .lean();

    const responsePost = normalizePost(populated!, false);

    return res.status(201).json(ok(responsePost, "Post created"));
  } catch (err) {
    return res.status(500).json(fail(500, "Failed to create post"));
  }
};

// Feed with pagination
export const getFeed = async (req: AuthRequest, res: Response) => {
  try {
    const { page, limit, skip } = parsePagination(req);

    const [posts, total] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "username name avatar")
        .lean(),
      Post.countDocuments(),
    ]);

    // Get liked posts by current user in one query
    const postIds = posts.map((p) => p._id);
    const likes = await Like.find({
      userId: req.userId,
      postId: { $in: postIds },
    }).lean();

    const likedSet = new Set(
      likes.map((l) => (l.postId as mongoose.Types.ObjectId).toString())
    );

    const responsePosts = posts.map((p: any) =>
      normalizePost(p, likedSet.has(p._id.toString()))
    );

    const pages = Math.ceil(total / limit);

    return res.json(
      ok(
        {
          data: responsePosts,
          pagination: { page, limit, total, pages },
        },
        "Feed"
      )
    );
  } catch (err) {
    return res.status(500).json(fail(500, "Failed to load feed"));
  }
};

// Single post by id
export const getPostById = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json(fail(400, "Invalid post id"));
    }

    const post = await Post.findById(postId)
      .populate("userId", "username name avatar")
      .lean();

    if (!post) {
      return res.status(404).json(fail(404, "Post not found"));
    }

    const liked = await Like.findOne({
      userId: req.userId,
      postId: post._id,
    }).lean();

    const comments = await Comment.find({ postId: post._id })
      .sort({ createdAt: 1 })
      .populate("userId", "username name avatar")
      .lean();

    const normalizedComments = comments.map((c: any) => ({
      _id: c._id.toString(),
      content: c.content,
      author: c.userId,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));

    const responsePost = normalizePost(post, !!liked, normalizedComments);

    return res.json(ok(responsePost, "Post"));
  } catch (err) {
    return res.status(500).json(fail(500, "Failed to load post"));
  }
};

// User posts (paginated)
export const getUserPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { page, limit, skip } = parsePagination(req);

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json(fail(400, "Invalid user id"));
    }

    const [posts, total] = await Promise.all([
      Post.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "username name avatar")
        .lean(),
      Post.countDocuments({ userId }),
    ]);

    const postIds = posts.map((p) => p._id);
    const likes = await Like.find({
      userId: req.userId,
      postId: { $in: postIds },
    }).lean();
    const likedSet = new Set(
      likes.map((l) => (l.postId as mongoose.Types.ObjectId).toString())
    );

    const responsePosts = posts.map((p: any) =>
      normalizePost(p, likedSet.has(p._id.toString()))
    );

    const pages = Math.ceil(total / limit);

    return res.json(
      ok(
        {
          data: responsePosts,
          pagination: { page, limit, total, pages },
        },
        "User posts"
      )
    );
  } catch (err) {
    return res.status(500).json(fail(500, "Failed to load user posts"));
  }
};

// Update post (content only, owner only)
export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const rawContent = (req.body.content || "").toString().trim();

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json(fail(400, "Invalid post id"));
    }

    if (!rawContent) {
      return res.status(400).json(fail(400, "Content required"));
    }

    if (rawContent.length > MAX_CONTENT_LENGTH) {
      return res
        .status(400)
        .json(
          fail(
            400,
            `Content exceeds ${MAX_CONTENT_LENGTH} characters`
          )
        );
    }

    const post = await Post.findOneAndUpdate(
      { _id: postId, userId: req.userId },
      { content: rawContent },
      { new: true }
    )
      .populate("userId", "username name avatar")
      .lean();

    if (!post) {
      return res.status(404).json(fail(404, "Post not found"));
    }

    const responsePost = normalizePost(post, false);

    return res.json(ok(responsePost, "Post updated"));
  } catch (err) {
    return res.status(500).json(fail(500, "Failed to update post"));
  }
};

// Delete post (owner only)
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json(fail(400, "Invalid post id"));
    }

    const deleted = await Post.findOneAndDelete({
      _id: postId,
      userId: req.userId,
    });

    if (!deleted) {
      return res.status(404).json(fail(404, "Post not found"));
    }

    // Clean up likes/comments for this post
    await Promise.all([
      Like.deleteMany({ postId }),
      Comment.deleteMany({ postId }),
    ]);

    return res.json(ok({ success: true }, "Post deleted"));
  } catch (err) {
    return res.status(500).json(fail(500, "Failed to delete post"));
  }
};
