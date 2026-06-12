import express from 'express';
import { generateToken } from '../utils/jwt.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { Product, Order, OrderItem, Supplier, Transaction } from '../models/index.js';

const router = express.Router();

// ── POST /api/admin/login ────────────────────────────────────────────────────
// Frontend sends: { username, password }
// Returns: { success, token, user }
router.post('/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const validUser = process.env.ADMIN_USERNAME || 'admin';
  const validPass = process.env.ADMIN_PASSWORD || 'buildmart2026';

  if (username !== validUser || password !== validPass) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = generateToken('admin-user', 'admin');

  res.json({
    success: true,
    token,
    user: { name: 'Admin', role: 'superadmin' }
  });
}));

// ── GET /api/admin/orders ────────────────────────────────────────────────────
router.get('/orders', requireAdmin, asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    include: [{ model: OrderItem, as: 'items' }],
    order: [['createdAt', 'DESC']],
    limit: 200
  });

  const formatted = orders.map(o => ({
    id:          o.orderNumber || `#BM-${o.id.slice(-4).toUpperCase()}`,
    date:        o.createdAt?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    customer:    o.shippingAddress?.name || 'Unknown',
    phone:       o.shippingAddress?.phone || '',
    address:     o.shippingAddress?.address || '',
    state:       o.shippingAddress?.state  || '',
    status:      formatStatus(o.status),
    stage:       statusToStage(o.status),
    items:       (o.items || []).map(i => ({ name: i.productName, qty: i.quantity, price: i.price })),
    total:       `₦${Number(o.totalAmount).toLocaleString()}`,
    deliveryFee: `₦${Number(o.shippingCost || 5000).toLocaleString()}`,
    payStatus:   o.paymentStatus,
    createdAt:   o.createdAt
  }));

  res.json({ success: true, data: formatted });
}));

// ── PATCH /api/admin/orders/:id/status ─────────────────────────────────────
router.patch('/orders/:id/status', requireAdmin, asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findOne({ where: { orderNumber: req.params.id } });

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  await order.update({ status: status.toLowerCase() });
  res.json({ success: true, message: 'Order status updated' });
}));

// ── GET /api/admin/products ──────────────────────────────────────────────────
router.get('/products', requireAdmin, asyncHandler(async (req, res) => {
  const products = await Product.findAll({ order: [['cat', 'ASC'], ['name', 'ASC']] });
  res.json({ success: true, data: products.map(Product.format) });
}));

// ── POST /api/admin/products ─────────────────────────────────────────────────
router.post('/products', requireAdmin, asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: Product.format(product) });
}));

// ── PUT /api/admin/products/:id ──────────────────────────────────────────────
router.put('/products/:id', requireAdmin, asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  await product.update(req.body);
  res.json({ success: true, data: Product.format(product) });
}));

// ── DELETE /api/admin/products/:id ───────────────────────────────────────────
router.delete('/products/:id', requireAdmin, asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  await product.update({ isActive: false });
  res.json({ success: true, message: 'Product deactivated' });
}));

// ── GET /api/admin/suppliers ─────────────────────────────────────────────────
router.get('/suppliers', requireAdmin, asyncHandler(async (req, res) => {
  const suppliers = await Supplier.findAll({ order: [['name', 'ASC']] });
  res.json({ success: true, data: suppliers });
}));

// ── GET /api/admin/transactions ──────────────────────────────────────────────
router.get('/transactions', requireAdmin, asyncHandler(async (req, res) => {
  const txns = await Transaction.findAll({
    order: [['createdAt', 'DESC']],
    limit: 200
  });

  const formatted = txns.map(t => ({
    id:         t.id.slice(-8).toUpperCase(),
    orderId:    t.orderNumber || '--',
    customer:   t.customerName,
    amount:     `₦${Number(t.amountNGN).toLocaleString()}`,
    method:     t.method,
    status:     t.status === 'success' ? 'Success' : t.status === 'failed' ? 'Failed' : 'Pending',
    date:       t.createdAt?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    reference:  t.reference
  }));

  res.json({ success: true, data: formatted });
}));

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatStatus(s) {
  const map = {
    pending:    'Pending',
    confirmed:  'Processing',
    processing: 'Processing',
    shipped:    'In Transit',
    delivered:  'Delivered',
    cancelled:  'Cancelled'
  };
  return map[s] || s;
}

function statusToStage(s) {
  const map = { pending: 0, confirmed: 1, processing: 1, shipped: 3, delivered: 6, cancelled: 0 };
  return map[s] ?? 0;
}

export default router;
