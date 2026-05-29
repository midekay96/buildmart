import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
} from '../controllers/productController.js';
import { validateCreateProduct, validateUpdateProduct, handleValidationErrors } from '../validators/productValidator.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);

router.post(
  '/',
  verifyToken,
  verifyRole([USER_ROLES.SUPPLIER, USER_ROLES.ADMIN]),
  validateCreateProduct,
  handleValidationErrors,
  createProduct
);

router.put(
  '/:id',
  verifyToken,
  verifyRole([USER_ROLES.SUPPLIER, USER_ROLES.ADMIN]),
  validateUpdateProduct,
  handleValidationErrors,
  updateProduct
);

router.delete(
  '/:id',
  verifyToken,
  verifyRole([USER_ROLES.SUPPLIER, USER_ROLES.ADMIN]),
  deleteProduct
);

export default router;
