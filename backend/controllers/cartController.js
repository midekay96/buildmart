import { Cart, CartItem, Product } from '../models/index.js';
import { HTTP_STATUS } from '../config/constants.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({
    where: { userId: req.user.userId },
    include: [
      {
        association: 'items',
        include: [{ model: Product, attributes: ['id', 'name', 'image', 'sku'] }]
      }
    ]
  });

  if (!cart) {
    cart = await Cart.create({ userId: req.user.userId });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: cart
  });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Product ID and valid quantity are required'
    });
  }

  const product = await Product.findByPk(productId);
  if (!product) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Product not found'
    });
  }

  if (product.stock < quantity) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Insufficient stock'
    });
  }

  let cart = await Cart.findOne({ where: { userId: req.user.userId } });
  if (!cart) {
    cart = await Cart.create({ userId: req.user.userId });
  }

  let cartItem = await CartItem.findOne({
    where: { cartId: cart.id, productId }
  });

  if (cartItem) {
    await cartItem.update({ quantity: cartItem.quantity + quantity });
  } else {
    cartItem = await CartItem.create({
      cartId: cart.id,
      productId,
      quantity,
      price: product.discountPrice || product.price
    });
  }

  await updateCartTotals(cart.id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Product added to cart',
    data: cartItem
  });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Valid quantity is required'
    });
  }

  const cartItem = await CartItem.findByPk(cartItemId, {
    include: [{ model: Cart }]
  });

  if (!cartItem) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Cart item not found'
    });
  }

  if (cartItem.Cart.userId !== req.user.userId) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Not authorized'
    });
  }

  if (quantity === 0) {
    await cartItem.destroy();
  } else {
    await cartItem.update({ quantity });
  }

  await updateCartTotals(cartItem.cartId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Cart updated successfully'
  });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { cartItemId } = req.params;

  const cartItem = await CartItem.findByPk(cartItemId, {
    include: [{ model: Cart }]
  });

  if (!cartItem) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Cart item not found'
    });
  }

  if (cartItem.Cart.userId !== req.user.userId) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Not authorized'
    });
  }

  const cartId = cartItem.cartId;
  await cartItem.destroy();
  await updateCartTotals(cartId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Item removed from cart'
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ where: { userId: req.user.userId } });

  if (!cart) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Cart not found'
    });
  }

  await CartItem.destroy({ where: { cartId: cart.id } });
  await cart.update({ totalPrice: 0, totalItems: 0 });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Cart cleared successfully'
  });
});

const updateCartTotals = async (cartId) => {
  const cartItems = await CartItem.findAll({ where: { cartId } });

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  await Cart.update(
    { totalPrice, totalItems },
    { where: { id: cartId } }
  );
};
