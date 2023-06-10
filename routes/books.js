import { Router } from 'express';
import bookReviewRoutes from './bookReviews.js';
import bookFavoriteRoutes from './bookFavorites.js';
import { authorizationGuard, adminGuard } from '../middleware/auth-middleware.js';
import { 
    searchByTitleOrAuthor, 
    searchById, 
    getFans, 
    getAllBooks, 
    addBook, 
    updateBook, 
    deleteBook 
} from '../controllers/bookController.js';

const router = Router();



// GET /books
router.get('/', authorizationGuard, adminGuard, getAllBooks);

// POST /books
router.post('/', authorizationGuard, addBook);

// PUT /books/:id
router.put('/:id', authorizationGuard, adminGuard, updateBook);

// DELETE /books/:id
router.delete('/:id', authorizationGuard, adminGuard, deleteBook);


// authorizationGuard
// GET /books/search/:title
router.get('/search/title-or-author/:title', authorizationGuard, searchByTitleOrAuthor);

// GET /books/search/:id
router.get('/search/id/:id', authorizationGuard, searchById);

// GET /books/search/:id/fans
router.get('/search/:id/fans', authorizationGuard, getFans);



// Sub-routes
// GET /books/:id/reviews
router.use('/:id/reviews', bookReviewRoutes);

// GET /books/:id/favorites
router.use('/:id/favorites', bookFavoriteRoutes);



export default router;
