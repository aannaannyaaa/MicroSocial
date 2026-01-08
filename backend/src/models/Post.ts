import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  likeCount: number;
  commentCount: number;
}

const MAX_CONTENT_LENGTH = 280;

const PostSchema = new Schema<IPost>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: MAX_CONTENT_LENGTH },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PostSchema.index({ createdAt: -1 });

export default mongoose.model<IPost>("Post", PostSchema);
export { MAX_CONTENT_LENGTH };
