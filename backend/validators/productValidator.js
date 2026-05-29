import { body, validationResult } from 'express-validator';
import { PRODUCT_CATEGORIES } from '../config/constants.js';

export const validateCreateProduct = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').optional().isString(),
  body('category')
    .notEmpty()
    .isIn(PRODUCT_CATEGORIES)
    .withMessage('Valid category is required'),
  body('price').notEmpty().isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('sku').notEmpty().withMessage('SKU is required'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a positive number'),
  body('unit').optional().isString()
];

export const validateUpdateProduct = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a positive number')
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};
