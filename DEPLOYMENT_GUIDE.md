# BuildMart - Complete Production Deployment Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Phase 1: Project Setup](#phase-1-project-setup)
4. [Phase 2: Backend Development](#phase-2-backend-development)
5. [Phase 3: Frontend Development](#phase-3-frontend-development)
6. [Phase 4: Mobile Responsiveness](#phase-4-mobile-responsiveness)
7. [Phase 5: Payment Integration](#phase-5-payment-integration)
8. [Phase 6: Local Testing](#phase-6-local-testing)
9. [Phase 7: Production Deployment](#phase-7-production-deployment)
10. [Phase 8: Post-Deployment Testing](#phase-8-post-deployment-testing)

---

## Project Overview

**BuildMart** is a full-stack Building Materials Marketplace with:
- **Frontend:** React.js (Vercel deployment)
- **Backend:** Node.js + Express.js (Railway deployment)
- **Database:** PostgreSQL
- **Payment:** Paystack integration
- **Mobile:** Fully responsive design

**Tech Stack:**
- Frontend: React, CSS Modules, Dark/Light theme
- Backend: Express.js, Sequelize ORM, PostgreSQL
- Deployment: Vercel (frontend), Railway (backend)
- Payment: Paystack (test & live modes)

---

## Prerequisites

Before starting, ensure you have:

1. **Node.js & npm** - Download from https://nodejs.org
   ```bash
   node --version  # v18+ recommended
   npm --version   # v9+
   ```

2. **PostgreSQL** - Download from https://www.postgresql.org/download
   - Create a database for development
   - Remember your credentials (username, password)

3. **Git** - Download from https://git-scm.com

4. **GitHub Account** - Create at https://github.com
   - Create a new repository named "buildmart"

5. **Vercel Account** - Sign up at https://vercel.com
   - Free tier is sufficient

6. **Railway Account** - Sign up at https://railway.app
   - Free tier includes $5/month credits

7. **Paystack Account** - Sign up at https://paystack.com
   - Get your test API keys from dashboard

---

## Phase 1: Project Setup

### Step 1.1: Create Project Structure

```bash
mkdir buildmart
cd buildmart

# Create frontend and backend folders
mkdir frontend backend

# Initialize git
git init
git add .
git commit -m "Initial commit: Project structure"
```

### Step 1.2: Initialize Frontend (React)

```bash
cd frontend

# Create React app
npx create-react-app .

# Install dependencies
npm install

# Additional packages needed
npm install react-router-dom axios dotenv

cd ..
```

### Step 1.3: Initialize Backend (Express)

```bash
cd backend

# Create package.json
npm init -y

# Install dependencies
npm install express cors helmet morgan dotenv pg sequelize bcryptjs jsonwebtoken
npm install --save-dev nodemon jest

# Create directory structure
mkdir config models routes middleware services
mkdir config/database.js

cd ..
```

### Step 1.4: Create .gitignore

```bash
cd buildmart

# Create .gitignore in root
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
.env.*.local
.DS_Store
.vscode/
.idea/
dist/
build/
*.log
EOF

git add .gitignore
git commit -m "Add .gitignore"
```

---

## Phase 2: Backend Development

### Step 2.1: Database Setup

**Create PostgreSQL Database:**
```bash
# Open PostgreSQL (via terminal or pgAdmin)
psql -U postgres

# Create database
CREATE DATABASE buildmart_dev;

# Connect to database
\c buildmart_dev

# Exit
\q
```

### Step 2.2: Create Backend Configuration

**File: `backend/config/database.js`**
```javascript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/buildmart_dev',
  {
    dialect: 'postgres',
    logging: false
  }
);

export default sequelize;
```

**File: `backend/.env`**
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/buildmart_dev
CORS_ORIGIN=http://localhost:3000
PAYSTACK_PUBLIC_KEY=pk_test_your_key
PAYSTACK_SECRET_KEY=sk_test_your_key
```

### Step 2.3: Create Models

Create the following files in `backend/models/`:

**File: `backend/models/Product.js`**
```javascript
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sku: {
    type: DataTypes.STRING,
    unique: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  tableName: 'products'
});

export default Product;
```

**File: `backend/models/Order.js`**
```javascript
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    unique: true
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deliveryAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  deliveryType: {
    type: DataTypes.ENUM('standard', 'express'),
    defaultValue: 'standard'
  },
  total: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.STRING
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    defaultValue: 'pending'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'orders'
});

export default Order;
```

**File: `backend/models/Transaction.js`**
```javascript
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: false
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amountKobo: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  amountNGN: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  method: {
    type: DataTypes.ENUM('card', 'bank_transfer', 'ussd', 'qr'),
    defaultValue: 'card'
  },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'failed', 'abandoned'),
    defaultValue: 'pending'
  }
}, {
  timestamps: true,
  tableName: 'transactions'
});

