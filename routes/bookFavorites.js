import { Router } from 'express';
import { authorizationGuard } from '../middleware/auth-middleware.js';
import { getFavoritesByBook } from '../controllers/favoriteController.js';
const router = Router({ mergeParams: true });



// GET /books/:id/favorites
router.get('/', getFavoritesByBook);



export default router;
