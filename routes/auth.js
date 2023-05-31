import {authorizationGuard} from '../middleware/auth-middleware.js';
import {signin, signup, forgot, reset, confirmResetPassword, signout} from '../controllers/authController.js';
import {Router} from 'express';
const router = Router();


// POST /auth/signin
router.post('/signin', signin);

// POST /auth/signup
router.post('/signup', signup);

// POST /auth/forgot
router.post('/forgot', forgot);

// POST /auth/reset/:token
router.post('/reset/:token', reset);

// POST /auth/reset/:token/confirm
router.post('/reset/:token/confirm', confirmResetPassword);

// GET /auth/signout
router.get('/signout', authorizationGuard, signout);



export default router;
