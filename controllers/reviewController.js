import { User, Book, Review } from '../database/models/index.js';

const toBeReturned = [
  'id',
  'username',
  'email',
  'role',
  'created_at',
  'updated_at',
];
const toBeExcluded1 = ['created_at', 'updated_at'];
const toBeExcluded2 = [
  'id',
  'password',
  'role',
  'reset_token',
  'reset_token_expiration',
];

export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookId, reviewTitle, reviewText, rating } = req.body;

    const user = await User.findByPk(id, { attributes: toBeReturned });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Create a new review
    const review = await Review.create({
      user_id: id,
      book_id: bookId,
      review_title: reviewTitle,
      review_text: reviewText,
      rating: rating,
    });

    return res
      .status(201)
      .json({ message: 'Review added successfully', review });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getReviewsByUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const reviews = await Review.findAll({
      where: { user_id: id },
      include: {
        model: Book,
        as: 'reviewed_book',
        attributes: { exclude: toBeExcluded1 },
      },
    });

    return res
      .status(200)
      .json({ message: 'Found review successfully', reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;
    console.debug('reviewId: ', reviewId);

    const review = await Review.findByPk(reviewId, {
      include: {
        model: Book,
        as: 'reviewed_book',
        attributes: { exclude: toBeExcluded1 },
      },
    });
    console.debug('review: ', review);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    return res
      .status(200)
      .json({ message: 'Review retrieved successfully', review });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    const user = await User.findByPk(id, { attributes: toBeReturned });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const review = await Review.findOne({
      where: { id: reviewId, user_id: id },
    });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.destroy();

    return res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// export const getReviewById = async (req, res) => {
//   try {
//     const { reviewId } = req.params;

//     const review = await Review.findByPk(reviewId, {
//       include: {
//         model: Book,
//         as: 'reviewed_book',
//         attributes: { exclude: toBeExcluded1 },
//       },
//     });

//     if (!review) {
//       return res.status(404).json({ message: 'Review not found' });
//     }

//     return res
//       .status(200)
//       .json({ message: 'Review retrieved successfully', review });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

// export const deleteReview = async (req, res) => {
//   try {
//     const { id, reviewId } = req.params;

//     const user = await User.findByPk(id, { attributes: toBeReturned });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const review = await Review.findOne({
//       where: { id: reviewId, user_id: id },
//     });
//     if (!review) {
//       return res.status(404).json({ message: 'Review not found' });
//     }

//     await review.destroy();

//     return res.json({ message: 'Review deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

export const getReviewsByBook = async (req, res) => {
  try {
    const { id } = req.params;
    console.debug('id: ', id);

    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Count the number of favorites for the book
    const count = await Review.count({ where: { book_id: id } });

    const reviews = await Review.findAll({
      where: { book_id: id },
      include: {
        model: User,
        as: 'user',
        attributes: { exclude: toBeExcluded1 + toBeExcluded2 },
      },
    });

    return res.status(200).json({ message: `Count: ${count}`, count, reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
