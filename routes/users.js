import { Router } from 'express';
import favoritesRoutes from './favorites.js';
import userReviewRoutes from './userReviews.js';
import { adminGuard, adminAndCurrentUserGuard } from '../middleware/auth-middleware.js';
import { getAllUsers, getUserById, updateUserById, deleteUserById } from '../controllers/userController.js';

const router = Router();



// GET /users
router.get('/', adminGuard, getAllUsers);

// GET /users/:id
router.get('/:id', adminAndCurrentUserGuard, getUserById);

// PUT /users/:id
router.put('/:id', adminAndCurrentUserGuard, updateUserById);

// DELETE /users/:id
router.delete('/:id', adminAndCurrentUserGuard, deleteUserById);


// Sub-routes
// Favorites
router.use('/:id/favorites', favoritesRoutes);

// Reviews
router.use('/:id/reviews', userReviewRoutes);



export default router;
