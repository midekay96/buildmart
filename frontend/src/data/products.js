export const products = [
  // Cement
  { id: 1,  name: 'Dangote Cement 42.5',        brand: 'Dangote',   cat: 'Cement',     price: 9800,   unit: 'per bag (50kg)',  icon: '🏗',  badge: 'hot',  color: '#E1F5EE', oldPrice: null },
  { id: 2,  name: 'BUA Cement OPC 32.5',         brand: 'BUA',       cat: 'Cement',     price: 8600,   unit: 'per bag (50kg)',  icon: '🏗',  badge: 'sale', color: '#E1F5EE', oldPrice: 9500 },
  { id: 3,  name: 'Lafarge Supaset Cement',       brand: 'Lafarge',   cat: 'Cement',     price: 10200,  unit: 'per bag (50kg)',  icon: '🏗',  badge: 'new',  color: '#E1F5EE', oldPrice: null },

  // Sand & Aggregates
  { id: 13, name: 'Sharp Sand (Coarse)',          brand: 'SandMart',  cat: 'Sand',       price: 78000,  unit: 'per tipper load', icon: '🪨',  badge: 'hot',  color: '#F5F0E8', oldPrice: null },
  { id: 14, name: 'Plaster Sand (Fine)',          brand: 'SandMart',  cat: 'Sand',       price: 65000,  unit: 'per tipper load', icon: '🟤',  badge: null,   color: '#F5F0E8', oldPrice: null },
  { id: 15, name: 'River Sand (Washed)',          brand: 'RiverCo',   cat: 'Sand',       price: 85000,  unit: 'per tipper load', icon: '🪨',  badge: 'new',  color: '#F5F0E8', oldPrice: null },
  { id: 16, name: 'Pit Sand (Red Sand)',          brand: 'PitSands',  cat: 'Sand',       price: 55000,  unit: 'per tipper load', icon: '🔴',  badge: null,   color: '#F5F0E8', oldPrice: null },
  { id: 17, name: 'White Sand (Plastering)',      brand: 'SandMart',  cat: 'Sand',       price: 72000,  unit: 'per tipper load', icon: '⬜',  badge: null,   color: '#F5F0E8', oldPrice: null },

  // Granite & Gravel
  { id: 18, name: 'Granite 3/4" (19mm)',          brand: 'GraniteCo', cat: 'Granite',    price: 95000,  unit: 'per tipper load', icon: '🪨',  badge: 'hot',  color: '#ECEAE6', oldPrice: null },
  { id: 19, name: 'Granite 1/2" (12.5mm)',        brand: 'GraniteCo', cat: 'Granite',    price: 88000,  unit: 'per tipper load', icon: '🪨',  badge: null,   color: '#ECEAE6', oldPrice: 95000 },
  { id: 20, name: 'Granite Dust / Quarry Fines',  brand: 'QuarryCo',  cat: 'Granite',    price: 42000,  unit: 'per tipper load', icon: '🌫️', badge: 'sale', color: '#ECEAE6', oldPrice: 50000 },
  { id: 21, name: 'Pea Gravel (Drainage)',         brand: 'RiverCo',   cat: 'Granite',    price: 60000,  unit: 'per tipper load', icon: '🪨',  badge: null,   color: '#ECEAE6', oldPrice: null },
  { id: 22, name: 'Crushed Stone (Hardcore)',      brand: 'QuarryCo',  cat: 'Granite',    price: 70000,  unit: 'per tipper load', icon: '💎',  badge: 'new',  color: '#ECEAE6', oldPrice: null },

  // Blocks
  { id: 23, name: '9" Sandcrete Block (Solid)',   brand: 'BlockPro',  cat: 'Blocks',     price: 750,    unit: 'per block',       icon: '🧱',  badge: 'hot',  color: '#F0EBE1', oldPrice: null },
  { id: 24, name: '6" Sandcrete Block (Hollow)',  brand: 'BlockPro',  cat: 'Blocks',     price: 550,    unit: 'per block',       icon: '🧱',  badge: null,   color: '#F0EBE1', oldPrice: null },
  { id: 25, name: 'Paving Block (Interlocking)',  brand: 'PaveCo',    cat: 'Blocks',     price: 1200,   unit: 'per m²',          icon: '🔷',  badge: 'new',  color: '#F0EBE1', oldPrice: null },

  // Iron & Steel
  { id: 4,  name: 'Iron Rod Y12 (12mm)',          brand: 'Iron Flex', cat: 'Iron',       price: 94000,  unit: 'per tonne',       icon: '⚙️', badge: null,   color: '#EAF3DE', oldPrice: null },
  { id: 5,  name: 'Iron Rod Y16 (16mm)',          brand: 'Iron Flex', cat: 'Iron',       price: 98500,  unit: 'per tonne',       icon: '⚙️', badge: 'hot',  color: '#EAF3DE', oldPrice: null },
  { id: 6,  name: 'Binding Wire 25kg',            brand: 'SteelCo',   cat: 'Iron',       price: 12500,  unit: 'per roll',        icon: '🔧',  badge: null,   color: '#EAF3DE', oldPrice: null },

  // Tiles
  { id: 7,  name: 'Ceramic Wall Tile 30×30',      brand: 'RomaTile',  cat: 'Tiles',      price: 3800,   unit: 'per m²',          icon: '🪟',  badge: 'sale', color: '#E6F1FB', oldPrice: 4500 },
  { id: 8,  name: 'Porcelain Floor Tile 60×60',   brand: 'RomaTile',  cat: 'Tiles',      price: 7200,   unit: 'per m²',          icon: '🪟',  badge: 'new',  color: '#E6F1FB', oldPrice: null },

  // Timber
  { id: 9,  name: 'Hardwood Plank (3m)',          brand: 'TimberKing', cat: 'Timber',    price: 8500,   unit: 'per piece',       icon: '🪵',  badge: null,   color: '#FAEEDA', oldPrice: null },

  // Roofing
  { id: 10, name: 'Roofing Sheet (0.55mm)',        brand: 'MetalCo',   cat: 'Roofing',    price: 4200,   unit: 'per sheet',       icon: '🏠',  badge: 'hot',  color: '#FAECE7', oldPrice: null },
  { id: 11, name: 'Stone Coated Roof (per m²)',    brand: 'Gerard',    cat: 'Roofing',    price: 12000,  unit: 'per m²',          icon: '🏠',  badge: 'new',  color: '#FAECE7', oldPrice: null },

  // Paint
  { id: 12, name: 'Dulux Weathershield 20L',       brand: 'Dulux',     cat: 'Paint',      price: 58000,  unit: 'per bucket',      icon: '🎨',  badge: 'sale', color: '#FBEAF0', oldPrice: 64000 },
];

