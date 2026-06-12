import express from 'express';
import { Op } from 'sequelize';
import { Product } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /api/products
router.get('/', asyncHandler(async (req, res) => {
  const { cat, q, sort } = req.query;
  const where = { isActive: true };
  if (cat) where.cat = cat;
  if (q)   where.name = { [Op.iLike]:  };
  let order = [['id', 'ASC']];
  if (sort === 'price_asc')  order = [['price', 'ASC']];
  if (sort === 'price_desc') order = [['price', 'DESC']];
  const products = await Product.findAll({ where, order });
  res.json(products.map(Product.format));
}));

// GET /api/products/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product || !product.isActive) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json(Product.format(product));
}));

export default router;
