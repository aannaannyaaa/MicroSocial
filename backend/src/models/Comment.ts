import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  content: string;
}

const MAX_COMMENT_LENGTH = 300;

const CommentSchema = new Schema<IComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true, maxlength: MAX_COMMENT_LENGTH },
  },
  { timestamps: true }
);

CommentSchema.index({ postId: 1, createdAt: -1 });

export default mongoose.model<IComment>("Comment", CommentSchema);
export { MAX_COMMENT_LENGTH };
