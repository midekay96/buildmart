import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cat: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Category short name e.g. Cement, Iron, Tiles'
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 },
    comment: 'Price in NGN (no decimals for building materials)'
  },
  oldPrice: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Strike-through price for sales'
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'per piece'
  },
  icon: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Emoji fallback icon'
  },
  badge: {
    type: DataTypes.ENUM('hot', 'new', 'sale'),
    allowNull: true
  },
  color: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: '#F5F5F5',
    comment: 'Fallback background colour hex'
  },
  img: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Product image URL (Unsplash or Cloudinary)'
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'FK to suppliers table'
  },
  supplierName: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Denormalised supplier name for fast reads'
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 999,
    validate: { min: 0 }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'products',
  indexes: [
    { fields: ['cat'] },
    { fields: ['supplierId'] },
    { fields: ['isActive'] }
  ]
});

// Helper: format product for frontend response
Product.format = (p) => ({
  id:          p.id,
  name:        p.name,
  brand:       p.brand,
  cat:         p.cat,
  supplier:    p.supplierName,
  price:       p.price,
  oldPrice:    p.oldPrice,
  unit:        p.unit,
  icon:        p.icon,
  badge:       p.badge,
  color:       p.color,
  img:         p.img,
  stock:       p.stock,
  isFeatured:  p.isFeatured
});

export default Product;
