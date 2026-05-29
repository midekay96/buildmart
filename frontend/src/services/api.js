/**
 * BuildMart API Service
 * All backend calls go through this file.
 *
 * ENVIRONMENT VARIABLES (.env.local for dev, .env.production for prod):
 *   REACT_APP_API_URL        → deployed backend base URL (e.g. https://api.buildmart.ng)
 *   REACT_APP_ADMIN_USER     → dev-only admin username (never commit)
 *   REACT_APP_ADMIN_PASS     → dev-only admin password (never commit)
 */

const BASE   = process.env.REACT_APP_API_URL || '';
const IS_LIVE = Boolean(BASE);

async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token   = sessionStorage.getItem('bm_admin_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function adminLogin(username, password) {
  if (IS_LIVE) {
    const data = await apiFetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (data.token) sessionStorage.setItem('bm_admin_token', data.token);
    return data;
  }
  const devUser = process.env.REACT_APP_ADMIN_USER;
  const devPass = process.env.REACT_APP_ADMIN_PASS;
  if (!devUser || !devPass) {
    throw new Error('Server not configured. Restart npm start after editing .env.local, then try again.');
  }
  if (username === devUser && password === devPass) {
    return { success: true, user: { name: 'Admin', role: 'superadmin' } };
  }
  throw new Error('Invalid credentials');
}

export function adminLogout() {
  sessionStorage.removeItem('bm_admin_token');
  sessionStorage.removeItem('bm_admin_auth');
}

// ── Products ──────────────────────────────────────────────────────────────────
export async function getProducts() {
  if (IS_LIVE) return apiFetch('/api/products');
  const { products } = await import('../data/products');
  return products;
}

// ── Orders ────────────────────────────────────────────────────────────────────
export async function getOrders() {
  if (IS_LIVE) return apiFetch('/api/orders');
  const { recentOrders } = await import('../admin/adminData');
  return recentOrders;
}

export async function getMyOrders() {
  if (IS_LIVE) return apiFetch('/api/orders/my');
  const { sampleOrders } = await import('../data/products');
  return sampleOrders;
}

// ── Customers ─────────────────────────────────────────────────────────────────
export async function getCustomers() {
  if (IS_LIVE) return apiFetch('/api/customers');
  const { customers } = await import('../admin/adminData');
  return customers;
}

// ── Suppliers (admin-managed only) ───────────────────────────────────────────
export async function getSuppliers() {
  if (IS_LIVE) return apiFetch('/api/suppliers');
  const { suppliers } = await import('../admin/adminData');
  return suppliers;
}

export async function approveSupplier(id) {
  if (IS_LIVE) return apiFetch(`/api/suppliers/${id}/approve`, { method: 'PATCH' });
  console.warn('[mock] approveSupplier', id);
  return { success: true };
}

// ── Payments ──────────────────────────────────────────────────────────────────
export async function getTransactions() {
  if (IS_LIVE) return apiFetch('/api/transactions');
  const { transactions } = await import('../admin/adminData');
  return transactions;
}

export async function initiatePayment({ amount, email, orderId, metadata }) {
  if (IS_LIVE) {
    return apiFetch('/api/payments/initiate', {
      method: 'POST',
      body: JSON.stringify({ amount, email, orderId, metadata }),
    });
  }
  return new Promise(resolve =>
    setTimeout(() => resolve({ success: true, reference: `BM-${Date.now()}` }), 2000)
  );
}

// ── Support (owner handles all supplier contact) ──────────────────────────────
export async function submitSupportRequest({ orderId, subject, message, customerName, customerEmail }) {
  if (IS_LIVE) {
    return apiFetch('/api/support/contact', {
      method: 'POST',
      body: JSON.stringify({ orderId, subject, message, customerName, customerEmail }),
    });
  }
  return { success: true, ticketId: `TKT-${Date.now().toString().slice(-6)}` };
}

// ── Analytics ─────────────────────────────────────────────────────────────────
export async function getKpiData() {
  if (IS_LIVE) return apiFetch('/api/analytics/kpi');
  const { kpiData } = await import('../admin/adminData');
  return kpiData;
}
