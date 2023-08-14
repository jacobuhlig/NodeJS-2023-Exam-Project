import { Router } from 'express';
import favoritesRoutes from './favorites.js';
import userReviewRoutes from './userReviews.js';
import {
  adminGuard,
  adminAndCurrentUserGuard,
} from '../middleware/auth-middleware.js';
import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  verifyPassword,
  getReviewByUserId,
} from '../controllers/userController.js';

const router = Router();

// Sub-routes
// Favorites
router.use('/:id/favorites', favoritesRoutes);

// Reviews
router.use('/:id/reviews', adminAndCurrentUserGuard, userReviewRoutes);

// Special route
// GET /users/:userId/books/:bookId
router.get('/:id/books/:bookId', adminAndCurrentUserGuard, getReviewByUserId);

// Regular routes
// GET /users
router.get('/', adminGuard, getAllUsers);

// GET /users/:id
router.get('/:id', adminAndCurrentUserGuard, getUserById);

// PUT /users/:id
router.put('/:id', adminAndCurrentUserGuard, updateUserById);

// DELETE /users/:id
router.delete('/:id', adminAndCurrentUserGuard, deleteUserById);

// POST /users/:id/verify-password
router.post('/:id/verify-password', adminAndCurrentUserGuard, verifyPassword);

export default router;
