import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  content: string;
}

const CommentSchema = new Schema<IComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true, maxlength: 300 }
  },
  { timestamps: true }
);

CommentSchema.index({ postId: 1, createdAt: -1 });

export default mongoose.model<IComment>("Comment", CommentSchema);
