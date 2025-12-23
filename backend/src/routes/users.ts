import { Router } from 'express';
import {
  getUserProfile,
  updateProfile,
  searchUsers,
  getTrendingUsers
} from '../controllers/userController';
import { authMiddleware, optionalAuth } from '../middleware/auth';

const router = Router();

/**
 * GET /api/users/trending?limit=10
 * Get trending users by follower count
 */
router.get('/trending', optionalAuth, getTrendingUsers);

/**
 * GET /api/users/search?query=john&page=1&limit=10
 * Search users by username or email
 */
router.get('/search', optionalAuth, searchUsers);

/**
 * GET /api/users/:userId
 * Get user profile
 */
router.get('/:userId', optionalAuth, getUserProfile);

/**
 * PUT /api/users/profile
 * Update current user profile
 */
router.put('/profile', authMiddleware, updateProfile);

export default router;
