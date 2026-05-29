import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile
} from '../controllers/authController.js';
import { validateRegister, validateLogin, handleValidationErrors } from '../validators/authValidator.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

export default router;
