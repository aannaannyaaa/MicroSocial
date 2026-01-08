import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Comment, { MAX_COMMENT_LENGTH } from "../models/Comment";
import Post from "../models/Post";
import { fail, ok } from "../utils/errorResponse";
import mongoose from "mongoose";

// Helper to normalize comment for frontend
const normalizeComment = (comment: any) => ({
  _id: comment._id.toString(),
  content: comment.content,
  author: comment.userId,
  createdAt: comment.createdAt.toISOString(),
  updatedAt: comment.updatedAt.toISOString(),
});

// Add comment
export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const rawContent = (req.body.content || "").toString().trim();

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json(fail(400, "Invalid post ID"));
    }

    if (!rawContent) {
      return res.status(400).json(fail(400, "Content required"));
    }

    if (rawContent.length > MAX_COMMENT_LENGTH) {
      return res.status(400).json(
        fail(400, `Comment exceeds ${MAX_COMMENT_LENGTH} characters`)
      );
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json(fail(404, "Post not found"));
    }

    const comment = await Comment.create({
      userId: req.userId,
      postId: post._id,
      content: rawContent,
    });

    // Populate and normalize ✅ FIXED
    const populated = await Comment.findById(comment._id)
      .populate("userId", "name username avatar")
      .lean();

    post.commentCount += 1;
    await post.save();

    const responseComment = normalizeComment(populated!);

    return res.status(201).json(
      ok(
        {
          comment: responseComment,
          postCommentCount: post.commentCount,
        },
        "Comment added"
      )
    );
  } catch (error) {
    return res.status(500).json(fail(500, "Failed to add comment"));
  }
};

// Get comments for post (paginated)
export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const page = Math.max(1, parseInt((req.query.page as string) || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt((req.query.limit as string) || "10", 10)));
    const skip = (page - 1) * limit;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json(fail(400, "Invalid post ID"));
    }

    const [comments, total] = await Promise.all([
      Comment.find({ postId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "name username avatar")
        .lean(),
      Comment.countDocuments({ postId }),
    ]);

    // ✅ FIXED: Use normalizeComment helper
    const responseComments = comments.map((c: any) => normalizeComment(c));

    const pages = Math.ceil(total / limit);

    return res.json(
      ok(
        {
          data: responseComments,
          pagination: { page, limit, total, pages },
        },
        "Comments"
      )
    );
  } catch (error) {
    return res.status(500).json(fail(500, "Failed to load comments"));
  }
};

// Delete comment (owner only)
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.isValidObjectId(commentId)) {
      return res.status(400).json(fail(400, "Invalid comment ID"));
    }

    const comment = await Comment.findOneAndDelete({
      _id: commentId,
      userId: req.userId,
    });

    if (!comment) {
      return res.status(404).json(fail(404, "Comment not found"));
    }

    // Update post comment count
    await Post.findByIdAndUpdate(comment.postId, {
      $inc: { commentCount: -1 },
    });

    return res.json(ok({ success: true }, "Comment deleted"));
  } catch (error) {
    return res.status(500).json(fail(500, "Failed to delete comment"));
  }
};
