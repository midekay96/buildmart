import User        from './User.js';
import Product     from './Product.js';
import Supplier    from './Supplier.js';
import Cart        from './Cart.js';
import CartItem    from './CartItem.js';
import Order       from './Order.js';
import OrderItem   from './OrderItem.js';
import Review      from './Review.js';
import Transaction from './Transaction.js';
import SupportRequest from './SupportRequest.js';

// ── Associations ──────────────────────────────────────────────────────────────

// Supplier → Products
Supplier.hasMany(Product, { foreignKey: 'supplierId', as: 'products' });
Product.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplierRecord' });

// User (admin/old) → Products
User.hasMany(Product, { foreignKey: 'supplierId', as: 'suppliedProducts' });

// Cart
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'userId' });
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(CartItem, { foreignKey: 'productId' });

// Orders
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(OrderItem, { foreignKey: 'productId' });

// Transactions → Orders
Transaction.belongsTo(Order, { foreignKey: 'orderId' });
Order.hasMany(Transaction, { foreignKey: 'orderId', as: 'transactions' });

// Reviews
Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'productId' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId' });
Order.hasMany(Review, { foreignKey: 'orderId' });
Review.belongsTo(Order, { foreignKey: 'orderId' });

export { User, Product, Supplier, Cart, CartItem, Order, OrderItem, Review, Transaction, SupportRequest };
