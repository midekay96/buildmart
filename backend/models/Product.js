import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { PRODUCT_CATEGORIES } from '../config/constants.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM(...PRODUCT_CATEGORIES),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  discountPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: { min: 0 }
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 }
  },
  unit: {
    type: DataTypes.STRING,
    defaultValue: 'piece'
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: { min: 0, max: 5 }
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
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
    { fields: ['category'] },
    { fields: ['supplierId'] },
    { fields: ['sku'] }
  ]
});

export default Product;
