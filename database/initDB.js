import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcrypt';

import { User, Book, Review, Favorite } from './models/index.js';

async function initializeDatabase() {
  try {
    const passwordAdmin = process.env.ADMIN_PASSWORD;
    const passwordHashAdmin = await bcrypt.hash(passwordAdmin, 12);

    const [userAdmin, created] = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        email: 'admin@example.com',
        password: passwordHashAdmin,
        role: 'admin',
      },
    });

    if (created) {
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }

    // Mock data
    const users = [
      {
        username: 'john',
        email: 'john@example.com',
        password: await bcrypt.hash('john123', 12),
      },
      {
        username: 'mary',
        email: 'mary@example.com',
        password: await bcrypt.hash('mary123', 12),
      },
    ];

    const books = [
      {
        id: 'Lr0UDAAAQBAJ',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
      },
      {
        id: 'xjNtEAAAQBAJ',
        title: 'Moby Dick',
        author: 'Herman Melville',
        genre: 'Adventure',
      },
    ];

    for (const user of users) {
      await User.findOrCreate({ where: { email: user.email }, defaults: user });
    }

    for (const book of books) {
      await Book.findOrCreate({ where: { title: book.title }, defaults: book });
    }

    // We'll need to adjust this once we have a relationship established between Users and Books
    const reviews = [
      {
        book_id: 'Lr0UDAAAQBAJ',
        user_id: 2,
        review_text: 'Great book!',
        rating: 5,
      },
      {
        book_id: 'xjNtEAAAQBAJ',
        user_id: 2,
        review_text: 'Very interesting.',
        rating: 4,
      },
    ];

    for (const review of reviews) {
      await Review.findOrCreate({
        where: { user_id: review.user_id, book_id: review.book_id },
        defaults: review,
      });
    }

    const favorites = [
      { book_id: 'Lr0UDAAAQBAJ', user_id: 2 },
      { book_id: 'xjNtEAAAQBAJ', user_id: 2 },
    ];

    for (const favorite of favorites) {
      await Favorite.findOrCreate({
        where: { user_id: favorite.user_id, book_id: favorite.book_id },
        defaults: favorite,
      });
    }

    console.log('Database has been initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase();
