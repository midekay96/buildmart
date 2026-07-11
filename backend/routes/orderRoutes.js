import express from 'express';
import { Op } from 'sequelize';
import { Order, OrderItem, Product } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// POST /api/orders — place a new order from checkout
router.post('/', asyncHandler(async (req, res) => {
  const { items, delivery, deliveryOption, total, paymentReference } = req.body;
  if (!items?.length || !delivery) {
    return res.status(400).json({ success: false, message: 'Items and delivery details required' });
  }
  const orderNumber = '#BM-' + Date.now().toString().slice(-4) + Math.floor(Math.random() * 100);
  const shippingCost = deliveryOption === 'express' ? 15000 : 5000;
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.075);
  const totalAmount = subtotal + tax + shippingCost;
  const order = await Order.create({
    orderNumber,
    userId: null, // guest order (no user login required)
    totalAmount,
    tax,
    shippingCost,
    status: 'confirmed',
    paymentStatus: paymentReference ? 'completed' : 'pending',
    shippingAddress: delivery,
    trackingNumber: orderNumber,
    estimatedDelivery: new Date(Date.now() + (deliveryOption === 'express' ? 1 : 3) * 24 * 60 * 60 * 1000)
  });
  await Promise.all(items.map(item =>
    OrderItem.create({
      orderId: order.id,
      productId: item.id,
      productName: item.name,
      quantity: item.qty,
      price: item.price,
      total: item.price * item.qty
    })
  ));
  res.status(201).json({
    success: true,
    orderNumber: order.orderNumber,
    estimatedDelivery: order.estimatedDelivery,
    total: totalAmount
  });
}));

// GET /api/orders/my — customer's own orders (placeholder — no auth yet)
router.get('/my', asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    include: [{ model: OrderItem, as: 'items' }],
    order: [['createdAt', 'DESC']],
    limit: 20
  });
  const formatted = orders.map(o => formatOrderForCustomer(o));
  res.json(formatted);
}));

// GET /api/orders — all orders (admin)
router.get('/', asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    include: [{ model: OrderItem, as: 'items' }],
    order: [['createdAt', 'DESC']],
    limit: 200
  });
  res.json({ success: true, data: orders.map(o => formatOrderForCustomer(o)) });
}));

function formatOrderForCustomer(o) {
  const stageMap = {
    pending: 0, confirmed: 1, processing: 2, shipped: 4, delivered: 6, cancelled: 0
  };
  const statusMap = {
    pending: 'Pending', confirmed: 'Processing', processing: 'Processing',
    shipped: 'In Transit', delivered: 'Delivered', cancelled: 'Cancelled'
  };
  return {
    id:           o.orderNumber || '#BM-' + o.id.slice(-4),
    date:         o.createdAt?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    status:       statusMap[o.status] || o.status,
    stage:        stageMap[o.status] ?? 0,
    deliveryType: (o.shippingCost >= 15000) ? 'Express Delivery' : 'Standard Delivery',
    deliveryFee:  '₦' + Number(o.shippingCost || 5000).toLocaleString(),
    eta:          o.estimatedDelivery ? 'Expected ' + new Date(o.estimatedDelivery).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '--',
    address:      o.shippingAddress?.address + ', ' + o.shippingAddress?.state || '',
    items:        (o.items || []).map(i => ({ name: i.productName, qty: i.quantity, price: Number(i.price) })),
    total:        '₦' + Number(o.totalAmount).toLocaleString(),
    timeline:     buildTimeline(o.status, o.createdAt, o.updatedAt, o.estimatedDelivery)
  };
}

function buildTimeline(status, created, updated, eta) {
  const STAGES = ['Order Placed','Processing','Quality Check','Dispatched','In Transit','Out for Delivery','Delivered'];
  const stageNum = { pending: 0, confirmed: 1, processing: 2, shipped: 4, delivered: 6 }[status] ?? 0;
  return STAGES.map((label, i) => ({
    label,
    time: i === 0 ? created?.toLocaleString('en-GB') : i <= stageNum ? updated?.toLocaleString('en-GB') : '--',
    done: i <= stageNum,
    note: i === stageNum ? 'Current stage' : i < stageNum ? 'Completed' : ''
  }));
}

export default router;
