export const kpiData = {
  revenue:     { value: '₦84.2M', change: '+18.4%', sub: '₦71.1M last month', up: true },
  orders:      { value: '2,847',  change: '+12.1%', sub: '2,539 last month',   up: true },
  customers:   { value: '9,341',  change: '+7.3%',  sub: '410 new this month', up: true },
  avgOrder:    { value: '₦29.6K', change: '-2.1%',  sub: '₦30.2K last month', up: false },
};

export const recentOrders = [
  { id: '#BM-2935', customer: 'Emeka Obi',      location: 'Lagos', items: 'Sharp Sand ×2, Cement ×30 bags', amount: '₦254,000',   method: 'Card',     status: 'Processing', date: 'May 5' },
  { id: '#BM-2934', customer: 'Fatima Bello',   location: 'Abuja', items: 'Granite 3/4" ×3 loads',          amount: '₦285,000',   method: 'Transfer', status: 'In Transit', date: 'May 4' },
  { id: '#BM-2933', customer: 'Chidi Eze',       location: 'PH',    items: 'Iron Rod Y16 ×2T',               amount: '₦259,500',   method: 'USSD',     status: 'In Transit', date: 'May 4' },
  { id: '#BM-2932', customer: 'Aisha Musa',      location: 'Lagos', items: 'Porcelain Tiles 200m²',          amount: '₦1,440,000', method: 'Card',     status: 'Delivered',  date: 'May 3' },
  { id: '#BM-2931', customer: 'Tunde Adeyemi',   location: 'Ogun',  items: 'River Sand ×1, Plaster Sand ×1', amount: '₦150,000',   method: 'BNPL',     status: 'Delivered',  date: 'May 3' },
  { id: '#BM-2930', customer: 'Ngozi Nwosu',     location: 'Enugu', items: '9" Blocks ×500, Cement ×20',     amount: '₦571,000',   method: 'Transfer', status: 'Pending',    date: 'May 3' },
  { id: '#BM-2929', customer: 'Ibrahim Sule',    location: 'Kano',  items: 'Roofing Sheet ×120',             amount: '₦504,000',   method: 'Card',     status: 'Processing', date: 'May 2' },
];

export const products = [
  { name: 'Dangote Cement 42.5',  cat: 'Cement',   price: '₦9,800/bag',   stock: 1240, stockMax: 1500, unit: 'bags',   sales: '3,400 bags',   status: 'Active',    icon: '🏗', color: '#E1F5EE' },
  { name: 'Sharp Sand (Coarse)',   cat: 'Sand',     price: '₦78,000/load', stock: 12,   stockMax: 100,  unit: 'loads',  sales: '284 loads',    status: 'Low Stock', icon: '🪨', color: '#F5F0E8' },
  { name: 'Granite 3/4" (19mm)',   cat: 'Granite',  price: '₦95,000/load', stock: 68,   stockMax: 120,  unit: 'loads',  sales: '192 loads',    status: 'Active',    icon: '🪨', color: '#ECEAE6' },
  { name: 'Iron Rod Y12 (12mm)',   cat: 'Iron',     price: '₦94,000/T',    stock: 4,    stockMax: 60,   unit: 'tonnes', sales: '145 tonnes',   status: 'Low Stock', icon: '⚙️', color: '#EAF3DE' },
  { name: '9" Sandcrete Block',    cat: 'Blocks',   price: '₦750/block',   stock: 8400, stockMax: 12000,unit: 'pcs',    sales: '22,000 pcs',   status: 'Active',    icon: '🧱', color: '#F0EBE1' },
  { name: 'BUA Cement OPC 32.5',   cat: 'Cement',   price: '₦8,600/bag',   stock: 48,   stockMax: 600,  unit: 'bags',   sales: '2,800 bags',   status: 'Low Stock', icon: '🏗', color: '#E1F5EE' },
];

export const suppliers = [
  { name: 'Dangote Industries', cat: 'Cement',        location: 'Nationwide', products: 12, sales: '₦28.6M', rating: '4.9', status: 'Verified' },
  { name: 'Iron Flex Ltd',      cat: 'Iron & Steel',  location: 'Lagos, Abuja',products: 8, sales: '₦14.2M', rating: '4.7', status: 'Verified' },
  { name: 'GraniteCo',          cat: 'Granite',       location: 'Ogun State', products: 5,  sales: '₦8.9M',  rating: '4.6', status: 'Verified' },
  { name: 'SandMart',           cat: 'Sand',          location: 'Lagos',      products: 5,  sales: '₦6.2M',  rating: '4.5', status: 'Verified' },
  { name: 'QuarryCo Ltd',       cat: 'Granite, Stone',location: 'Ogun State', products: 3,  sales: '—',      rating: '—',   status: 'Pending' },
  { name: 'BlockPro Nigeria',   cat: 'Blocks',        location: 'Lagos',      products: 3,  sales: '₦4.4M',  rating: '4.4', status: 'Pending' },
];

