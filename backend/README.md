# BuildMart Backend API

A professional Node.js/Express backend for the BuildMart building materials marketplace.

## Features

- ✓ User authentication with JWT
- ✓ Product management with categories and inventory
- ✓ Shopping cart functionality
- ✓ Order management and tracking
- ✓ Product reviews and ratings
- ✓ Role-based access control (Customer, Supplier, Admin)
- ✓ Input validation and error handling
- ✓ PostgreSQL database with Sequelize ORM
- ✓ CORS enabled for frontend integration
- ✓ Security headers with Helmet
- ✓ Request logging with Morgan

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Configure database**
   Edit `.env` and set:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=buildmart_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Create database** (PostgreSQL)
   ```sql
   CREATE DATABASE buildmart_db;
   ```

5. **Start server**
   ```bash
   npm run dev
   ```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (authenticated)
- `PUT /api/auth/profile` - Update user profile (authenticated)

### Products
- `GET /api/products` - Get all products (with pagination, filtering, search)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (supplier/admin)
- `PUT /api/products/:id` - Update product (supplier/admin)
- `DELETE /api/products/:id` - Delete product (supplier/admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:cartItemId` - Update cart item quantity
- `DELETE /api/cart/:cartItemId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Orders
- `POST /api/orders` - Create order from cart
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin)
- `PUT /api/orders/:id/cancel` - Cancel order

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## Database Schema

### Users
- id, firstName, lastName, email, password, phone, address, city, state, zipCode
- role (customer, supplier, admin), profilePicture, isActive, emailVerified, lastLogin
- timestamps

### Products
- id, name, description, category, price, discountPrice, sku, image, images
- stock, unit, supplierId, rating, reviewCount, isActive, isFeatured
- timestamps

### Cart
- id, userId, totalPrice, totalItems, timestamps

### CartItems
- id, cartId, productId, quantity, price, timestamps

### Orders
- id, orderNumber, userId, totalAmount, tax, shippingCost, discount
- status, paymentStatus, shippingAddress, notes, trackingNumber, estimatedDelivery
- timestamps

### OrderItems
- id, orderId, productId, quantity, price, productName, sku, timestamps

### Reviews
- id, productId, userId, orderId, rating, title, comment, images
- helpful, verified, timestamps

## Environment Variables

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=buildmart_db
DB_USER=postgres
DB_PASSWORD=password

PORT=5000
NODE_ENV=development

JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:3000

API_VERSION=v1
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Optional validation errors
}
```

## Development Scripts

- `npm run dev` - Start with nodemon for development
- `npm start` - Start server
- `npm test` - Run tests (jest configured)

## Deployment

For production:
1. Set `NODE_ENV=production`
2. Change `JWT_SECRET` to a strong secret
3. Update `CORS_ORIGIN` to your frontend domain
4. Use environment-specific database

## Notes

- Database tables are automatically synced on server start
- All timestamps are in UTC
- Prices are stored as DECIMAL(12,2) for accuracy
- Review ratings are 1-5 scale
- Orders cannot be cancelled after shipping
