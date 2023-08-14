import { Router } from 'express';
import { adminAndCurrentUserGuard } from '../middleware/auth-middleware.js';
import {
  addReview,
  getReviewsByUser,
  getReviewById,
  deleteReview,
} from '../controllers/reviewController.js';
const router = Router({ mergeParams: true });

// adminAndCurrentUserGuard
// POST /users/:id/reviews
router.post('/', addReview);

// GET /users/:id/reviews
router.get('/', getReviewsByUser);

// GET /users/:id/reviews/:reviewId
router.get('/:reviewId', getReviewById);

// DELETE /users/:id/reviews/:reviewId
router.delete('/:reviewId', deleteReview);

// // GET /users/:id/reviews/:reviewId
// router.get('/:reviewId', getReviewById);

// // DELETE /users/:id/reviews/:reviewId
// router.delete('/:reviewId', deleteReview);

export default router;
