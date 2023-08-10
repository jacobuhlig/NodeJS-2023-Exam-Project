import dotenv from 'dotenv';
dotenv.config();

import { search } from 'google-books-search';
import similarity from 'string-similarity';
const { compareTwoStrings } = similarity;

const options = {
  key: process.env.API_KEY,
  offset: 0,
  limit: 1,
  type: 'books',
  order: 'relevance',
  lang: 'en',
};

export function filterBooksData(books) {
  return books
    .filter(
      book =>
        book.title &&
        book.authors &&
        book.authors.length > 0 &&
        book.description &&
        book.thumbnail,
    )
    .map(book => ({
      id: book.id,
      title: book.title,
      author: book.authors[0],
      description: book.description,
      image: book.thumbnail,
      ...(book.subtitle && { subtitle: book.subtitle }),
      ...(book.categories && { categories: book.categories }),
      ...(book.averageRating && { rating: book.averageRating }),
      ...(book.pageCount && { page_count: book.pageCount }),
      ...(book.publisher && { publisher: book.publisher }),
      ...(book.publishedDate && { published_date: book.publishedDate }),
    }));
}

export const searchBooks1 = async query => {
  let titleOptions = { ...options, field: 'title' };

  const searchField = titleOptions =>
    new Promise((resolve, reject) => {
      search(query, titleOptions, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const filteredBooks = filterBooksData(results);
          resolve(filteredBooks);
        }
      });
    });

  try {
    const titleResult = await searchField(titleOptions);
    console.log(titleResult);

    return titleResult;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const searchBooks = async query => {
  let titleOptions = { ...options, field: 'title' };
  let authorOptions = { ...options, field: 'author' };

  const searchField = fieldOptions =>
    new Promise((resolve, reject) => {
      search(query, fieldOptions, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const filteredBooks = filterBooksData(results);
          resolve(filteredBooks);
        }
      });
    });

  try {
    const [titleResults, authorResults] = await Promise.all([
      searchField(titleOptions),
      searchField(authorOptions),
    ]);

    const allResults = [...titleResults, ...authorResults];

    // Calculate similarity and sort by it
    const rankedResults = allResults
      .map(book => {
        const titleSimilarity = compareTwoStrings(query, book.title);
        const authorSimilarity = compareTwoStrings(query, book.author);
        const maxSimilarity = Math.max(titleSimilarity, authorSimilarity);

        return { ...book, similarity: maxSimilarity };
      })
      .sort((a, b) => b.similarity - a.similarity);

    // Return top 5 matches
    return rankedResults.slice(0, 5);
  } catch (error) {
    console.error(error);
    return [];
  }
};
