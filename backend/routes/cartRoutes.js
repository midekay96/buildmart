import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:cartItemId', updateCartItem);
router.delete('/:cartItemId', removeFromCart);
router.delete('/', clearCart);

export default router;
