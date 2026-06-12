/**
 * BuildMart Database Seed
 * Run: node db/seed.js
 * This populates the database with all products and suppliers from the initial catalogue.
 */

import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../config/database.js';
import { Product, Supplier } from '../models/index.js';

// ── Suppliers ─────────────────────────────────────────────────────────────────
const SUPPLIERS = [
  { name: 'Dangote Industries',  category: 'Cement & Concrete',  location: 'Nationwide',    rating: 4.9, totalOrders: '12K+', icon: '🏭' },
  { name: 'BUA Cement Co.',      category: 'Cement',             location: 'Nationwide',    rating: 4.8, totalOrders: '9K+',  icon: '🏗' },
  { name: 'Lafarge Holcim',      category: 'Cement',             location: 'Nationwide',    rating: 4.7, totalOrders: '7K+',  icon: '🏗' },
  { name: 'Iron Flex Ltd',       category: 'Iron & Steel',       location: 'Lagos, Abuja',  rating: 4.7, totalOrders: '5K+',  icon: '⚙️' },
  { name: 'SteelCo Nigeria',     category: 'Iron & Steel',       location: 'Lagos',         rating: 4.5, totalOrders: '2.5K+',icon: '🔧' },
  { name: 'RomaTile Ceramics',   category: 'Tiles & Flooring',   location: 'Lagos',         rating: 4.8, totalOrders: '3.2K+',icon: '🪟' },
  { name: 'TimberKing Ltd',      category: 'Timber & Wood',      location: 'Ibadan, PH',    rating: 4.6, totalOrders: '2K+',  icon: '🪵' },
  { name: 'MetalCo Roofing',     category: 'Roofing',            location: 'Lagos',         rating: 4.5, totalOrders: '4.1K+',icon: '🏠' },
  { name: 'Gerard Roofing',      category: 'Roofing',            location: 'Lagos, Abuja',  rating: 4.8, totalOrders: '2.9K+',icon: '🏠' },
  { name: 'BlockPro Industries', category: 'Blocks & Masonry',   location: 'Lagos, Abuja',  rating: 4.6, totalOrders: '5K+',  icon: '🧱' },
  { name: 'PaveCo Nigeria',      category: 'Blocks & Paving',    location: 'Lagos',         rating: 4.4, totalOrders: '1.8K+',icon: '🔷' },
  { name: 'SandMart Aggregates', category: 'Sand & Aggregates',  location: 'Lagos, Ibadan', rating: 4.5, totalOrders: '3.5K+',icon: '🪨' },
  { name: 'RiverCo Aggregates',  category: 'Sand & Aggregates',  location: 'Delta, Rivers', rating: 4.6, totalOrders: '2.8K+',icon: '🌊' },
  { name: 'PitSands Ltd',        category: 'Sand & Aggregates',  location: 'Edo, Anambra',  rating: 4.3, totalOrders: '1.5K+',icon: '🔴' },
  { name: 'GraniteCo Ltd',       category: 'Granite & Stone',    location: 'Ogun, Oyo',     rating: 4.7, totalOrders: '4K+',  icon: '💎' },
  { name: 'QuarryCo Nigeria',    category: 'Granite & Stone',    location: 'Abuja, Kogi',   rating: 4.5, totalOrders: '3.2K+',icon: '⛏️' },
  { name: 'Dulux Nigeria',       category: 'Paint & Finishes',   location: 'Lagos',         rating: 4.9, totalOrders: '6K+',  icon: '🎨' },
];

