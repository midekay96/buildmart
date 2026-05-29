/**
 * src/admin/adminData.js  —  MOCK DATA (development only)
 * ─────────────────────────────────────────────────────────────────────────────
 * When REACT_APP_API_URL is set, all of these are replaced by live API calls
 * in src/services/api.js.
 *
 * Backend endpoints:
 *   GET  /api/analytics/kpi            → kpiData
 *   GET  /api/orders                   → recentOrders
 *   GET  /api/analytics/activities     → activities
 *   GET  /api/analytics/top-categories → topCategories
 *   GET  /api/admin/notifications      → notifications
 *   GET  /api/transactions             → transactions
 *   GET  /api/suppliers                → suppliers
 *   GET  /api/products  (admin)        → products
 *   GET  /api/customers                → customers
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const kpiData = {
  revenue:  { value: '₦84.2M',  change: '+12%', sub: 'vs last month' },
  orders:   { value: '2,847',   change: '+8%',  sub: 'vs last month' },
  customers:{ value: '1,204',   change: '+5%',  sub: 'active users'  },
  avgOrder: { value: '₦29,570', change: '+2%',  sub: 'per order'     },
};

export const recentOrders = [
  { id: '#BM-10041', customer: 'Chukwuemeka Obi',      location: 'Lagos, Surulere',       items: 'Cement ×10, Sand ×3',  amount: '₦98,500',  method: 'Card',         status: 'Delivered',  date: 'May 7, 2026' },
  { id: '#BM-10040', customer: 'Aisha Bello',           location: 'Abuja, Wuse II',        items: 'Iron Rods ×20',        amount: '₦312,000', method: 'Bank Transfer', status: 'In Transit', date: 'May 7, 2026' },
  { id: '#BM-10039', customer: 'Taiwo Adeyemi',         location: 'Ibadan, Bodija',        items: 'Tiles ×150sqm',        amount: '₦187,500', method: 'USSD',          status: 'Processing', date: 'May 6, 2026' },
  { id: '#BM-10038', customer: 'Fatima Usman',          location: 'Kano, GRA',             items: 'Cement ×50',           amount: '₦490,000', method: 'Card',          status: 'Pending',    date: 'May 6, 2026' },
  { id: '#BM-10037', customer: 'Emeka Nwosu',           location: 'Enugu, Independence',   items: 'Granite ×5 tonnes',    amount: '₦225,000', method: 'BNPL',          status: 'Delivered',  date: 'May 5, 2026' },
  { id: '#BM-10036', customer: 'Ngozi Okonkwo',         location: 'Port Harcourt, GRA',    items: 'Roofing Sheets ×40',   amount: '₦640,000', method: 'Bank Transfer', status: 'Delivered',  date: 'May 5, 2026' },
  { id: '#BM-10035', customer: 'Bashir Lawal',          location: 'Kaduna, Sabon Gari',    items: 'Timber ×30 planks',    amount: '₦75,000',  method: 'Card',          status: 'In Transit', date: 'May 4, 2026' },
  { id: '#BM-10034', customer: 'Tunde Fashola',         location: 'Lagos, Victoria Island',items: 'Paint ×20 litres',     amount: '₦42,000',  method: 'Card',          status: 'Delivered',  date: 'May 4, 2026' },
];

export const activities = [
  { type: 'teal',  text: 'New order #BM-10041 placed by Chukwuemeka Obi',      time: '2 mins ago'  },
  { type: 'amber', text: 'Low stock alert: Dangote Cement 42.5 (48 bags left)', time: '11 mins ago' },
  { type: 'blue',  text: 'Supplier BUA Cement Co. submitted 12 new products',   time: '28 mins ago' },
  { type: 'teal',  text: 'Payment ₦312,000 settled to Iron Flex Ltd',           time: '45 mins ago' },
  { type: 'red',   text: 'Order #BM-10031 cancelled by customer',               time: '1 hr ago'    },
  { type: 'teal',  text: 'New customer registered: Ngozi Okonkwo',              time: '2 hrs ago'   },
];

export const topCategories = [
  { name: 'Cement',        pct: 100, color: '#1D9E75', revenue: '₦24.1M' },
  { name: 'Iron & Steel',  pct: 78,  color: '#378ADD', revenue: '₦18.6M' },
  { name: 'Granite/Stone', pct: 54,  color: '#EF9F27', revenue: '₦12.9M' },
  { name: 'Tiles',         pct: 40,  color: '#9D6EEF', revenue: '₦9.5M'  },
  { name: 'Roofing',       pct: 30,  color: '#E24B4A', revenue: '₦7.1M'  },
];

export const notifications = [
  { id: 1, type: 'amber', icon: '⚠️', title: 'Low Stock Alert',               sub: 'Dangote Cement 42.5 is critically low (48 bags). Reorder now.',          time: '5 mins ago'  },
  { id: 2, type: 'teal',  icon: '🛒', title: 'New Order Received',            sub: 'Order #BM-10041 placed for ₦98,500. Awaiting fulfilment.',                time: '8 mins ago'  },
  { id: 3, type: 'blue',  icon: '👤', title: 'New Supplier Pending Approval',  sub: 'SteelMax Ltd has submitted a supplier registration request.',             time: '22 mins ago' },
  { id: 4, type: 'teal',  icon: '💰', title: 'Payment Settled',               sub: '₦312,000 successfully settled to Iron Flex Ltd.',                         time: '44 mins ago' },
  { id: 5, type: 'red',   icon: '❌', title: 'Order Cancelled',               sub: 'Order #BM-10031 was cancelled by customer Emeka Nwosu.',                   time: '1 hr ago'    },
  { id: 6, type: 'blue',  icon: '📦', title: 'Shipment Dispatched',           sub: 'Order #BM-10040 dispatched from Lagos Apapa warehouse.',                   time: '2 hrs ago'   },
  { id: 7, type: 'teal',  icon: '⭐', title: 'New Review Posted',             sub: 'Aisha Bello left a 5-star review for BUA Cement Grade A.',                time: '3 hrs ago'   },
];

export const transactions = [
  { ref: 'TXN-2026-98421', customer: 'Chukwuemeka Obi',   method: 'Card (Visa)',       amount: '₦98,500',  fee: '₦1,478', status: 'Successful', date: 'May 7, 2026' },
  { ref: 'TXN-2026-98420', customer: 'Aisha Bello',       method: 'Bank Transfer',     amount: '₦312,000', fee: '₦4,680', status: 'Pending',    date: 'May 7, 2026' },
  { ref: 'TXN-2026-98419', customer: 'Taiwo Adeyemi',     method: 'USSD (*737#)',      amount: '₦187,500', fee: '₦2,813', status: 'Successful', date: 'May 6, 2026' },
  { ref: 'TXN-2026-98418', customer: 'Fatima Usman',      method: 'Card (Mastercard)', amount: '₦490,000', fee: '₦7,350', status: 'Successful', date: 'May 6, 2026' },
  { ref: 'TXN-2026-98417', customer: 'Emeka Nwosu',       method: 'BNPL (Carbon)',     amount: '₦225,000', fee: '₦3,375', status: 'Successful', date: 'May 5, 2026' },
  { ref: 'TXN-2026-98416', customer: 'Ngozi Okonkwo',     method: 'Bank Transfer',     amount: '₦640,000', fee: '₦9,600', status: 'Failed',     date: 'May 5, 2026' },
  { ref: 'TXN-2026-98415', customer: 'Bashir Lawal',      method: 'Card (Verve)',      amount: '₦75,000',  fee: '₦1,125', status: 'Successful', date: 'May 4, 2026' },
  { ref: 'TXN-2026-98414', customer: 'Tunde Fashola',     method: 'Card (Visa)',       amount: '₦42,000',  fee: '₦630',   status: 'Successful', date: 'May 4, 2026' },
];

export const suppliers = [
  { id: 1, name: 'Dangote Industries', cat: 'Cement',       location: 'Lagos, Apapa',           products: 12, sales: '₦24.1M', rating: 4.9, status: 'Active'  },
  { id: 2, name: 'Iron Flex Ltd',      cat: 'Iron & Steel', location: 'Lagos, Ikeja',            products: 8,  sales: '₦18.6M', rating: 4.7, status: 'Active'  },
  { id: 3, name: 'BUA Cement Co.',     cat: 'Cement',       location: 'Abuja, Wuse',             products: 6,  sales: '₦11.2M', rating: 4.8, status: 'Active'  },
  { id: 4, name: 'RomaTile Ceramics',  cat: 'Tiles',        location: 'Lagos, Victoria Island',  products: 24, sales: '₦9.5M',  rating: 4.6, status: 'Active'  },
  { id: 5, name: 'TimberKing Ltd',     cat: 'Timber',       location: 'Benin City, GRA',         products: 10, sales: '₦4.3M',  rating: 4.4, status: 'Active'  },
  { id: 6, name: 'MetalCo Roofing',   cat: 'Roofing',      location: 'Port Harcourt',           products: 7,  sales: '₦7.1M',  rating: 4.5, status: 'Active'  },
  { id: 7, name: 'SteelMax Ltd',       cat: 'Iron & Steel', location: 'Kano, GRA',              products: 0,  sales: '—',      rating: '—', status: 'Pending' },
  { id: 8, name: 'GranitePro Nigeria', cat: 'Granite',      location: 'Abuja, Lugbe',            products: 0,  sales: '—',      rating: '—', status: 'Pending' },
];

export const products = [
  { id: 1,  name: 'Dangote Cement 42.5',    cat: 'Cement',       price: '₦9,800',  unit: 'per bag',   stock: 48,   stockMax: 500,  icon: '🏗', color: '#1D2D3A', sales: 284, status: 'Low Stock' },
  { id: 2,  name: 'BUA Cement Grade A',     cat: 'Cement',       price: '₦9,500',  unit: 'per bag',   stock: 312,  stockMax: 500,  icon: '🏗', color: '#1D2D3A', sales: 197, status: 'Active'    },
  { id: 3,  name: 'Sharp Sand (1 ton)',      cat: 'Sand',         price: '₦28,000', unit: 'per tonne', stock: 84,   stockMax: 200,  icon: '⛱', color: '#2D2415', sales: 132, status: 'Active'    },
  { id: 4,  name: 'Granite 3/4" Chippings', cat: 'Granite',      price: '₦45,000', unit: 'per tonne', stock: 15,   stockMax: 100,  icon: '💎', color: '#1A2030', sales: 89,  status: 'Low Stock' },
  { id: 5,  name: '9-Inch Sandcrete Block', cat: 'Blocks',       price: '₦850',    unit: 'per block', stock: 2400, stockMax: 5000, icon: '🧱', color: '#2D1A10', sales: 561, status: 'Active'    },
  { id: 6,  name: 'Y16 Iron Rods (12m)',    cat: 'Iron & Steel', price: '₦15,600', unit: 'per rod',   stock: 210,  stockMax: 400,  icon: '⚙️', color: '#1A1F2D', sales: 340, status: 'Active'    },
  { id: 7,  name: 'Ceramic Floor Tiles',    cat: 'Tiles',        price: '₦1,250',  unit: 'per sqm',   stock: 880,  stockMax: 2000, icon: '🔲', color: '#1D2030', sales: 210, status: 'Active'    },
  { id: 8,  name: 'Hardwood Plank (2")',    cat: 'Timber',       price: '₦2,500',  unit: 'per plank', stock: 120,  stockMax: 300,  icon: '🪵', color: '#2D1800', sales: 98,  status: 'Active'    },
  { id: 9,  name: 'Aluminium Roofing Sheet',cat: 'Roofing',      price: '₦16,000', unit: 'per sheet', stock: 56,   stockMax: 200,  icon: '🏠', color: '#1F2030', sales: 145, status: 'Active'    },
  { id: 10, name: 'Emulsion Paint (20L)',   cat: 'Paint',        price: '₦21,000', unit: 'per bucket',stock: 74,   stockMax: 150,  icon: '🎨', color: '#1D201A', sales: 67,  status: 'Active'    },
];

export const customers = [
  { id: 1, name: 'Chukwuemeka Obi',  email: 'c.obi@email.com',     phone: '+234 803 111 2233', location: 'Lagos',         orders: 14, totalSpent: '₦1.2M', status: 'active',   isNew: false, joined: 'Jan 2025' },
  { id: 2, name: 'Aisha Bello',      email: 'a.bello@email.com',   phone: '+234 812 445 6677', location: 'Abuja',         orders: 9,  totalSpent: '₦890K', status: 'active',   isNew: false, joined: 'Mar 2025' },
  { id: 3, name: 'Taiwo Adeyemi',    email: 't.ade@email.com',     phone: '+234 708 223 4455', location: 'Ibadan',        orders: 6,  totalSpent: '₦540K', status: 'active',   isNew: false, joined: 'Feb 2025' },
  { id: 4, name: 'Fatima Usman',     email: 'f.usman@email.com',   phone: '+234 816 334 5566', location: 'Kano',          orders: 21, totalSpent: '₦2.8M', status: 'active',   isNew: false, joined: 'Nov 2024' },
  { id: 5, name: 'Emeka Nwosu',      email: 'e.nwosu@email.com',   phone: '+234 903 556 7788', location: 'Enugu',         orders: 4,  totalSpent: '₦320K', status: 'active',   isNew: true,  joined: 'Apr 2025' },
  { id: 6, name: 'Ngozi Okonkwo',    email: 'n.okonkwo@email.com', phone: '+234 814 667 8899', location: 'Port Harcourt', orders: 18, totalSpent: '₦1.9M', status: 'active',   isNew: false, joined: 'Dec 2024' },
  { id: 7, name: 'Bashir Lawal',     email: 'b.lawal@email.com',   phone: '+234 706 778 9900', location: 'Kaduna',        orders: 3,  totalSpent: '₦175K', status: 'inactive', isNew: false, joined: 'May 2025' },
  { id: 8, name: 'Tunde Fashola',    email: 't.fashola@email.com', phone: '+234 805 889 0011', location: 'Lagos',         orders: 7,  totalSpent: '₦620K', status: 'active',   isNew: true,  joined: 'Jan 2025' },
];
