import { Router } from 'express';
import { adminAndCurrentUserGuard } from '../middleware/auth-middleware.js';
import {
  addReview,
  getReviewsByUser,
  deleteReview,
} from '../controllers/reviewController.js';
const router = Router({ mergeParams: true });

// adminAndCurrentUserGuard
// POST /users/:id/reviews
router.post('/', addReview);

// GET /users/:id/reviews
router.get('/', adminAndCurrentUserGuard, getReviewsByUser);

// DELETE /users/:id/reviews/:reviewId
router.delete('/:reviewId', adminAndCurrentUserGuard, deleteReview);

export default router;
