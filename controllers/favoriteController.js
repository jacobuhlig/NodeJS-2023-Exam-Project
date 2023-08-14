import { User, Book, Favorite } from '../database/models/index.js';
import { addBookHelper } from './bookController.js';

const toBeReturned = [
  'id',
  'username',
  'email',
  'role',
  'created_at',
  'updated_at',
];

export const addFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    // const user = await User.findByPk(id, { attributes: toBeReturned });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { book } = await addBookHelper(req.body);

    // Check if the favorite already exists
    const existingFavorite = await Favorite.findOne({
      where: { user_id: id, book_id: book.id },
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Book is already in favorites' });
    }

    // Create a new favorite association
    await Favorite.create({ user_id: id, book_id: book.id });

    return res.json({
      message: 'Book added to favorites successfully',
      favorite: existingFavorite,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve the user's favorite books
    const favorites = await Favorite.findAll({
      where: { user_id: id },
      include: { model: Book, as: 'favorited_book' },
    });

    return res.json({
      message: 'Successfully retrieved all favorites',
      favorites,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// export const getAllFavorites = async (req, res) => {
//   try {
//     // Retrieve all favorite books
//     const favorites = await Favorite.findAll({
//       include: { model: Book, as: 'favorited_book' },
//     });

//     if (favorites.length === 0) {
//       return res.status(404).json({ message: 'No favorites found' });
//     }

//     return res.status(200).json({
//       message: 'Favorites retrieved successfully',
//       favorites,
//     });
//   } catch (error) {
//     console.log('my error');
//     console.error(error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

export const getAllFavorites = async (req, res) => {
  try {
    // Retrieve all favorite books
    const favorites = await Favorite.findAll({
      include: { model: Book, as: 'favorited_book' },
    });

    if (favorites.length === 0) {
      return res.status(404).json({ message: 'No favorites found' });
    }

    // Create a set to check uniqueness
    const uniqueBookIds = new Set();

    // Filter out the non-unique books
    const uniqueFavorites = favorites.filter(favorite => {
      if (uniqueBookIds.has(favorite.book_id)) {
        return false;
      }
      uniqueBookIds.add(favorite.book_id);
      return true;
    });

    return res.status(200).json({
      message: 'Favorites retrieved successfully',
      favorites: uniqueFavorites,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFavoritesByBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Count the number of favorites for the book
    const count = await Favorite.count({ where: { book_id: id } });

    return res.status(200).json({ message: `Count: ${count}`, count });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFavorite = async (req, res) => {
  try {
    const { id, bookId } = req.params;

    console.log(`Ids:`);
    console.log(id);
    console.log(bookId);

    const user = await User.findByPk(id, { attributes: toBeReturned });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve the specific book from the user's favorites
    const favorite = await Favorite.findOne({
      where: {
        user_id: id,
        book_id: bookId,
      },
      include: { model: Book, as: 'favorited_book' },
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Book not found in favorites' });
    }

    return res.json({ message: 'Book found in favorites', favorite });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteFavorite = async (req, res) => {
  try {
    const { id, bookId } = req.params;

    const user = await User.findByPk(id, { attributes: toBeReturned });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the favorite exists
    const favorite = await Favorite.findOne({
      where: { user_id: id, book_id: bookId },
    });
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    // Delete the favorite association
    await favorite.destroy();

    return res.json({ message: 'Book removed from favorites successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
