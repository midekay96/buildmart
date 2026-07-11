import express  from 'express';
import cors     from 'cors';
import helmet   from 'helmet';
import morgan   from 'morgan';
import dotenv   from 'dotenv';

import sequelize from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

// ── Route imports ─────────────────────────────────────────────────────────────
import authRoutes      from './routes/authRoutes.js';
import productRoutes   from './routes/productRoutes.js';
import orderRoutes     from './routes/orderRoutes.js';
import supplierRoutes  from './routes/supplierRoutes.js';
import adminRoutes     from './routes/adminRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import paymentRoutes   from './routes/paymentRoutes.js';
import supportRoutes   from './routes/supportRoutes.js';

// ── Load models (required so associations run) ────────────────────────────────
import './models/index.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin:  process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-paystack-signature']
}));
app.use(morgan('dev'));

// ── Paystack webhook must receive raw body ────────────────────────────────────
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);       // legacy user auth (kept for compatibility)
app.use('/api/admin',      adminRoutes);      // admin login + admin CRUD endpoints
app.use('/api/products',   productRoutes);    // storefront product listing
app.use('/api/orders',     orderRoutes);      // place order + order history
app.use('/api/suppliers',  supplierRoutes);   // storefront supplier listing
app.use('/api/analytics',  analyticsRoutes);  // KPI data for admin dashboard
app.use('/api/payments',   paymentRoutes);    // Paystack initiate / verify / webhook
app.use('/api/support',    supportRoutes);    // customer support requests

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success:   true,
    message:   'BuildMart API is running',
    version:   '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ PostgreSQL connected');

    // Use force: true to completely recreate schema (fixes constraint issues in dev)
    // In production use proper migrations
    const syncMode = process.env.NODE_ENV === 'production'
      ? { alter: false }
      : { force: true };

    await sequelize.sync(syncMode);
    console.log('✓ Database models synced');

    app.listen(PORT, () => {
      console.log(`\n✓ BuildMart API running on http://localhost:${PORT}`);
      console.log(`  Health:   http://localhost:${PORT}/api/health`);
      console.log(`  Products: http://localhost:${PORT}/api/products`);
      console.log(`  Admin:    POST http://localhost:${PORT}/api/admin/login\n`);
    });
  } catch (error) {
    console.error('✗ Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
