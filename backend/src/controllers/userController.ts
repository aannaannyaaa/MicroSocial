import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Post from '../models/Post';
import { fail, ok } from '../utils/errorResponse';
import { validateBio, validateUsername } from '../middleware/validation';

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password').lean();
    
    if (!user) {
      return res.status(404).json(fail(404, 'User not found'));
    }
    
    const postCount = await Post.countDocuments({ userId });
    
    const normalizedUser = {
      ...user,
      id: (user._id as any).toString(),
      _id: undefined,
      postCount
    };
    
    return res.status(200).json(
      ok({ user: normalizedUser }, 'User profile fetched successfully')
    );
  } catch (error: any) {
    return res.status(500).json(fail(500, 'Failed to fetch user profile'));
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { username, bio, avatar } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json(fail(404, 'User not found'));
    }
    
    if (username && !validateUsername(username)) {
      return res.status(400).json(fail(400, 'Username must be 3-30 characters'));
    }
    
    if (bio && !validateBio(bio)) {
      return res.status(400).json(fail(400, 'Bio cannot exceed 500 characters'));
    }
    
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json(fail(400, 'Username already taken'));
      }
      user.username = username;
    }
    
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    
    await user.save();
    
    return res.status(200).json(
      ok({
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio
        }
      }, 'Profile updated successfully')
    );
  } catch (error: any) {
    return res.status(500).json(fail(500, 'Failed to update profile'));
  }
};

export const searchUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    
    if (!query || (query as string).length < 2) {
      return res.status(400).json(fail(400, 'Query must be at least 2 characters'));
    }
    
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
      .select('-password')
      .skip(skip)
      .limit(limitNum)
      .lean();
    
    const total = await User.countDocuments({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    });
    
    const normalizedUsers = users.map((user: any) => ({
      ...user,
      id: user._id.toString(),
      _id: undefined
    }));
    
    return res.status(200).json(
      ok({
        users: normalizedUsers,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }, 'Users found')
    );
  } catch (error: any) {
    return res.status(500).json(fail(500, 'Failed to search users'));
  }
};

export const getTrendingUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    const limitNum = parseInt(limit as string) || 10;
    
    const users = await User.find()
      .sort({ followerCount: -1 })
      .limit(limitNum)
      .select('-password')
      .lean();
    
    const normalizedUsers = users.map((user: any) => ({
      ...user,
      id: user._id.toString(),
      _id: undefined
    }));
    
    return res.status(200).json(
      ok({ users: normalizedUsers }, 'Trending users fetched successfully')
    );
  } catch (error: any) {
    return res.status(500).json(fail(500, 'Failed to fetch trending users'));
  }
};
