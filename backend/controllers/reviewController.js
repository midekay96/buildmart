import { Review, Product, Order, OrderItem, User } from '../models/index.js';
import { HTTP_STATUS } from '../config/constants.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createReview = asyncHandler(async (req, res) => {
  const { productId, orderId, rating, title, comment } = req.body;

  if (!productId || !orderId || !rating || !title) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Product ID, order ID, rating, and title are required'
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Rating must be between 1 and 5'
    });
  }

  const order = await Order.findByPk(orderId);
  if (!order || order.userId !== req.user.userId) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Not authorized'
    });
  }

  const existingReview = await Review.findOne({
    where: { productId, userId: req.user.userId, orderId }
  });

  if (existingReview) {
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message: 'You have already reviewed this product'
    });
  }

  const review = await Review.create({
    productId,
    userId: req.user.userId,
    orderId,
    rating,
    title,
    comment,
    verified: true
  });

  await updateProductRating(productId);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Review created successfully',
    data: review
  });
});

export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const offset = (page - 1) * limit;

  const { count, rows } = await Review.findAndCountAll({
    where: { productId },
    include: [
      { model: User, attributes: ['id', 'firstName', 'lastName', 'profilePicture'] }
    ],
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit),
    offset
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit)
    }
  });
});

export const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findByPk(id);
  if (!review) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Review not found'
    });
  }

  if (review.userId !== req.user.userId) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Not authorized'
    });
  }

  await review.update({
    rating: rating || review.rating,
    title: title || review.title,
    comment: comment || review.comment
  });

  await updateProductRating(review.productId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Review updated successfully',
    data: review
  });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findByPk(id);
  if (!review) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Review not found'
    });
  }

  if (review.userId !== req.user.userId) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Not authorized'
    });
  }

  const productId = review.productId;
  await review.destroy();
  await updateProductRating(productId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Review deleted successfully'
  });
});

const updateProductRating = async (productId) => {
  const reviews = await Review.findAll({ where: { productId } });

  if (reviews.length === 0) {
    await Product.update(
      { rating: 0, reviewCount: 0 },
      { where: { id: productId } }
    );
    return;
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await Product.update(
    { rating: parseFloat(avgRating.toFixed(1)), reviewCount: reviews.length },
    { where: { id: productId } }
  );
};
