import { User } from '../models/index.js';
import { generateToken } from '../utils/jwt.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { HTTP_STATUS } from '../config/constants.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message: 'Email already registered'
    });
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone
  });

  const token = generateToken(user.id, user.role);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'User registered successfully',
    data: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    },
    token
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  await user.update({ lastLogin: new Date() });

  const token = generateToken(user.id, user.role);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Login successful',
    data: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    },
    token
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.userId, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: user
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, address, city, state, zipCode } = req.body;

  const user = await User.findByPk(req.user.userId);
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'User not found'
    });
  }

  await user.update({
    firstName: firstName || user.firstName,
    lastName: lastName || user.lastName,
    phone: phone || user.phone,
    address: address || user.address,
    city: city || user.city,
    state: state || user.state,
    zipCode: zipCode || user.zipCode
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});
