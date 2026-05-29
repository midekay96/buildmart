import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);

router.put(
  '/:id/status',
  verifyRole([USER_ROLES.ADMIN]),
  updateOrderStatus
);

router.put('/:id/cancel', cancelOrder);

export default router;
