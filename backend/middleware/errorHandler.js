import { HTTP_STATUS } from '../config/constants.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Validation error',
      errors: err.errors
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message: 'Duplicate entry',
      field: err.errors[0].path
    });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Validation error',
      errors: err.errors.map(e => ({ field: e.path, message: e.message }))
    });
  }

  return res.status(err.statusCode || HTTP_STATUS.INTERNAL_ERROR).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
