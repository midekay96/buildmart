# BuildMart Project Structure

Complete overview of the BuildMart full-stack application.

## 📁 Project Layout

```
BuildMart/
│
├── frontend/                    # React frontend (Port 3000)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js                    # Top navigation
│   │   │   ├── Navbar.module.css
│   │   │   ├── Hero.js                      # Hero banner
│   │   │   ├── Hero.module.css
│   │   │   ├── FeatureStrip.js              # Features section
│   │   │   ├── FeatureStrip.module.css
│   │   │   ├── SearchBar.js                 # Product search
│   │   │   ├── SearchBar.module.css
│   │   │   ├── ProductCard.js               # Single product card
│   │   │   ├── ProductCard.module.css
│   │   │   ├── Shop.js                      # Product grid
│   │   │   ├── Shop.module.css
│   │   │   ├── Cart.js                      # Shopping cart
│   │   │   ├── Cart.module.css
│   │   │   ├── Orders.js                    # Order history
│   │   │   ├── Orders.module.css
│   │   │   ├── Suppliers.js                 # Suppliers list
│   │   │   ├── Suppliers.module.css
│   │   │   ├── Estimator.js                 # Cost estimator (6-step wizard)
│   │   │   └── Estimator.module.css
│   │   ├── styles/
│   │   │   └── global.css                   # Global styles
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── .env                                 # Environment variables
│   ├── package.json
│   └── README.md
│
├── backend/                     # Node.js/Express API (Port 5000)
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection
│   │   └── constants.js         # App constants
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Product.js           # Product model
│   │   ├── Cart.js              # Cart model
│   │   ├── CartItem.js          # Cart item model
│   │   ├── Order.js             # Order model
│   │   ├── OrderItem.js         # Order item model
│   │   ├── Review.js            # Review model
│   │   └── index.js             # Model associations
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── productController.js # Product logic
│   │   ├── cartController.js    # Cart logic
│   │   ├── orderController.js   # Order logic
│   │   └── reviewController.js  # Review logic
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── productRoutes.js     # Product endpoints
│   │   ├── cartRoutes.js        # Cart endpoints
│   │   ├── orderRoutes.js       # Order endpoints
│   │   └── reviewRoutes.js      # Review endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification
│   │   └── errorHandler.js      # Error handling
│   ├── validators/
│   │   ├── authValidator.js     # Auth validation
│   │   └── productValidator.js  # Product validation
│   ├── utils/
│   │   ├── jwt.js               # JWT utilities
│   │   └── password.js          # Password utilities
│   ├── .env                     # Environment variables
│   ├── .env.example
│   ├── server.js                # Main server file
│   ├── package.json
│   └── README.md
│
├── .claude/                     # Claude Code configuration
│   ├── launch.json
│   ├── settings.local.json
│   └── worktrees/
│
├── package.json                 # Root package (run both apps)
├── README.md                    # Main project README
├── SETUP_GUIDE.md              # Setup instructions
├── PROJECT_STRUCTURE.md        # This file
└── .gitignore
```

## 🗄️ Database Schema

### users
- id (UUID)
- firstName, lastName
- email (unique)
- password (hashed)
- phone
- address, city, state, zipCode
- role (customer/supplier/admin)
- profilePicture
- isActive, emailVerified
- lastLogin
- timestamps

### products
- id (UUID)
- name, description
- category (enum)
- price, discountPrice
- sku (unique)
- image, images[]
- stock, unit
- supplierId (FK → users)
- rating, reviewCount
- isActive, isFeatured
- timestamps

### carts
- id (UUID)
- userId (FK → users)
- totalPrice, totalItems
- timestamps

### cart_items
- id (UUID)
- cartId (FK → carts)
- productId (FK → products)
- quantity, price
- timestamps

### orders
- id (UUID)
- orderNumber (unique)
- userId (FK → users)
- totalAmount, tax, shippingCost, discount
- status (enum: pending/confirmed/processing/shipped/delivered/cancelled)
- paymentStatus (enum: pending/completed/failed/refunded)
- shippingAddress (JSON)
- notes, trackingNumber
- estimatedDelivery
- timestamps

### order_items
- id (UUID)
- orderId (FK → orders)
- productId (FK → products)
- quantity, price
- productName, sku
- timestamps

