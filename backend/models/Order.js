import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { ORDER_STATUS, PAYMENT_STATUS } from '../config/constants.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM(...Object.values(ORDER_STATUS)),
    defaultValue: ORDER_STATUS.PENDING
  },
  paymentStatus: {
    type: DataTypes.ENUM(...Object.values(PAYMENT_STATUS)),
    defaultValue: PAYMENT_STATUS.PENDING
  },
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estimatedDelivery: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'orders',
  indexes: [
    { fields: ['userId'] },
    { fields: ['orderNumber'] },
    { fields: ['status'] }
  ]
});

export default Order;
