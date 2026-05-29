# BuildMart - Building Materials Marketplace

A full-stack e-commerce platform for buying and selling building materials online.

## 📁 Project Structure

```
BuildMart/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── styles/             # Global styles
│   │   ├── data/               # Static data
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── backend/                     # Node.js/Express backend API
│   ├── config/                 # Database & constants config
│   ├── models/                 # Database models (Sequelize)
│   ├── controllers/            # Route controllers
│   ├── routes/                 # API routes
│   ├── middleware/             # Auth, error handling, etc.
│   ├── validators/             # Input validation
│   ├── utils/                  # Helper functions
│   ├── server.js               # Main server file
│   ├── package.json
│   ├── .env                    # Environment variables
│   └── README.md
│
├── package.json                # Root package (scripts for running both)
├── README.md                   # This file
└── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### Installation

1. **Install all dependencies**
   ```bash
   npm run install-all
   ```

2. **Setup Database**
   - Create PostgreSQL database
   - Configure backend `.env` file

3. **Run Frontend & Backend Together**
   ```bash
   npm run dev
   ```

   Or run them separately:
   ```bash
   npm run dev:frontend     # Terminal 1 - React on port 3000
   npm run dev:backend      # Terminal 2 - API on port 5000
   ```

---

## 📂 Frontend (`/frontend`)

**React-based user interface**

- React 18
- Custom CSS Modules (Teal design system)
- No external UI framework
- Components: Navbar, Hero, Search, Shop, Cart, Orders, Reviews

**Start Frontend:**
```bash
cd frontend
npm start
```

Server runs on: `http://localhost:3000`

**More details:** See [frontend/README.md](./frontend/README.md)

---

## 🔧 Backend (`/backend`)

**Node.js/Express REST API**

### Features
- JWT Authentication
- Product Management
- Shopping Cart
- Order Processing
- Reviews & Ratings
- Role-based Access Control
- PostgreSQL Database

### API Endpoints
- `/api/auth` - Authentication
- `/api/products` - Products
- `/api/cart` - Shopping Cart
- `/api/orders` - Orders
- `/api/reviews` - Reviews

**Start Backend:**
```bash
cd backend
npm run dev
```

Server runs on: `http://localhost:5000`
Health check: `http://localhost:5000/api/health`

**More details:** See [backend/README.md](./backend/README.md)

---

## 🗄️ Database

PostgreSQL with Sequelize ORM

**Tables:**
- users
- products
- carts
- cart_items
- orders
- order_items
- reviews

---

## 📚 API Documentation

### Authentication
```bash
# Register
POST /api/auth/register
Body: { firstName, lastName, email, password, phone }

# Login
POST /api/auth/login
Body: { email, password }

# Get Profile
GET /api/auth/profile
Headers: { Authorization: Bearer TOKEN }
```

### Products
```bash
# Get all products
GET /api/products?category=cement&search=quality&page=1&limit=12

# Get product details
GET /api/products/:id

# Create product (supplier)
POST /api/products
Headers: { Authorization: Bearer TOKEN }
Body: { name, category, price, sku, stock, ... }
```

### Cart
```bash
# Get cart
GET /api/cart
Headers: { Authorization: Bearer TOKEN }

# Add to cart
POST /api/cart
Body: { productId, quantity }

# Update cart item
PUT /api/cart/:cartItemId
Body: { quantity }

# Remove from cart
DELETE /api/cart/:cartItemId
```

### Orders
```bash
# Create order
POST /api/orders
Body: { shippingAddress, notes }

# Get my orders
GET /api/orders

# Get order details
GET /api/orders/:id

# Cancel order
PUT /api/orders/:id/cancel
```

### Reviews
```bash
# Get product reviews
GET /api/reviews/product/:productId

# Create review
POST /api/reviews
Body: { productId, orderId, rating, title, comment }

# Update review
PUT /api/reviews/:id

# Delete review
DELETE /api/reviews/:id
```

---

## 🔑 Environment Variables

### Frontend (`.env`)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (`.env`)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=buildmart_db
DB_USER=postgres
DB_PASSWORD=postgres
PORT=5000
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
```

---

## 👥 User Roles

- **Customer** - Browse and buy products, leave reviews
- **Supplier** - Create and manage products
- **Admin** - Full system management

---

## 🛠️ Development

### Available Scripts

**Root Level:**
```bash
npm run install-all      # Install dependencies everywhere
npm run dev              # Run both frontend and backend
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only
npm run build:frontend   # Build React app
npm run build:backend    # Build backend
```

**Frontend:**
```bash
cd frontend
npm start                # Start dev server
npm run build            # Production build
npm test                 # Run tests
```

**Backend:**
```bash
cd backend
npm run dev              # Dev with nodemon
npm start                # Production
npm test                 # Run tests
```

---

## 📦 Tech Stack

### Frontend
- React 18
- CSS Modules
- No external UI library

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- bcryptjs (Password hashing)
- express-validator

### Tools
- Git
- npm
- Docker (optional)

---

## 🚀 Deployment

### Frontend
- Build: `npm run build:frontend`
- Deploy to: Vercel, Netlify, AWS S3, etc.

### Backend
- Set environment: `NODE_ENV=production`
- Deploy to: Heroku, AWS EC2, DigitalOcean, etc.

---

## 📋 Project Phases

### Phase 1 ✅
- User authentication
- Product catalog
- Shopping cart
- Orders
- Reviews
- Basic role-based access

### Phase 2 (Next)
- Payment integration
- Email notifications
- Wishlist feature
- Advanced search
- Admin dashboard

### Phase 3
- Analytics & reporting
- Return/refund management
- Supplier dashboard
- Coupon system

### Phase 4
- Performance optimization
- Caching & Redis
- Mobile optimization
- Recommendation engine

---

## 🐛 Troubleshooting

### Backend fails to connect to database
1. Ensure PostgreSQL is running
2. Check `.env` credentials
3. Create database: `CREATE DATABASE buildmart_db;`

### Frontend can't connect to backend
1. Check if backend is running on port 5000
2. Verify CORS is enabled
3. Check `.env` API URL

### Permission errors in backend
1. Clear `node_modules`: `rm -rf backend/node_modules`
2. Reinstall: `cd backend && npm install`

---

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes
git add .
git commit -m "feat: description"

# Push to repository
git push origin feature/feature-name

# Create pull request
```

---

## 📞 Support

For issues or questions:
1. Check the respective README files
2. Review API documentation
3. Check logs for errors

---

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.
