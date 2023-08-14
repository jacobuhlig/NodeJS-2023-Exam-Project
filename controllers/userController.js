import { User, Favorite, Review, Book } from '../database/models/index.js';
import { comparePassword } from '../services/passwordService.js';
import { destroySession } from '../services/sessionService.js';
const toBeReturned = [
  'id',
  'username',
  'email',
  'role',
  'created_at',
  'updated_at',
];

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: toBeReturned });
    return res.status(200).json({ message: 'Users found', users });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.toString() });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, { attributes: toBeReturned });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User found', user: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.toString() });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    const user = await User.findByPk(id, { attributes: toBeReturned });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's information
    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();

    return res.json({ message: 'User updated successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.toString() });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user and associated favorites
    await Favorite.destroy({ where: { user_id: id } });
    await user.destroy();
    if (req.session.user.id === user.id && req.session.user.role !== 'admin')
      await destroySession(req);

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.toString() });
  }
};

export const verifyPassword = async (req, res) => {
  const userId = req.params.id;
  const inputPassword = req.body.password;

  const user = await User.findByPk(userId);

  const passwordMatch = await comparePassword(inputPassword, user.password);

  if (passwordMatch) {
    res.status(200).json({ success: true, message: 'Password verified.' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password.' });
  }
};

export const getReviewByUserId = async (req, res) => {
  try {
    const { id, bookId } = req.params;

    // Check if user exists
    const user = await User.findByPk(id, { attributes: toBeReturned });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if book exists
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Fetch the review for the specified book and user
    const review = await Review.findOne({
      where: {
        user_id: id,
        book_id: bookId,
      },
      // include: [
      //   {
      //     model: User,
      //     as: 'user',
      //     attributes: toBeReturned,
      //   },
      //   {
      //     model: Book,
      //     as: 'reviewed_book',
      //   },
      // ],
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    return res.status(200).json({ message: 'Review found', review: review });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.toString() });
  }
};
