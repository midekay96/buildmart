import { verifyToken } from '../utils/jwt.js';

/**
 * Middleware: validate admin JWT.
 * Frontend sends: Authorization: Bearer <token>
 */
export const requireAdmin = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Admin token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Invalid or expired admin token' });
  }

  req.admin = decoded;
  next();
};
