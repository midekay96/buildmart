import express from 'express';
import https    from 'https';
import { asyncHandler } from '../middleware/errorHandler.js';
import { Transaction, Order } from '../models/index.js';

const router = express.Router();

// ── Paystack helper ───────────────────────────────────────────────────────────
function paystackRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.paystack.co',
      port:     443,
      path,
      method,
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ── POST /api/payments/initiate ───────────────────────────────────────────────
// Frontend calls this BEFORE showing the Paystack popup
// Body: { amount (NGN), email, orderId, metadata }
router.post('/initiate', asyncHandler(async (req, res) => {
  const { amount, email, orderId, metadata } = req.body;

  if (!amount || !email) {
    return res.status(400).json({ success: false, message: 'Amount and email are required' });
  }

  const amountKobo = Math.round(Number(amount) * 100); // Paystack uses kobo

  const payload = {
    amount:     amountKobo,
    email,
    currency:   'NGN',
    metadata:   metadata || {},
    callback_url: `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/payment/callback`
  };

  const response = await paystackRequest('POST', '/transaction/initialize', payload);

  if (!response.status) {
    return res.status(500).json({ success: false, message: response.message || 'Paystack error' });
  }

  // Save pending transaction
  await Transaction.create({
    reference:     response.data.reference,
    orderId:       orderId || null,
    orderNumber:   metadata?.orderNumber || null,
    customerName:  metadata?.customerName || 'Customer',
    customerEmail: email,
    amountKobo,
    amountNGN:     amount,
    method:        'card',
    status:        'pending'
  });

  res.json({
    success:       true,
    reference:     response.data.reference,
    authorization_url: response.data.authorization_url,
    access_code:   response.data.access_code
  });
}));

// ── GET /api/payments/verify/:reference ─────────────────────────────────────
// Frontend calls after Paystack popup closes (success)
router.get('/verify/:reference', asyncHandler(async (req, res) => {
  const { reference } = req.params;

  const response = await paystackRequest('GET', `/transaction/verify/${reference}`);

  if (!response.status) {
    return res.status(400).json({ success: false, message: 'Verification failed' });
  }

  const txnData  = response.data;
  const status   = txnData.status === 'success' ? 'success' : 'failed';
  const method   = txnData.channel || 'card';

  // Update transaction record
  const txn = await Transaction.findOne({ where: { reference } });
  if (txn) {
    await txn.update({
      status,
      method,
      paystackData: txnData
    });

    // If payment succeeded, update associated order
    if (status === 'success' && txn.orderId) {
      await Order.update(
        { paymentStatus: 'completed', status: 'confirmed' },
        { where: { id: txn.orderId } }
      );
    }
  }

  res.json({
    success: true,
    paid:      status === 'success',
    amount:    txnData.amount / 100,        // convert kobo → NGN
    reference: txnData.reference,
    method:    txnData.channel,
    customerEmail: txnData.customer?.email
  });
}));

// ── POST /api/payments/webhook ────────────────────────────────────────────────
// Paystack calls this automatically when a payment completes
// Add your Paystack webhook URL in the Paystack dashboard:
//   https://dashboard.paystack.com/#/settings/developer → Webhook URL
router.post('/webhook', asyncHandler(async (req, res) => {
  // Validate Paystack signature (basic check)
  const crypto    = await import('crypto');
  const hash      = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
                          .update(JSON.stringify(req.body))
                          .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(401).send('Signature mismatch');
  }

  const { event, data } = req.body;

  if (event === 'charge.success') {
    const txn = await Transaction.findOne({ where: { reference: data.reference } });
    if (txn && txn.status !== 'success') {
      await txn.update({ status: 'success', method: data.channel, paystackData: data });

      if (txn.orderId) {
        await Order.update(
          { paymentStatus: 'completed', status: 'confirmed' },
          { where: { id: txn.orderId } }
        );
      }
    }
  }

  res.sendStatus(200);
}));

export default router;
