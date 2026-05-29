# BuildMart - Quick Start Guide

Get BuildMart running in 5 minutes!

## ✅ Pre-requisites Check

- [ ] Node.js installed (`node --version`)
- [ ] PostgreSQL installed and running
- [ ] Code editor (VS Code recommended)
- [ ] Git installed

## 🚀 Quick Start (5 Minutes)

### Step 1: Create Database (1 minute)

Open pgAdmin or PostgreSQL terminal:

```sql
CREATE DATABASE buildmart_db;
```

### Step 2: Install Dependencies (2 minutes)

```bash
npm run install-all
```

This installs:
- Root dependencies
- Frontend dependencies
- Backend dependencies

### Step 3: Start Both Servers (30 seconds)

```bash
npm run dev
```

This starts:
- **Frontend** on http://localhost:3000
- **Backend** on http://localhost:5000

### Step 4: Test the Application (1.5 minutes)

1. Open browser to http://localhost:3000
2. You should see the BuildMart homepage
3. Navigate through:
   - Shop (browse products)
   - Estimator (cost calculator)
   - Cart
   - Orders

✅ **Done!** Your BuildMart app is running!

---

## 🧪 Test the API

In another terminal, test the backend:

```bash
# Health check
curl http://localhost:5000/api/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@test.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "password123"
  }'

# Get products
curl http://localhost:5000/api/products
```

---

## 📁 Project Folders

```
BuildMart/
├── frontend/          # React app (port 3000)
├── backend/           # Node.js API (port 5000)
├── README.md          # Full documentation
├── SETUP_GUIDE.md     # Detailed setup
└── PROJECT_STRUCTURE.md # Architecture overview
```

---

## 🔧 Common Commands

### Frontend Only
```bash
cd frontend
npm start              # Start dev server
npm run build          # Build for production
npm test               # Run tests
```

### Backend Only
```bash
cd backend
npm run dev            # Start with auto-reload
npm start              # Start server
npm test               # Run tests
```

### Both (from root)
```bash
npm run dev            # Both frontend and backend
npm run dev:frontend   # Frontend only
npm run dev:backend    # Backend only
npm run build:frontend # Build frontend
npm run build:backend  # Build backend
```

---

## 📱 Features to Try

### 1. **Product Browsing**
   - Visit http://localhost:3000
   - See featured products
   - Use search bar
   - Click on products

### 2. **Cost Estimator**
   - Click "Estimator" in navbar
   - Fill in project details
   - Step through 4 steps:
     1. Project Setup
     2. Structural Specs
     3. Work Phases
     4. Cost Summary
   - Export as PDF/Excel

### 3. **Authentication** (via API)
   - Register new user
   - Login with credentials
   - Get JWT token
   - Use token for protected endpoints

### 4. **Shopping** (Frontend UI ready)
   - Add products to cart
   - View cart
   - Place orders

---

## 🔐 Test Account

Use these credentials after registration:

```
Email: john@test.com
Password: password123
```

Or create your own via the API.

---

## 📊 Architecture

```
Frontend (React)
    ↓
    ↓ (HTTP Requests)
    ↓
Backend API (Node.js/Express)
    ↓
    ↓ (SQL Queries)
    ↓
PostgreSQL Database
```

---

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Find what's using it
lsof -i :3000

# Kill the process (replace PID)
kill -9 <PID>
```

### Database connection failed
- Check PostgreSQL is running
- Verify database exists: `psql -l`
- Check credentials in `backend/.env`

### Module errors
```bash
# Clear and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install-all
```

### API not responding
- Check backend is running on port 5000
- Check `http://localhost:5000/api/health`
- Check frontend `.env` has correct API URL

---

## 📚 Documentation

- **[Main README](./README.md)** - Complete project info
- **[Setup Guide](./SETUP_GUIDE.md)** - Detailed setup steps
- **[Project Structure](./PROJECT_STRUCTURE.md)** - Full architecture
- **[Frontend README](./frontend/README.md)** - Frontend docs
- **[Backend README](./backend/README.md)** - API docs

---

## ✨ Key Files

### Frontend
- `frontend/src/App.js` - Main app component
- `frontend/src/components/Estimator.js` - Cost estimator (6-step)
- `frontend/src/styles/global.css` - Global styles

### Backend
- `backend/server.js` - Main server
- `backend/models/` - Database models
- `backend/routes/` - API endpoints
- `backend/.env` - Configuration

---

## 🎉 What's Included

✅ **Phase 1 Complete:**
- User authentication (register, login, profile)
- Product management
- Shopping cart
- Order processing
- Product reviews
- Premium cost estimator
- Professional UI

🔄 **Coming Soon (Phase 2):**
- Payment integration
- Email notifications
- Wishlist feature
- Advanced admin dashboard

---

## 💡 Quick Tips

1. **Always run both servers** for full functionality
2. **Check console errors** in browser DevTools (F12)
3. **Use Postman** to test API endpoints
4. **Check backend logs** for API errors
5. **Read error messages** carefully - they tell you what's wrong

---

## 🆘 Need Help?

1. Check the [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
3. Look at [Backend README](./backend/README.md) for API docs
4. Check [Frontend README](./frontend/README.md) for component docs

---

**You're all set! Enjoy BuildMart! 🚀**

---

**Last Updated:** May 26, 2026
**Time to get running:** ~5 minutes
**Status:** ✅ Ready to use
