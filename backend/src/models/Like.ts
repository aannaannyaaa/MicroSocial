import mongoose, { Schema, Document } from "mongoose";

export interface ILike extends Document {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
}

const LikeSchema = new Schema<ILike>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true }
  },
  { timestamps: true }
);

LikeSchema.index({ userId: 1, postId: 1 }, { unique: true });

export default mongoose.model<ILike>("Like", LikeSchema);
