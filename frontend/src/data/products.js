// ── Product catalogue ──────────────────────────────────────────────────────────
// NOTE: images use Unsplash CDN. The icon field is the fallback if the image fails.
export const products = [
  // ── Cement ──────────────────────────────────────────────────────────────────
  { id: 1,  name: 'Dangote Cement 42.5',       brand: 'Dangote',    cat: 'Cement',  supplier: 'Dangote Industries',
    price: 9800,  unit: 'per bag (50kg)',  icon: '🏗', badge: 'hot',  color: '#E1F5EE', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1590664863685-a99ef05e9f61?w=400&h=280&fit=crop&q=80' },

  { id: 2,  name: 'BUA Cement OPC 32.5',        brand: 'BUA',        cat: 'Cement',  supplier: 'BUA Cement Co.',
    price: 8600,  unit: 'per bag (50kg)',  icon: '🏗', badge: 'sale', color: '#E1F5EE', oldPrice: 9500,
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=280&fit=crop&q=80' },

  { id: 3,  name: 'Lafarge Supaset Cement',      brand: 'Lafarge',    cat: 'Cement',  supplier: 'Lafarge Holcim',
    price: 10200, unit: 'per bag (50kg)',  icon: '🏗', badge: 'new',  color: '#E1F5EE', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&h=280&fit=crop&q=80' },

  // ── Sand & Aggregates ────────────────────────────────────────────────────────
  { id: 13, name: 'Sharp Sand (Coarse)',         brand: 'SandMart',   cat: 'Sand',    supplier: 'SandMart Aggregates',
    price: 78000, unit: 'per tipper load', icon: '🪨', badge: 'hot',  color: '#F5F0E8', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=280&fit=crop&q=80' },

  { id: 14, name: 'Plaster Sand (Fine)',         brand: 'SandMart',   cat: 'Sand',    supplier: 'SandMart Aggregates',
    price: 65000, unit: 'per tipper load', icon: '🟤', badge: null,   color: '#F5F0E8', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1551523713-1a4a7f4f8e3b?w=400&h=280&fit=crop&q=80' },

  { id: 15, name: 'River Sand (Washed)',         brand: 'RiverCo',    cat: 'Sand',    supplier: 'RiverCo Aggregates',
    price: 85000, unit: 'per tipper load', icon: '🪨', badge: 'new',  color: '#F5F0E8', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=400&h=280&fit=crop&q=80' },

  { id: 16, name: 'Pit Sand (Red Sand)',         brand: 'PitSands',   cat: 'Sand',    supplier: 'PitSands Ltd',
    price: 55000, unit: 'per tipper load', icon: '🔴', badge: null,   color: '#F5F0E8', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=280&fit=crop&q=80' },

  { id: 17, name: 'White Sand (Plastering)',     brand: 'SandMart',   cat: 'Sand',    supplier: 'SandMart Aggregates',
    price: 72000, unit: 'per tipper load', icon: '⬜', badge: null,   color: '#F5F0E8', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=280&fit=crop&q=80' },

  // ── Granite & Gravel ─────────────────────────────────────────────────────────
  { id: 18, name: 'Granite 3/4" (19mm)',         brand: 'GraniteCo',  cat: 'Granite', supplier: 'GraniteCo Ltd',
    price: 95000, unit: 'per tipper load', icon: '🪨', badge: 'hot',  color: '#ECEAE6', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=280&fit=crop&q=80' },

  { id: 19, name: 'Granite 1/2" (12.5mm)',       brand: 'GraniteCo',  cat: 'Granite', supplier: 'GraniteCo Ltd',
    price: 88000, unit: 'per tipper load', icon: '🪨', badge: null,   color: '#ECEAE6', oldPrice: 95000,
    img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=280&fit=crop&q=80' },

  { id: 20, name: 'Granite Dust / Quarry Fines', brand: 'QuarryCo',   cat: 'Granite', supplier: 'QuarryCo Nigeria',
    price: 42000, unit: 'per tipper load', icon: '🌫️',badge: 'sale', color: '#ECEAE6', oldPrice: 50000,
    img: 'https://images.unsplash.com/photo-1565975591706-f68f8befd56b?w=400&h=280&fit=crop&q=80' },

  { id: 21, name: 'Pea Gravel (Drainage)',        brand: 'RiverCo',    cat: 'Granite', supplier: 'RiverCo Aggregates',
    price: 60000, unit: 'per tipper load', icon: '🪨', badge: null,   color: '#ECEAE6', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=400&h=280&fit=crop&q=80' },

  { id: 22, name: 'Crushed Stone (Hardcore)',     brand: 'QuarryCo',   cat: 'Granite', supplier: 'QuarryCo Nigeria',
    price: 70000, unit: 'per tipper load', icon: '💎', badge: 'new',  color: '#ECEAE6', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=280&fit=crop&q=80' },

  // ── Blocks ───────────────────────────────────────────────────────────────────
  { id: 23, name: '9" Sandcrete Block (Solid)',  brand: 'BlockPro',   cat: 'Blocks',  supplier: 'BlockPro Industries',
    price: 750,   unit: 'per block',       icon: '🧱', badge: 'hot',  color: '#F0EBE1', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=280&fit=crop&q=80' },

  { id: 24, name: '6" Sandcrete Block (Hollow)', brand: 'BlockPro',   cat: 'Blocks',  supplier: 'BlockPro Industries',
    price: 550,   unit: 'per block',       icon: '🧱', badge: null,   color: '#F0EBE1', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1530041539828-114de669390e?w=400&h=280&fit=crop&q=80' },

  { id: 25, name: 'Paving Block (Interlocking)',  brand: 'PaveCo',     cat: 'Blocks',  supplier: 'PaveCo Nigeria',
    price: 1200,  unit: 'per m²',          icon: '🔷', badge: 'new',  color: '#F0EBE1', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&h=280&fit=crop&q=80' },

  // ── Iron & Steel ─────────────────────────────────────────────────────────────
  { id: 4,  name: 'Iron Rod Y12 (12mm)',         brand: 'Iron Flex',  cat: 'Iron',    supplier: 'Iron Flex Ltd',
    price: 94000, unit: 'per tonne',       icon: '⚙️',badge: null,   color: '#EAF3DE', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1504704911898-68304a7d2807?w=400&h=280&fit=crop&q=80' },

  { id: 5,  name: 'Iron Rod Y16 (16mm)',         brand: 'Iron Flex',  cat: 'Iron',    supplier: 'Iron Flex Ltd',
    price: 98500, unit: 'per tonne',       icon: '⚙️',badge: 'hot',  color: '#EAF3DE', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1590503680237-3d8aed6f4c44?w=400&h=280&fit=crop&q=80' },

  { id: 6,  name: 'Binding Wire 25kg',           brand: 'SteelCo',    cat: 'Iron',    supplier: 'SteelCo Nigeria',
    price: 12500, unit: 'per roll',        icon: '🔧', badge: null,   color: '#EAF3DE', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=400&h=280&fit=crop&q=80' },

  // ── Tiles ────────────────────────────────────────────────────────────────────
  { id: 7,  name: 'Ceramic Wall Tile 30x30',     brand: 'RomaTile',   cat: 'Tiles',   supplier: 'RomaTile Ceramics',
    price: 3800,  unit: 'per m²',          icon: '🪟', badge: 'sale', color: '#E6F1FB', oldPrice: 4500,
    img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=280&fit=crop&q=80' },

  { id: 8,  name: 'Porcelain Floor Tile 60x60',  brand: 'RomaTile',   cat: 'Tiles',   supplier: 'RomaTile Ceramics',
    price: 7200,  unit: 'per m²',          icon: '🪟', badge: 'new',  color: '#E6F1FB', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1619211047834-2f1fe83c1f8f?w=400&h=280&fit=crop&q=80' },

  // ── Timber ───────────────────────────────────────────────────────────────────
  { id: 9,  name: 'Hardwood Plank (3m)',         brand: 'TimberKing', cat: 'Timber',  supplier: 'TimberKing Ltd',
    price: 8500,  unit: 'per piece',       icon: '🪵', badge: null,   color: '#FAEEDA', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=400&h=280&fit=crop&q=80' },

  // ── Roofing ──────────────────────────────────────────────────────────────────
  { id: 10, name: 'Roofing Sheet (0.55mm)',       brand: 'MetalCo',    cat: 'Roofing', supplier: 'MetalCo Roofing',
    price: 4200,  unit: 'per sheet',       icon: '🏠', badge: 'hot',  color: '#FAECE7', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1587329310686-91f574d7a0c6?w=400&h=280&fit=crop&q=80' },

  { id: 11, name: 'Stone Coated Roof (per m²)',   brand: 'Gerard',     cat: 'Roofing', supplier: 'Gerard Roofing',
    price: 12000, unit: 'per m²',          icon: '🏠', badge: 'new',  color: '#FAECE7', oldPrice: null,
    img: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400&h=280&fit=crop&q=80' },

  // ── Paint ────────────────────────────────────────────────────────────────────
  { id: 12, name: 'Dulux Weathershield 20L',      brand: 'Dulux',      cat: 'Paint',   supplier: 'Dulux Nigeria',
    price: 58000, unit: 'per bucket',      icon: '🎨', badge: 'sale', color: '#FBEAF0', oldPrice: 64000,
    img: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=280&fit=crop&q=80' },
];

// ── Verified Suppliers (one per major brand/category) ─────────────────────────
export const suppliers = [
  { name: 'Dangote Industries',  loc: 'Nationwide',      rating: '4.9', orders: '12K+', icon: '🏭', cat: 'Cement & Concrete'  },
  { name: 'BUA Cement Co.',      loc: 'Nationwide',      rating: '4.8', orders: '9K+',  icon: '🏗', cat: 'Cement'             },
  { name: 'Lafarge Holcim',      loc: 'Nationwide',      rating: '4.7', orders: '7K+',  icon: '🏗', cat: 'Cement'             },
  { name: 'Iron Flex Ltd',       loc: 'Lagos, Abuja',    rating: '4.7', orders: '5K+',  icon: '⚙️', cat: 'Iron & Steel'       },
  { name: 'SteelCo Nigeria',     loc: 'Lagos',           rating: '4.5', orders: '2.5K+',icon: '🔧', cat: 'Iron & Steel'       },
  { name: 'RomaTile Ceramics',   loc: 'Lagos',           rating: '4.8', orders: '3.2K+',icon: '🪟', cat: 'Tiles & Flooring'   },
  { name: 'TimberKing Ltd',      loc: 'Ibadan, PH',      rating: '4.6', orders: '2K+',  icon: '🪵', cat: 'Timber & Wood'      },
  { name: 'MetalCo Roofing',     loc: 'Lagos',           rating: '4.5', orders: '4.1K+',icon: '🏠', cat: 'Roofing'            },
  { name: 'Gerard Roofing',      loc: 'Lagos, Abuja',    rating: '4.8', orders: '2.9K+',icon: '🏠', cat: 'Roofing'            },
  { name: 'BlockPro Industries', loc: 'Lagos, Abuja',    rating: '4.6', orders: '5K+',  icon: '🧱', cat: 'Blocks & Masonry'   },
  { name: 'PaveCo Nigeria',      loc: 'Lagos',           rating: '4.4', orders: '1.8K+',icon: '🔷', cat: 'Blocks & Paving'    },
  { name: 'SandMart Aggregates', loc: 'Lagos, Ibadan',   rating: '4.5', orders: '3.5K+',icon: '🪨', cat: 'Sand & Aggregates'  },
  { name: 'RiverCo Aggregates',  loc: 'Delta, Rivers',   rating: '4.6', orders: '2.8K+',icon: '🌊', cat: 'Sand & Aggregates'  },
  { name: 'PitSands Ltd',        loc: 'Edo, Anambra',    rating: '4.3', orders: '1.5K+',icon: '🔴', cat: 'Sand & Aggregates'  },
  { name: 'GraniteCo Ltd',       loc: 'Ogun, Oyo',       rating: '4.7', orders: '4K+',  icon: '💎', cat: 'Granite & Stone'    },
  { name: 'QuarryCo Nigeria',    loc: 'Abuja, Kogi',     rating: '4.5', orders: '3.2K+',icon: '⛏️', cat: 'Granite & Stone'    },
  { name: 'Dulux Nigeria',       loc: 'Lagos',           rating: '4.9', orders: '6K+',  icon: '🎨', cat: 'Paint & Finishes'   },
];

// ── Sample orders (rich tracking data) ────────────────────────────────────────
export const sampleOrders = [
  {
    id: '#BM-2847', date: 'Apr 28, 2026', status: 'Delivered', stage: 6,
    deliveryType: 'Standard Delivery', deliveryFee: '₦5,000',
    eta: 'Delivered on Apr 30, 2026', address: '12 Bode Thomas Street, Surulere, Lagos',
    items: [
      { name: 'Dangote Cement 42.5',  qty: 40, price: 9800  },
      { name: 'Iron Rod Y12 (12mm)',  qty: 1,  price: 94000 },
    ],
    total: '₦439,000',
    timeline: [
      { label: 'Order Placed',     time: 'Apr 28, 9:15 AM',  done: true,  note: 'Order confirmed & payment received' },
      { label: 'Processing',       time: 'Apr 28, 11:30 AM', done: true,  note: 'Supplier preparing your materials' },
      { label: 'Quality Check',    time: 'Apr 28, 2:00 PM',  done: true,  note: 'Materials inspected and approved' },
      { label: 'Dispatched',       time: 'Apr 29, 8:00 AM',  done: true,  note: 'Materials loaded for delivery' },
      { label: 'In Transit',       time: 'Apr 29, 10:30 AM', done: true,  note: 'On the way to your delivery address' },
      { label: 'Out for Delivery', time: 'Apr 30, 9:00 AM',  done: true,  note: 'Driver is in your area' },
      { label: 'Delivered',        time: 'Apr 30, 11:45 AM', done: true,  note: 'Successfully delivered' },
    ],
  },
  {
    id: '#BM-2901', date: 'May 2, 2026', status: 'In Transit', stage: 4,
    deliveryType: 'Express Delivery', deliveryFee: '₦15,000',
    eta: 'Expected May 5, 2026', address: 'Plot 7 Maitama District, Abuja FCT',
    items: [
      { name: 'Porcelain Floor Tile 60x60', qty: 200, price: 7200  },
      { name: 'Binding Wire 25kg',          qty: 2,   price: 12500 },
    ],
    total: '₦1,465,000',
    timeline: [
      { label: 'Order Placed',     time: 'May 2, 10:00 AM',  done: true,  note: 'Order confirmed & payment received' },
      { label: 'Processing',       time: 'May 2, 1:00 PM',   done: true,  note: 'Supplier preparing your materials' },
      { label: 'Quality Check',    time: 'May 3, 9:00 AM',   done: true,  note: 'Materials inspected and approved' },
      { label: 'Dispatched',       time: 'May 3, 2:00 PM',   done: true,  note: 'Materials loaded for delivery' },
      { label: 'In Transit',       time: 'May 4, 8:00 AM',   done: true,  note: 'Lagos to Abuja — in transit' },
      { label: 'Out for Delivery', time: 'May 5, 2026',      done: false, note: 'Expected morning delivery' },
      { label: 'Delivered',        time: '--',               done: false, note: '' },
    ],
  },
  {
    id: '#BM-2935', date: 'May 4, 2026', status: 'Processing', stage: 1,
    deliveryType: 'Standard Delivery', deliveryFee: '₦5,000',
    eta: 'Expected May 8-10, 2026', address: '33 Okonkwo Ave, GRA, Port Harcourt',
    items: [
      { name: 'Stone Coated Roof (per m2)', qty: 120, price: 12000 },
    ],
    total: '₦1,440,000',
    timeline: [
      { label: 'Order Placed',     time: 'May 4, 3:30 PM',   done: true,  note: 'Order confirmed & payment received' },
      { label: 'Processing',       time: 'May 4, 4:15 PM',   done: true,  note: 'Supplier preparing your materials' },
      { label: 'Quality Check',    time: 'Pending',          done: false, note: 'Scheduled for May 5' },
      { label: 'Dispatched',       time: '--',               done: false, note: '' },
      { label: 'In Transit',       time: '--',               done: false, note: '' },
      { label: 'Out for Delivery', time: '--',               done: false, note: '' },
      { label: 'Delivered',        time: '--',               done: false, note: '' },
    ],
  },
];

// ── Categories ─────────────────────────────────────────────────────────────────
export const categories = [
  { label: 'All Materials',       value: '',        count: 155 },
  { label: '🏗 Cement',           value: 'Cement',  count: 18  },
  { label: '🪨 Sand',             value: 'Sand',    count: 22  },
  { label: '💎 Granite & Stone',  value: 'Granite', count: 16  },
  { label: '🧱 Blocks',           value: 'Blocks',  count: 14  },
  { label: '⚙ Iron & Steel',      value: 'Iron',    count: 24  },
  { label: '🪟 Tiles',            value: 'Tiles',   count: 32  },
  { label: '🪵 Timber',           value: 'Timber',  count: 15  },
  { label: '🏠 Roofing',          value: 'Roofing', count: 11  },
  { label: '🎨 Paints',           value: 'Paint',   count: 20  },
];
