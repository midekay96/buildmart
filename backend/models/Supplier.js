import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Supplier = sequelize.define('Supplier', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'cat'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'loc'
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: { min: 0, max: 5 }
  },
  totalOrders: {
    type: DataTypes.STRING,
    defaultValue: '0',
    comment: 'Display string e.g. "12K+"'
  },
  icon: {
    type: DataTypes.STRING(10),
    defaultValue: '🏭'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isEmail: true }
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'suppliers'
});

export default Supplier;
