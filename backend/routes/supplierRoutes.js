import express from 'express';
import { Supplier } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// ── GET /api/suppliers ───────────────────────────────────────────────────────
// Returns verified suppliers for the storefront Suppliers page
router.get('/', asyncHandler(async (req, res) => {
  const suppliers = await Supplier.findAll({
    where: { isVerified: true },
    order: [['name', 'ASC']],
    attributes: ['id', 'name', 'category', 'location', 'rating', 'totalOrders', 'icon', 'isVerified']
  });

  // Format to match frontend expectations
  const formatted = suppliers.map(s => ({
    name:    s.name,
    cat:     s.category,
    loc:     s.location,
    rating:  s.rating.toFixed(1),
    orders:  s.totalOrders,
    icon:    s.icon,
    verified: s.isVerified
  }));

  res.json(formatted);
}));

// ── PATCH /api/suppliers/:id/approve ────────────────────────────────────────
router.patch('/:id/approve', asyncHandler(async (req, res) => {
  const s = await Supplier.findByPk(req.params.id);
  if (!s) return res.status(404).json({ success: false, message: 'Supplier not found' });
  await s.update({ isVerified: true });
  res.json({ success: true, message: 'Supplier approved' });
}));

export default router;
