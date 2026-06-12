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
    allowNull: false,
    unique: true,
    comment: 'Paystack payment reference'
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  orderNumber: {
    type: DataTypes.STRING,
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
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amountKobo: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Amount in kobo (100 kobo = 1 NGN)'
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
  },
  paystackData: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Full Paystack response payload'
  }
}, {
  timestamps: true,
  tableName: 'transactions',
  indexes: [
    { fields: ['reference'] },
    { fields: ['orderId'] },
    { fields: ['status'] },
    { fields: ['createdAt'] }
  ]
});

export default Transaction;
