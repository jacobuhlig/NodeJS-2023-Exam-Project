import { Router } from 'express';
import { adminAndCurrentUserGuard } from '../middleware/auth-middleware.js';
import { addFavorite, getFavorites, getFavorite, deleteFavorite } from '../controllers/favoriteController.js';
const router = Router({ mergeParams: true });



// POST /users/:id/favorites
router.post('/', adminAndCurrentUserGuard, addFavorite);

// GET /users/:id/favorites
router.get('/', adminAndCurrentUserGuard, getFavorites);

// GET /users/:id/favorites/:bookId
router.get('/:bookId', adminAndCurrentUserGuard, getFavorite);

// DELETE /users/:id/favorites/:bookId
router.delete('/:bookId', adminAndCurrentUserGuard, deleteFavorite);



export default router;
