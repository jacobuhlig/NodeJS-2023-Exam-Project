import { User, Book, Favorite } from '../database/models/index.js';

const toBeReturned = ['id', 'username', 'email', 'role', 'created_at', 'updated_at']



export const addFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookId } = req.body;

    const user = await User.findByPk(id, {attributes: toBeReturned});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the favorite already exists
    const existingFavorite = await Favorite.findOne({ where: { user_id: id, book_id: bookId } });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Book is already in favorites' });
    }

    // Create a new favorite association
    await Favorite.create({ user_id: id, book_id: bookId });

    return res.json({ message: 'Book added to favorites successfully' });
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
    const favorites = await Favorite.findAll({ where: { user_id: id }, include: { model: Book, as: 'favorited_book' } });

    return res.json(favorites);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



export const deleteFavorite =  async (req, res) => {
  try {
    const { id, bookId } = req.params;

    const user = await User.findByPk(id, {attributes: toBeReturned});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the favorite exists
    const favorite = await Favorite.findOne({ where: { user_id: id, book_id: bookId } });
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