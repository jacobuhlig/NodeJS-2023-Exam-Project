import { Router } from 'express';
import { adminAndCurrentUserGuard } from '../middleware/auth-middleware.js';
import { addFavorite, getFavorites, deleteFavorite } from '../controllers/favoriteController.js';
const router = Router({ mergeParams: true });



// POST /users/:id/favorites
router.post('/', adminAndCurrentUserGuard, addFavorite);

// GET /users/:id/favorites
router.get('/', adminAndCurrentUserGuard, getFavorites);

// DELETE /users/:id/favorites/:bookId
router.delete('/:bookId', adminAndCurrentUserGuard, deleteFavorite);



export default router;
