import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";
import { generateToken } from "../utils/jwt";
import { fail, ok } from "../utils/errorResponse";

export const register = async (req: AuthRequest, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json(fail(400, "All fields required"));
  }

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) {
    return res.status(400).json(fail(400, "User already exists"));
  }

  const user = await User.create({ username, email, password });

  const userId = user._id.toString(); // normalize [web:11]
  const token = generateToken({ id: userId, email: user.email });

  return res.status(201).json(
    ok(
      {
        token,
        user: {
          id: userId,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
        },
      },
      "Registered"
    )
  );
};

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json(fail(400, "Email & password required"));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json(fail(401, "Invalid credentials"));
  }

  const match = await user.matchPassword(password);
  if (!match) {
    return res.status(401).json(fail(401, "Invalid credentials"));
  }

  const userId = user._id.toString();
  const token = generateToken({ id: userId, email: user.email });

  return res.json(
    ok(
      {
        token,
        user: {
          id: userId,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
        },
      },
      "Logged in"
    )
  );
};

export const me = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json(fail(404, "User not found"));
  }

  const userId = user._id.toString();
  return res.json(
    ok(
      {
        id: userId,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },
      "Current user"
    )
  );
};
