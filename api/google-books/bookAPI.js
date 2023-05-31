import dotenv from 'dotenv';
dotenv.config();

import { search } from 'google-books-search';

const options = {
  key: process.env.API_KEY,
  field: 'title',
  offset: 0,
  limit: 1,
  type: 'books',
  order: 'relevance',
  lang: 'en'
};

function filterBooksData(books) {
  return books.map(book => ({
    id: book.id,
    title: book.title,
    author: book.authors[0],  // Assuming you only care about the first author
    description: book.description,
    image: book.thumbnail
  }));
}

export const searchBooks = async (title) => {
  return new Promise((resolve, reject) => {
    search(title, options, (error, results) => {
      if (error) {
        reject(error);
      } else {
        const filteredBooks = filterBooksData(results);
        resolve(filteredBooks);
      }
    });
  });
};