export const customers = [
  { name: 'Emeka Obi',       email: 'emeka@obi.ng',      location: 'Lagos', orders: 24, spent: '₦6.2M',  lastOrder: 'May 5, 2026', status: 'Active' },
  { name: 'Fatima Bello',    email: 'f.bello@mail.com',  location: 'Abuja', orders: 18, spent: '₦4.8M',  lastOrder: 'May 4, 2026', status: 'Active' },
  { name: 'Ngozi Nwosu',     email: 'ngozi.n@gmail.com', location: 'Enugu', orders: 11, spent: '₦2.1M',  lastOrder: 'May 3, 2026', status: 'Active' },
  { name: 'Ibrahim Sule',    email: 'i.sule@kano.com',   location: 'Kano',  orders: 7,  spent: '₦1.4M',  lastOrder: 'May 2, 2026', status: 'Active' },
  { name: 'Tunde Adeyemi',   email: 'tunde.a@gmail.com', location: 'Ogun',  orders: 5,  spent: '₦890K',  lastOrder: 'May 3, 2026', status: 'Active' },
];

export const transactions = [
  { ref: 'PAY-8834721', customer: 'Emeka Obi',    method: '💳 Card',     amount: '₦254,000',   fee: '₦3,810',  status: 'Success',  date: 'May 5, 09:14' },
  { ref: 'PAY-8834698', customer: 'Fatima Bello', method: '🏦 Transfer', amount: '₦285,000',   fee: '₦4,275',  status: 'Success',  date: 'May 4, 16:22' },
  { ref: 'PAY-8834651', customer: 'Chidi Eze',    method: '📱 USSD',     amount: '₦259,500',   fee: '₦3,893',  status: 'Success',  date: 'May 4, 11:05' },
  { ref: 'PAY-8834580', customer: 'Ngozi Nwosu',  method: '📅 BNPL',     amount: '₦571,000',   fee: '₦8,565',  status: 'Pending',  date: 'May 3, 14:40' },
  { ref: 'PAY-8834412', customer: 'Tunde Adeyemi',method: '🏦 Transfer', amount: '₦150,000',   fee: '₦2,250',  status: 'Success',  date: 'May 3, 10:18' },
  { ref: 'PAY-8834309', customer: 'Ibrahim Sule', method: '💳 Card',     amount: '₦504,000',   fee: '₦7,560',  status: 'Disputed', date: 'May 2, 08:55' },
];

export const activities = [
  { type: 'teal',  text: 'New supplier QuarryCo Ltd submitted for verification',          time: '12 min ago' },
  { type: 'amber', text: 'Stock alert: BUA Cement OPC below reorder level (48 bags)',     time: '34 min ago' },
  { type: 'blue',  text: 'Order #BM-2935 assigned to rider — Femi Adesanya',              time: '1 hr ago'   },
  { type: 'red',   text: 'Payment dispute raised on order #BM-2919 — awaiting review',   time: '2 hr ago'   },
  { type: 'teal',  text: '₦4.2M settlement processed to Iron Flex Ltd',                   time: '3 hr ago'   },
];

export const topCategories = [
  { name: 'Cement & Concrete', revenue: '₦28.6M', pct: 85, color: '#1D9E75' },
  { name: 'Iron & Steel',      revenue: '₦23.5M', pct: 70, color: '#378ADD' },
  { name: 'Sand & Aggregates', revenue: '₦11.8M', pct: 42, color: '#EF9F27' },
  { name: 'Granite & Stone',   revenue: '₦10.9M', pct: 37, color: '#7F77DD' },
  { name: 'Tiles & Flooring',  revenue: '₦9.4M',  pct: 28, color: '#639922' },
];

export const notifications = [
  { icon: '⚠', type: 'amber', title: 'Low stock alert — Iron Rod Y12',          sub: 'Only 4 tonnes remaining. Reorder level is 20 tonnes.',                         time: '12m ago' },
  { icon: '✓', type: 'teal',  title: 'New supplier application — QuarryCo Ltd', sub: 'Submitted documents for verification. Review required.',                        time: '34m ago' },
  { icon: '!', type: 'red',   title: 'Payment dispute — Order #BM-2919',         sub: 'Customer claims order not delivered. Rider GPS shows delivered.',               time: '2h ago'  },
  { icon: '⚠', type: 'amber', title: 'Low stock alert — BUA Cement OPC',         sub: '48 bags remaining. Reorder level is 200 bags.',                                time: '3h ago'  },
  { icon: '◎', type: 'blue',  title: 'New supplier application — BlockPro Nigeria', sub: 'Awaiting document review and verification call.',                            time: '5h ago'  },
];