// ── Products ──────────────────────────────────────────────────────────────────
const PRODUCTS = [
  // Cement
  { id: 1,  name: 'Dangote Cement 42.5',       brand: 'Dangote',    cat: 'Cement',  supplierName: 'Dangote Industries',  price: 9800,  unit: 'per bag (50kg)',  icon: '🏗', badge: 'hot',  color: '#E1F5EE', img: 'https://images.unsplash.com/photo-1590664863685-a99ef05e9f61?w=400&h=280&fit=crop&q=80' },
  { id: 2,  name: 'BUA Cement OPC 32.5',        brand: 'BUA',        cat: 'Cement',  supplierName: 'BUA Cement Co.',      price: 8600,  unit: 'per bag (50kg)',  icon: '🏗', badge: 'sale', color: '#E1F5EE', oldPrice: 9500, img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=280&fit=crop&q=80' },
  { id: 3,  name: 'Lafarge Supaset Cement',      brand: 'Lafarge',    cat: 'Cement',  supplierName: 'Lafarge Holcim',      price: 10200, unit: 'per bag (50kg)',  icon: '🏗', badge: 'new',  color: '#E1F5EE', img: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&h=280&fit=crop&q=80' },
  // Sand
  { id: 13, name: 'Sharp Sand (Coarse)',         brand: 'SandMart',   cat: 'Sand',    supplierName: 'SandMart Aggregates', price: 78000, unit: 'per tipper load', icon: '🪨', badge: 'hot',  color: '#F5F0E8', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=280&fit=crop&q=80' },
  { id: 14, name: 'Plaster Sand (Fine)',         brand: 'SandMart',   cat: 'Sand',    supplierName: 'SandMart Aggregates', price: 65000, unit: 'per tipper load', icon: '🟤', color: '#F5F0E8', img: 'https://images.unsplash.com/photo-1551523713-1a4a7f4f8e3b?w=400&h=280&fit=crop&q=80' },
  { id: 15, name: 'River Sand (Washed)',         brand: 'RiverCo',    cat: 'Sand',    supplierName: 'RiverCo Aggregates',  price: 85000, unit: 'per tipper load', icon: '🪨', badge: 'new',  color: '#F5F0E8', img: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=400&h=280&fit=crop&q=80' },
  { id: 16, name: 'Pit Sand (Red Sand)',         brand: 'PitSands',   cat: 'Sand',    supplierName: 'PitSands Ltd',        price: 55000, unit: 'per tipper load', icon: '🔴', color: '#F5F0E8', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=280&fit=crop&q=80' },
  { id: 17, name: 'White Sand (Plastering)',     brand: 'SandMart',   cat: 'Sand',    supplierName: 'SandMart Aggregates', price: 72000, unit: 'per tipper load', icon: '⬜', color: '#F5F0E8', img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=280&fit=crop&q=80' },
  // Granite
  { id: 18, name: 'Granite 3/4" (19mm)',         brand: 'GraniteCo',  cat: 'Granite', supplierName: 'GraniteCo Ltd',       price: 95000, unit: 'per tipper load', icon: '🪨', badge: 'hot',  color: '#ECEAE6', img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=280&fit=crop&q=80' },
  { id: 19, name: 'Granite 1/2" (12.5mm)',       brand: 'GraniteCo',  cat: 'Granite', supplierName: 'GraniteCo Ltd',       price: 88000, unit: 'per tipper load', icon: '🪨', color: '#ECEAE6', oldPrice: 95000, img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=280&fit=crop&q=80' },
  { id: 20, name: 'Granite Dust / Quarry Fines', brand: 'QuarryCo',   cat: 'Granite', supplierName: 'QuarryCo Nigeria',    price: 42000, unit: 'per tipper load', icon: '🌫️',badge: 'sale', color: '#ECEAE6', oldPrice: 50000, img: 'https://images.unsplash.com/photo-1565975591706-f68f8befd56b?w=400&h=280&fit=crop&q=80' },
  { id: 21, name: 'Pea Gravel (Drainage)',        brand: 'RiverCo',    cat: 'Granite', supplierName: 'RiverCo Aggregates',  price: 60000, unit: 'per tipper load', icon: '🪨', color: '#ECEAE6', img: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=400&h=280&fit=crop&q=80' },
  { id: 22, name: 'Crushed Stone (Hardcore)',     brand: 'QuarryCo',   cat: 'Granite', supplierName: 'QuarryCo Nigeria',    price: 70000, unit: 'per tipper load', icon: '💎', badge: 'new',  color: '#ECEAE6', img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=280&fit=crop&q=80' },
  // Blocks
  { id: 23, name: '9" Sandcrete Block (Solid)',  brand: 'BlockPro',   cat: 'Blocks',  supplierName: 'BlockPro Industries', price: 750,   unit: 'per block',       icon: '🧱', badge: 'hot',  color: '#F0EBE1', img: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=280&fit=crop&q=80' },
  { id: 24, name: '6" Sandcrete Block (Hollow)', brand: 'BlockPro',   cat: 'Blocks',  supplierName: 'BlockPro Industries', price: 550,   unit: 'per block',       icon: '🧱', color: '#F0EBE1', img: 'https://images.unsplash.com/photo-1530041539828-114de669390e?w=400&h=280&fit=crop&q=80' },
  { id: 25, name: 'Paving Block (Interlocking)',  brand: 'PaveCo',     cat: 'Blocks',  supplierName: 'PaveCo Nigeria',      price: 1200,  unit: 'per m2',          icon: '🔷', badge: 'new',  color: '#F0EBE1', img: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&h=280&fit=crop&q=80' },
  // Iron
  { id: 4,  name: 'Iron Rod Y12 (12mm)',         brand: 'Iron Flex',  cat: 'Iron',    supplierName: 'Iron Flex Ltd',       price: 94000, unit: 'per tonne',       icon: '⚙️',color: '#EAF3DE', img: 'https://images.unsplash.com/photo-1504704911898-68304a7d2807?w=400&h=280&fit=crop&q=80' },
  { id: 5,  name: 'Iron Rod Y16 (16mm)',         brand: 'Iron Flex',  cat: 'Iron',    supplierName: 'Iron Flex Ltd',       price: 98500, unit: 'per tonne',       icon: '⚙️',badge: 'hot',  color: '#EAF3DE', img: 'https://images.unsplash.com/photo-1590503680237-3d8aed6f4c44?w=400&h=280&fit=crop&q=80' },
  { id: 6,  name: 'Binding Wire 25kg',           brand: 'SteelCo',    cat: 'Iron',    supplierName: 'SteelCo Nigeria',     price: 12500, unit: 'per roll',        icon: '🔧', color: '#EAF3DE', img: 'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=400&h=280&fit=crop&q=80' },
  // Tiles
  { id: 7,  name: 'Ceramic Wall Tile 30x30',     brand: 'RomaTile',   cat: 'Tiles',   supplierName: 'RomaTile Ceramics',   price: 3800,  unit: 'per m2',          icon: '🪟', badge: 'sale', color: '#E6F1FB', oldPrice: 4500, img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=280&fit=crop&q=80' },
  { id: 8,  name: 'Porcelain Floor Tile 60x60',  brand: 'RomaTile',   cat: 'Tiles',   supplierName: 'RomaTile Ceramics',   price: 7200,  unit: 'per m2',          icon: '🪟', badge: 'new',  color: '#E6F1FB', img: 'https://images.unsplash.com/photo-1619211047834-2f1fe83c1f8f?w=400&h=280&fit=crop&q=80' },
  // Timber
  { id: 9,  name: 'Hardwood Plank (3m)',         brand: 'TimberKing', cat: 'Timber',  supplierName: 'TimberKing Ltd',      price: 8500,  unit: 'per piece',       icon: '🪵', color: '#FAEEDA', img: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=400&h=280&fit=crop&q=80' },
  // Roofing
  { id: 10, name: 'Roofing Sheet (0.55mm)',       brand: 'MetalCo',    cat: 'Roofing', supplierName: 'MetalCo Roofing',     price: 4200,  unit: 'per sheet',       icon: '🏠', badge: 'hot',  color: '#FAECE7', img: 'https://images.unsplash.com/photo-1587329310686-91f574d7a0c6?w=400&h=280&fit=crop&q=80' },
  { id: 11, name: 'Stone Coated Roof (per m2)',   brand: 'Gerard',     cat: 'Roofing', supplierName: 'Gerard Roofing',      price: 12000, unit: 'per m2',          icon: '🏠', badge: 'new',  color: '#FAECE7', img: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400&h=280&fit=crop&q=80' },
  // Paint
  { id: 12, name: 'Dulux Weathershield 20L',      brand: 'Dulux',      cat: 'Paint',   supplierName: 'Dulux Nigeria',       price: 58000, unit: 'per bucket',      icon: '🎨', badge: 'sale', color: '#FBEAF0', oldPrice: 64000, img: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=280&fit=crop&q=80' },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    await sequelize.sync({ alter: true });
    console.log('Models synced');

    // ── Seed suppliers ──────────────────────────────────────────────────────
    console.log('Seeding suppliers...');
    const supplierMap = {};
    for (const s of SUPPLIERS) {
      const [rec] = await Supplier.findOrCreate({
        where: { name: s.name },
        defaults: s
      });
      supplierMap[s.name] = rec.id;
      console.log(`  + ${s.name}`);
    }

    // ── Seed products ───────────────────────────────────────────────────────
    console.log('Seeding products...');
    for (const p of PRODUCTS) {
      await Product.upsert({
        ...p,
        supplierId: supplierMap[p.supplierName] || null
      });
      console.log(`  + ${p.name}`);
    }

    console.log('\n✓ Seed complete!');
    console.log(`  ${SUPPLIERS.length} suppliers`);
    console.log(`  ${PRODUCTS.length} products`);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