export const suppliers = [
  { name: 'Dangote Industries', loc: 'Nationwide', rating: '4.9', orders: '12K+', icon: '🏭', cat: 'Cement & Concrete' },
  { name: 'Iron Flex Ltd', loc: 'Lagos, Abuja', rating: '4.7', orders: '5K+', icon: '⚙️', cat: 'Iron & Steel' },
  { name: 'RomaTile Ceramics', loc: 'Lagos', rating: '4.8', orders: '3.2K+', icon: '🪟', cat: 'Tiles & Flooring' },
  { name: 'TimberKing Ltd', loc: 'Ibadan, PH', rating: '4.6', orders: '2K+', icon: '🪵', cat: 'Timber & Wood' },
  { name: 'MetalCo Roofing', loc: 'Lagos', rating: '4.5', orders: '4.1K+', icon: '🏠', cat: 'Roofing' },
  { name: 'BUA Cement Co.', loc: 'Nationwide', rating: '4.8', orders: '9K+', icon: '🏗', cat: 'Cement' },
];

export const sampleOrders = [
  { id: '#BM-2847', date: 'Apr 28, 2026', status: 'Delivered', items: 'Dangote Cement ×40 bags, Iron Rod Y12 ×0.5T', total: '₦439,000' },
  { id: '#BM-2901', date: 'May 2, 2026', status: 'In Transit', items: 'Porcelain Tiles 200m², Binding Wire ×2', total: '₦1,465,000' },
  { id: '#BM-2935', date: 'May 4, 2026', status: 'Processing', items: 'Stone Coated Roof 120m²', total: '₦1,440,000' },
];

export const categories = [
  { label: 'All Materials',      value: '',        count: 155 },
  { label: '🏗 Cement',          value: 'Cement',  count: 18  },
  { label: '🪨 Sand',            value: 'Sand',    count: 22  },
  { label: '💎 Granite & Stone', value: 'Granite', count: 16  },
  { label: '🧱 Blocks',          value: 'Blocks',  count: 14  },
  { label: '⚙ Iron & Steel',     value: 'Iron',    count: 24  },
  { label: '🪟 Tiles',           value: 'Tiles',   count: 32  },
  { label: '🪵 Timber',          value: 'Timber',  count: 15  },
  { label: '🏠 Roofing',         value: 'Roofing', count: 11  },
  { label: '🎨 Paints',          value: 'Paint',   count: 20  },
];