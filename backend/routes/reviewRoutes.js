import express from 'express';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);

router.use(verifyToken);

router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;
