import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();
app.use(express.json());

// Only for development
import morgan from 'morgan';
// app.use(morgan('tiny'));
// app.use(morgan('common'));
app.use(morgan('dev'));

import helmet from 'helmet';
app.use(helmet());

import cors from 'cors';
app.use(
  cors({
    origin: process.env.URL_CLIENT,
    credentials: true,
  }),
);

import session from 'express-session';
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

// Rate-limiter
// import rateLimit from 'express-rate-limit'

// const apiLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//     standardHeaders: true,
//     legacyHeaders: false,
// });
// app.use(apiLimiter);

// const authLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 10,
//     standardHeaders: true,
//     legacyHeaders: false,
// });
// app.use("/auth/signin", authLimiter);

// Database
import { sequelize } from './database/models/index.js';

(async function initialize() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Middleware
import {
  authorizationGuard,
  adminGuard,
} from './middleware/auth-middleware.js';

// Routes
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/users.js';
import bookRoutes from './routes/books.js';

// app.use('/auth', authLimiter, authRoutes);
app.use('/auth', authRoutes); // should be deleted, upon the above's outcommenting
app.use('/admin', authorizationGuard, adminGuard, adminRoutes);
app.use('/users', authorizationGuard, userRoutes);
app.use('/books', bookRoutes);

// Default route
app.get('/', async (req, res) => {
  try {
    res.send('Welcome!');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Listener
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log('Example app listening on port', PORT);
});
