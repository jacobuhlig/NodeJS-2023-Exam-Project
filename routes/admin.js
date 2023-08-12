// import adminController from '../controllers/adminController.js';
import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  deleteUserById,
} from '../controllers/userController.js';
import {
  getFans,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js';
import { getAllFavorites } from '../controllers/favoriteController.js';

const router = Router();

// // POST /admin/status
// router.get('/status', status);

// // POST /admin/signin
// router.post('/signin', signin);

// // POST /admin/signup
// router.post('/signup', signup);

// // POST /admin/forgot
// router.post('/forgot', forgot);

// // POST /admin/reset/:token
// router.post('/reset/:token', reset);

// // POST /admin/reset/:token/confirm
// router.post('/reset/:token/confirm', confirmResetPassword);

// Favorites
// Special - Gets all books that have been favorited
// GET admin/books/favorites
router.get('/books/favorites', getAllFavorites);

// GET admin/books/:id/fans
router.get('/books/:id/fans', getFans);

// Users
// GET /admin/users
router.get('/users', getAllUsers);

// GET /admin/users/:id
router.get('/users/:id', getUserById);

// DELETE /admin/users/:id
router.delete('/users/:id', deleteUserById);

// Books
// GET /admin/books
router.get('/books', getAllBooks);

// GET /admin/books/:id
router.get('/books/:id', getBookById);

// PUT admin/books/:id
router.put('/books/:id', updateBook);

// DELETE admin/books/:id
router.delete('/books/:id', deleteBook);

export default router;
