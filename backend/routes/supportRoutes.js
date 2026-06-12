import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { SupportRequest } from '../models/index.js';

const router = express.Router();

// ── POST /api/support/contact ─────────────────────────────────────────────────
router.post('/contact', asyncHandler(async (req, res) => {
  const { orderId, subject, message, customerName, customerEmail } = req.body;

  if (!subject || !message || !customerName || !customerEmail) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

  const ticketId = `TKT-${Date.now().toString().slice(-6)}`;

  await SupportRequest.create({
    ticketId,
    orderId:       orderId || null,
    subject,
    message,
    customerName,
    customerEmail
  });

  res.json({ success: true, ticketId });
}));

export default router;
