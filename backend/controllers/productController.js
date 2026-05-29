import { Product, Review } from '../models/index.js';
import { HTTP_STATUS } from '../config/constants.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { Op } from 'sequelize';

export const getAllProducts = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 12, sort = '-createdAt' } = req.query;

  const where = { isActive: true };
  if (category) where.category = category;
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const offset = (page - 1) * limit;
  const order = sort.startsWith('-') ? [[sort.slice(1), 'DESC']] : [[sort, 'ASC']];

  const { count, rows } = await Product.findAndCountAll({
    where,
    order,
    limit: parseInt(limit),
    offset,
    include: [{ association: 'supplier', attributes: ['id', 'firstName', 'lastName'] }]
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

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByPk(id, {
    include: [
      { association: 'supplier', attributes: ['id', 'firstName', 'lastName'] },
      { association: 'reviews', limit: 5, order: [['createdAt', 'DESC']] }
    ]
  });

  if (!product) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: product
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, price, discountPrice, sku, image, stock, unit } = req.body;

  const existingSku = await Product.findOne({ where: { sku } });
  if (existingSku) {
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message: 'SKU already exists'
    });
  }

  const product = await Product.create({
    name,
    description,
    category,
    price,
    discountPrice,
    sku,
    image,
    stock,
    unit,
    supplierId: req.user.userId
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Product created successfully',
    data: product
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, discountPrice, stock, isFeatured } = req.body;

  const product = await Product.findByPk(id);
  if (!product) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Product not found'
    });
  }

  if (product.supplierId !== req.user.userId) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Not authorized to update this product'
    });
  }

  await product.update({
    name: name || product.name,
    description: description !== undefined ? description : product.description,
    price: price || product.price,
    discountPrice: discountPrice !== undefined ? discountPrice : product.discountPrice,
    stock: stock !== undefined ? stock : product.stock,
    isFeatured: isFeatured !== undefined ? isFeatured : product.isFeatured
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);
  if (!product) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Product not found'
    });
  }

  if (product.supplierId !== req.user.userId) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Not authorized to delete this product'
    });
  }

  await product.update({ isActive: false });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll({
    where: { isActive: true, isFeatured: true },
    limit: 8,
    include: [{ association: 'supplier', attributes: ['id', 'firstName', 'lastName'] }]
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: products
  });
});
