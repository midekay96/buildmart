import { Order, OrderItem, Cart, CartItem, Product, User } from '../models/index.js';
import { HTTP_STATUS, ORDER_STATUS } from '../config/constants.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const generateOrderNumber = () => {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, notes } = req.body;

  if (!shippingAddress) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Shipping address is required'
    });
  }

  const cart = await Cart.findOne({
    where: { userId: req.user.userId },
    include: [
      {
        association: 'items',
        include: [{ model: Product }]
      }
    ]
  });

  if (!cart || cart.items.length === 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Cart is empty'
    });
  }

  const orderNumber = generateOrderNumber();
  const order = await Order.create({
    orderNumber,
    userId: req.user.userId,
    totalAmount: cart.totalPrice,
    shippingAddress,
    notes
  });

  const orderItems = [];
  for (const cartItem of cart.items) {
    const orderItem = await OrderItem.create({
      orderId: order.id,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      price: cartItem.price,
      productName: cartItem.Product.name,
      sku: cartItem.Product.sku
    });

    await Product.update(
      { stock: cartItem.Product.stock - cartItem.quantity },
      { where: { id: cartItem.productId } }
    );

    orderItems.push(orderItem);
  }

  await CartItem.destroy({ where: { cartId: cart.id } });
  await cart.update({ totalPrice: 0, totalItems: 0 });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Order created successfully',
    data: {
      ...order.toJSON(),
      items: orderItems
    }
  });
});

export const getOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const where = { userId: req.user.userId };
  if (status) where.status = status;

  const offset = (page - 1) * limit;

  const { count, rows } = await Order.findAndCountAll({
    where,
    include: [
      {
        association: 'items',
        include: [{ model: Product, attributes: ['id', 'name', 'image'] }]
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit),
    offset
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit)
    }
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findByPk(id, {
    include: [
      {
        association: 'items',
        include: [{ model: Product, attributes: ['id', 'name', 'image', 'sku'] }]
      },
      { model: User, attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] }
    ]
  });

  if (!order) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Order not found'
    });
  }

  if (order.userId !== req.user.userId) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Not authorized'
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: order
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!Object.values(ORDER_STATUS).includes(status)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Invalid order status'
    });
  }

  const order = await Order.findByPk(id);
  if (!order) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Order not found'
    });
  }

  await order.update({ status });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Order status updated',
    data: order
  });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findByPk(id);
  if (!order) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Order not found'
    });
  }

  if (order.userId !== req.user.userId) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Not authorized'
    });
  }

  if ([ORDER_STATUS.SHIPPED, ORDER_STATUS.DELIVERED].includes(order.status)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Cannot cancel order at this stage'
    });
  }

  const orderItems = await OrderItem.findAll({ where: { orderId: id } });
  for (const item of orderItems) {
    const product = await Product.findByPk(item.productId);
    await product.update({ stock: product.stock + item.quantity });
  }

  await order.update({ status: ORDER_STATUS.CANCELLED });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Order cancelled successfully'
  });
});
