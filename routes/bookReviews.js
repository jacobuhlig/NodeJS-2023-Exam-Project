import { Router } from 'express';
import { adminAndCurrentUserGuard } from '../middleware/auth-middleware.js';
import { getReviewsByBook } from '../controllers/reviewController.js';
const router = Router({ mergeParams: true });

// GET /books/:id/reviews
router.get('/', getReviewsByBook);

export default router;
