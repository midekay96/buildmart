export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};

export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SUPPLIER: 'supplier'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const PRODUCT_CATEGORIES = [
  'cement',
  'bricks',
  'steel',
  'wood',
  'glass',
  'plumbing',
  'electrical',
  'paint',
  'tiles',
  'tools'
];
