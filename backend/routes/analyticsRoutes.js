import express from 'express';
import { Op } from 'sequelize';
import { requireAdmin } from '../middleware/adminAuth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { Order, Transaction, Product, Supplier } from '../models/index.js';
import sequelize from '../config/database.js';

const router = express.Router();

// ── GET /api/analytics/kpi ───────────────────────────────────────────────────
router.get('/kpi', requireAdmin, asyncHandler(async (req, res) => {
  const now      = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // Revenue this month vs last month
  const [thisRev] = await Transaction.findAll({
    where: { status: 'success', createdAt: { [Op.gte]: thisMonth } },
    attributes: [[sequelize.fn('SUM', sequelize.col('amount_n_g_n')), 'total']],
    raw: true
  });
  const [lastRev] = await Transaction.findAll({
    where: { status: 'success', createdAt: { [Op.between]: [lastMonth, lastMonthEnd] } },
    attributes: [[sequelize.fn('SUM', sequelize.col('amount_n_g_n')), 'total']],
    raw: true
  });

  const thisRevTotal = Number(thisRev?.total || 0);
  const lastRevTotal = Number(lastRev?.total || 0);
  const revChange    = lastRevTotal ? ((thisRevTotal - lastRevTotal) / lastRevTotal * 100).toFixed(1) : 0;

  // Orders
  const thisOrders = await Order.count({ where: { createdAt: { [Op.gte]: thisMonth } } });
  const lastOrders = await Order.count({ where: { createdAt: { [Op.between]: [lastMonth, lastMonthEnd] } } });
  const ordChange  = lastOrders ? ((thisOrders - lastOrders) / lastOrders * 100).toFixed(1) : 0;

  // Total products and suppliers
  const totalProducts  = await Product.count({ where: { isActive: true } });
  const totalSuppliers = await Supplier.count({ where: { isVerified: true } });
  const totalOrders    = await Order.count();
  const totalRevenue   = await Transaction.sum('amountNGN', { where: { status: 'success' } }) || 0;

  res.json({
    success: true,
    data: {
      revenue: {
        thisMonth: thisRevTotal,
        lastMonth: lastRevTotal,
        change: Number(revChange),
        total: totalRevenue,
        display: `₦${(totalRevenue / 1e6).toFixed(1)}M`
      },
      orders: {
        thisMonth: thisOrders,
        lastMonth: lastOrders,
        change: Number(ordChange),
        total: totalOrders
      },
      products:  { total: totalProducts },
      suppliers: { total: totalSuppliers, verified: totalSuppliers }
    }
  });
}));

export default router;
