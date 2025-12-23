import mongoose, { Schema, Document } from "mongoose";
import bcryptjs from "bcryptjs";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
  matchPassword(pw: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    bio: { type: String, maxlength: 500, default: "" },
    avatar: { type: String, default: "" }
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = function (pw: string) {
  return bcryptjs.compare(pw, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