export default Transaction;
```

### Step 2.4: Create Server

**File: `backend/server.js`**
```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import sequelize from './config/database.js';
import './models/index.js';

import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'BuildMart API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ PostgreSQL connected');

    const syncMode = process.env.NODE_ENV === 'production'
      ? { alter: false }
      : { force: true };

    await sequelize.sync(syncMode);
    console.log('✓ Database models synced');

    app.listen(PORT, () => {
      console.log(`\n✓ BuildMart API running on http://localhost:${PORT}`);
      console.log(`  Health: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('✗ Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
```

### Step 2.5: Create Routes

**File: `backend/routes/productRoutes.js`**
```javascript
import express from 'express';
import { Product } from '../models/index.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
```

**File: `backend/routes/orderRoutes.js`**
```javascript
import express from 'express';
import { Order, OrderItem } from '../models/index.js';

const router = express.Router();

// Create order
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, deliveryAddress, items, total } = req.body;

    const order = await Order.create({
      orderNumber: `ORD-${Date.now()}`,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      total,
      userId: null
    });

    // Add items
    for (const item of items) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.id || null,
        productName: item.name,
        quantity: item.quantity,
        price: item.price
      });
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ association: 'items' }]
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
```

### Step 2.6: Update package.json

**File: `backend/package.json`**
```json
{
  "name": "buildmart-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "sequelize": "^6.35.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0"
  }
}
```

---

## Phase 3: Frontend Development

### Step 3.1: Create Frontend Structure

```bash
cd frontend

# Create directories
mkdir -p src/components src/pages src/styles src/services src/data

# Create main App component
cat > src/App.js << 'EOF'
import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Shop from './components/Shop';

function App() {
  const [activeTab, setActiveTab] = useState('shop');
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="App">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} cartCount={cartCount} />
      {activeTab === 'shop' && <Shop />}
    </div>
  );
}

export default App;
EOF

cd ..
```

### Step 3.2: Create .env for Frontend

**File: `frontend/.env.local`**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_PAYSTACK_PUBLIC_KEY=pk_test_your_test_key
```

### Step 3.3: Create Key Components

**File: `frontend/src/components/Navbar.js`** - Navigation with hamburger menu for mobile

**File: `frontend/src/components/Shop.js`** - Product listing with filters

**File: `frontend/src/components/Cart.js`** - Shopping cart display

**File: `frontend/src/components/CheckoutModal.js`** - Payment form with Paystack integration

**File: `frontend/src/components/Orders.js`** - Order history display

### Step 3.4: Create API Service

**File: `frontend/src/services/api.js`**
```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getProducts = () => api.get('/products');
export const getOrders = () => api.get('/orders');
export const createOrder = (orderData) => api.post('/orders', orderData);
export const initiatePayment = (paymentData) => api.post('/payments/initialize', paymentData);
export const verifyPayment = (reference) => api.get(`/payments/verify/${reference}`);

export default api;
```

---

## Phase 4: Mobile Responsiveness

### Step 4.1: Add Mobile Media Queries

Update all `.module.css` files with mobile breakpoints:

**Example - Navbar Mobile:**
```css
@media (max-width: 640px) {
  .nav {
    padding: 0 0.75rem;
    height: 52px;
  }

  .logo {
    font-size: 14px;
    gap: 4px;
  }

  .links {
    display: none;
  }

  .menuBtn {
    display: block;
  }

  .mobileMenu {
    display: flex;
  }
}
```

### Step 4.2: Add Hamburger Menu

```javascript
// In Navbar.js
const [menuOpen, setMenuOpen] = useState(false);

return (
  <nav className={styles.nav}>
    {/* Logo */}
    <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
      ☰
    </button>
    
    {/* Mobile Menu */}
    {menuOpen && (
      <div className={styles.mobileMenu}>
        {/* Navigation items */}
      </div>
    )}
  </nav>
);
```

### Step 4.3: Add Responsive Grid

```css
/* Desktop */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
}

/* Tablet */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}
```

---

## Phase 5: Payment Integration

### Step 5.1: Get Paystack Keys

1. Sign up at https://paystack.com
2. Go to Dashboard → Settings → API Keys & Webhooks
3. Copy your **Public Key** (test mode)
4. Copy your **Secret Key** (test mode)

### Step 5.2: Add Paystack to Frontend

**File: `frontend/.env.local`**
```
REACT_APP_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
```

### Step 5.3: Create Payment Handler

**File: `frontend/src/services/paystack.js`**
```javascript
export const initializePayment = (email, amount, ref, callback) => {
  const handler = window.PaystackPop.setup({
    key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
    email: email,
    amount: amount * 100, // Convert to kobo
    ref: ref,
    onClose: () => console.log('Payment window closed'),
    callback: callback
  });
  handler.openIframe();
};
```

### Step 5.4: Create Backend Payment Routes

**File: `backend/routes/paymentRoutes.js`**
```javascript
import express from 'express';
import axios from 'axios';
import { Order, Transaction } from '../models/index.js';

const router = express.Router();
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

// Initialize payment
router.post('/initialize', async (req, res) => {
  try {
    const { email, amount, orderId } = req.body;
    const reference = `${orderId}-${Date.now()}`;

    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      email,
      amount: amount * 100, // Convert to kobo
      reference
    }, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify payment
router.get('/verify/:reference', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${req.params.reference}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    );

    if (response.data.data.status === 'success') {
      // Update order status
      await Order.update(
        { paymentStatus: 'paid', status: 'processing' },
        { where: { orderNumber: req.params.reference.split('-')[0] } }
      );
    }

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
```

---

## Phase 6: Local Testing

### Step 6.1: Start Backend

```bash
cd backend
npm install
npm run dev
# Expected: ✓ BuildMart API running on http://localhost:5000
```

### Step 6.2: Start Frontend

```bash
cd frontend
npm install
npm start
# Expected: Opens http://localhost:3000 in browser
```

### Step 6.3: Test Features

**Checklist:**
- [ ] Products load on Shop page
- [ ] Add items to cart
- [ ] Cart badge updates with count
- [ ] Checkout modal opens
- [ ] Can enter delivery information
- [ ] Paystack payment gateway loads
- [ ] Complete payment (test mode)
- [ ] Order appears in Orders page
- [ ] Mobile layout is responsive
- [ ] Dark/Light theme toggle works

---

## Phase 7: Production Deployment

### Step 7.1: Prepare Backend for Railway

**Create `Procfile` in root (not backend folder):**
```
web: cd backend && npm install && node server.js
```

**Update `backend/.env` for production:**
```
NODE_ENV=production
CORS_ORIGIN=https://buildmart-zeta.vercel.app
PAYSTACK_PUBLIC_KEY=pk_live_your_live_key (or test for now)
PAYSTACK_SECRET_KEY=sk_live_your_live_key (or test for now)
```

### Step 7.2: Deploy Backend to Railway

1. Commit and push to GitHub:
```bash
git add Procfile
git commit -m "Add Procfile for Railway deployment"
git push origin main
```

2. Go to https://railway.app/dashboard
3. Click "New Project" → "Deploy from GitHub repo"
4. Select "buildmart" repo
5. Add PostgreSQL database
6. Add environment variables (see above)
7. Railway auto-deploys - wait for ✅ "Running" status
8. Copy Railway URL (e.g., `https://buildmart-xxx.up.railway.app`)

### Step 7.3: Deploy Frontend to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import GitHub repo "buildmart"
4. Set root directory to "frontend"
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://buildmart-xxx.up.railway.app
   ```
6. Deploy
7. Get Vercel URL (e.g., `https://buildmart-zeta.vercel.app`)

### Step 7.4: Update Production Variables

**On Railway:**
- Update CORS_ORIGIN to your Vercel URL
- Update payment keys to live keys (if going live)

**On Vercel:**
- Environment variables are already set

---

## Phase 8: Post-Deployment Testing

### Step 8.1: Test Production App

**Visit:** https://buildmart-zeta.vercel.app

**Test checklist:**
- [ ] App loads without errors
- [ ] Shop displays products (from Railway API)
- [ ] Can add items to cart
- [ ] Checkout works
- [ ] Payment with Paystack completes
- [ ] Order appears in Orders page
- [ ] Orders are saved in Railway PostgreSQL
- [ ] Mobile is responsive
- [ ] Dark/Light theme works
- [ ] All API calls use Railway URL

### Step 8.2: Monitor Deployment

**Monitor Backend Health:**
- https://buildmart-xxx.up.railway.app/api/health

**Check Logs:**
- Railway: Dashboard → Deployments → View Logs
- Vercel: Dashboard → Deployments → View Logs

---

## Troubleshooting

### Backend not starting on Railway
- Check environment variables are set
- Verify DATABASE_URL is correct
- Check PORT is set to 5000
- View deploy logs for specific error

### Frontend not connecting to backend
- Verify REACT_APP_API_URL matches Railway URL
- Check CORS_ORIGIN on Railway matches Vercel URL
- Clear browser cache and restart

### Payment not working
- Verify Paystack keys are correct
- Check payment is in test mode (use test cards)
- Check webhook is configured on Paystack

### Orders not appearing
- Verify database is connected on Railway
- Check order creation endpoint returns success
- Verify frontend calls /api/orders endpoint

---

## Environment Variables Checklist

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5000 (local) / https://backend-url (production)
REACT_APP_PAYSTACK_PUBLIC_KEY=pk_test_xxx
```

### Backend (.env)
```
NODE_ENV=development (local) / production
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost/buildmart_dev (local) / Railway URL (production)
CORS_ORIGIN=http://localhost:3000 (local) / https://vercel-url (production)
PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx
```

---

## Commands Reference

```bash
# Backend development
cd backend && npm run dev

# Frontend development
cd frontend && npm start

# Backend production start
npm start

# Deploy to git
git add .
git commit -m "Your message"
git push origin main

# Check backend health
curl http://localhost:5000/api/health

# Check database connection
psql -U postgres -d buildmart_dev
```

---

## Production Checklist Before Launch

- [ ] All environment variables set on Railway and Vercel
- [ ] Database migrations completed
- [ ] Paystack live keys obtained (or test keys for MVP)
- [ ] CORS configured correctly
- [ ] Backend and frontend URLs match in env vars
- [ ] SSL/HTTPS enabled (Railway/Vercel handle this)
- [ ] Error logging configured
- [ ] Payment testing completed (test card: 4111111111111111)
- [ ] Mobile testing on real devices
- [ ] Dark/Light theme works in production
- [ ] Orders persist after payment
- [ ] All API endpoints tested

---

## Support & Resources

- **Sequelize Docs:** https://sequelize.org/docs/v6/
- **Paystack API:** https://paystack.com/docs/api/
- **Railway Docs:** https://docs.railway.app/
- **Vercel Docs:** https://vercel.com/docs

---

**Deployment Date:** July 11, 2026
**Last Updated:** July 11, 2026
**Status:** Production Ready ✅