### reviews
- id (UUID)
- productId (FK → products)
- userId (FK → users)
- orderId (FK → orders)
- rating (1-5)
- title, comment
- images[]
- helpful, verified
- timestamps

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register           # Register user
POST   /api/auth/login              # Login user
GET    /api/auth/profile            # Get profile (protected)
PUT    /api/auth/profile            # Update profile (protected)
```

### Products
```
GET    /api/products                # List all products
GET    /api/products/featured       # Featured products
GET    /api/products/:id            # Get product details
POST   /api/products                # Create product (supplier)
PUT    /api/products/:id            # Update product (supplier)
DELETE /api/products/:id            # Delete product (supplier)
```

### Cart
```
GET    /api/cart                    # Get user's cart (protected)
POST   /api/cart                    # Add to cart (protected)
PUT    /api/cart/:cartItemId        # Update quantity (protected)
DELETE /api/cart/:cartItemId        # Remove from cart (protected)
DELETE /api/cart                    # Clear cart (protected)
```

### Orders
```
POST   /api/orders                  # Create order (protected)
GET    /api/orders                  # Get user's orders (protected)
GET    /api/orders/:id              # Get order details (protected)
PUT    /api/orders/:id/status       # Update status (admin)
PUT    /api/orders/:id/cancel       # Cancel order (protected)
```

### Reviews
```
GET    /api/reviews/product/:productId  # Get product reviews
POST   /api/reviews                      # Create review (protected)
PUT    /api/reviews/:id                  # Update review (protected)
DELETE /api/reviews/:id                  # Delete review (protected)
```

## 🔑 Key Features

### Frontend
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Product browsing with search & filtering
- ✅ Product cards with images, prices, ratings
- ✅ Shopping cart management
- ✅ Order history page
- ✅ Premium cost estimator (6-step wizard)
- ✅ Teal design system (custom styling)
- ✅ CSS Modules for scoped styling

### Backend
- ✅ User authentication with JWT
- ✅ Product management (CRUD)
- ✅ Shopping cart operations
- ✅ Order processing & tracking
- ✅ Product reviews & ratings
- ✅ Role-based access control (Customer, Supplier, Admin)
- ✅ Input validation
- ✅ Error handling middleware
- ✅ PostgreSQL with Sequelize ORM
- ✅ Password hashing with bcryptjs
- ✅ CORS enabled for frontend
- ✅ Request logging with Morgan

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- npm/yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Setup PostgreSQL:**
   ```sql
   CREATE DATABASE buildmart_db;
   ```

3. **Configure environment files:**
   - Backend: `backend/.env`
   - Frontend: `frontend/.env` (already set)

4. **Run both servers:**
   ```bash
   npm run dev
   ```

   Or run separately:
   ```bash
   npm run dev:frontend    # Terminal 1
   npm run dev:backend     # Terminal 2
   ```

### Access Points
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

## 📦 Dependencies

### Frontend
- react@18.2.0
- react-dom@18.2.0
- react-scripts@5.0.1

### Backend
- express@4.18.2
- pg@8.11.3
- sequelize@6.35.2
- bcryptjs@2.4.3
- jsonwebtoken@9.1.2
- dotenv@16.3.1
- cors@2.8.5
- express-validator@7.0.0
- helmet@7.1.0
- morgan@1.10.0

## 🔐 Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=buildmart_db
DB_USER=postgres
DB_PASSWORD=postgres
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
API_VERSION=v1
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

## 📝 Development Workflow

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes in frontend or backend
3. Test locally
4. Commit changes: `git commit -m "feat: description"`
5. Push to remote: `git push origin feature/feature-name`
6. Create pull request

## 🐛 Common Issues

**Backend can't connect to database:**
- Ensure PostgreSQL is running
- Check DB credentials in `.env`
- Create database: `CREATE DATABASE buildmart_db;`

**Frontend can't connect to backend:**
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Check CORS settings in backend

**Module not found errors:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## 📄 Additional Resources

- [Main README](./README.md) - Project overview
- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions
- [Frontend README](./frontend/README.md) - Frontend documentation
- [Backend README](./backend/README.md) - Backend documentation

## 🎯 Project Phases

**Phase 1:** ✅ Complete
- User auth, products, cart, orders, reviews, 3D estimator

**Phase 2:** 📋 Planned
- Payments, email notifications, wishlist, advanced search

**Phase 3:** 📋 Planned
- Admin dashboard, analytics, supplier portal, coupons

**Phase 4:** 📋 Planned
- Performance optimization, caching, mobile app, recommendations

---

**Last Updated:** May 26, 2026
**Status:** Production Ready (Phase 1)
