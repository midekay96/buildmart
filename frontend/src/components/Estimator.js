import React, { useState, useMemo, useCallback } from 'react';
import styles from './Estimator.module.css';
import Visualizer3D from './Visualizer3D';

// ── Marketplace prices (from products.js) ──────────────────────────────────
const MARKETPLACE_PRICES = {
  cement: 11500, sharpSand: 9000, granite: 17000, pitSand: 8000,
  Y10: 1010000, Y12: 1010000, Y16: 1010000,
  bindingWire: 2000, plank1x12: 4500, plank2x3: 1300,
  bamboo: 1450, nails: 25000, block9: 800, block6: 600,
  nylon: 4750, ceramicTile: 4000, porcelainTile: 7500,
  roofSheet: 4500, stoneCoated: 13000,
};

// ── Location multipliers ──────────────────────────────────────────────────
const LOCATIONS = [
  { value: 'lagos',  label: 'Lagos',         mult: 1.18 },
  { value: 'abuja',  label: 'Abuja',         mult: 1.14 },
  { value: 'phc',    label: 'Port Harcourt', mult: 1.10 },
  { value: 'warri',  label: 'Warri',         mult: 1.05 },
  { value: 'enugu',  label: 'Enugu',         mult: 0.98 },
  { value: 'owerri', label: 'Owerri',        mult: 0.97 },
  { value: 'benin',  label: 'Benin City',    mult: 0.96 },
  { value: 'ibadan', label: 'Ibadan',        mult: 0.95 },
  { value: 'kano',   label: 'Kano',          mult: 0.92 },
  { value: 'kaduna', label: 'Kaduna',        mult: 0.91 },
  { value: 'other',  label: 'Other',         mult: 0.90 },
];

// ── Quality tiers ────────────────────────────────────────────────────────
const QUALITY_TIERS = [
  {
    id: 'standard', label: 'Standard', icon: '🏗️',
    desc: 'Functional & cost-effective. Sandcrete blocks, aluminium roofing, ceramic tiles.',
    costMin: 80000, costMax: 120000, mult: 1.0,
    features: ['Sandcrete 9" blocks','Aluminium roofing sheets','Ceramic floor tiles','Emulsion paint finish'],
    color: '#64748b',
  },
  {
    id: 'medium', label: 'Medium', icon: '🏠', popular: true,
    desc: 'Balance of quality and value. Stone-coated roof, porcelain tiles, better finishes.',
    costMin: 130000, costMax: 185000, mult: 1.25,
    features: ['Sandcrete 9" blocks','Stone-coated roofing','Porcelain floor tiles','Quality finishes'],
    color: '#1D9E75',
  },
  {
    id: 'premium', label: 'Premium', icon: '🏰',
    desc: 'Top-tier materials. Face brick, flat roof, imported tiles.',
    costMin: 200000, costMax: 350000, mult: 1.65,
    features: ['Face brick / RC frame','Flat/Membrane roofing','Imported porcelain tiles','Smart finishes'],
    color: '#f59e0b',
  },
];

// ── Building Types by Category ────────────────────────────────────────────
const BUILDING_CATEGORIES = [
  {
    id: 'residential',
    label: 'Residential',
    icon: '🏠',
    desc: 'Houses, duplexes, apartments, villas',
    types: [
      { id: 'bungalow', label: 'Bungalow (1-Storey)', emoji: '🏠', desc: 'Single family home', floors: '1', area: '120', quality: 'medium' },
      { id: 'duplex', label: 'Duplex (2-Storey)', emoji: '🏡', desc: 'Semi-detached home', floors: '2', area: '180', quality: 'medium' },
      { id: 'terrace', label: 'Terrace House', emoji: '🏘️', desc: 'Row housing, modern urban', floors: '2', area: '150', quality: 'standard' },
      { id: 'mansion', label: 'Mansion / Villa', emoji: '🏰', desc: 'Luxury multi-storey estate', floors: '3', area: '350', quality: 'premium' },
    ],
  },
  {
    id: 'commercial',
    label: 'Commercial',
    icon: '🏢',
    desc: 'Offices, retail, hotels, mixed-use',
    types: [
      { id: 'office', label: 'Office Building', emoji: '🏢', desc: 'Corporate workspace', floors: '3', area: '400', quality: 'medium' },
      { id: 'retail', label: 'Retail / Shop', emoji: '🛍️', desc: 'Store, showroom, mall unit', floors: '1', area: '200', quality: 'medium' },
      { id: 'hotel', label: 'Hotel / Guest House', emoji: '🏨', desc: 'Hospitality facility', floors: '4', area: '500', quality: 'premium' },
    ],
  },
  {
    id: 'industrial',
    label: 'Industrial',
    icon: '🏭',
    desc: 'Factories, warehouses, workshops',
    types: [
      { id: 'warehouse', label: 'Warehouse', emoji: '🏭', desc: 'Storage facility, large span', floors: '1', area: '600', quality: 'standard' },
      { id: 'factory', label: 'Manufacturing Plant', emoji: '🔧', desc: 'Production facility', floors: '2', area: '800', quality: 'medium' },
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    icon: '🌉',
    desc: 'Roads, bridges, utilities',
    types: [
      { id: 'bridge', label: 'Bridge / Culvert', emoji: '🌉', desc: 'Span structure', floors: '1', area: '250', quality: 'medium' },
    ],
  },
  {
    id: 'institutional',
    label: 'Institutional',
    icon: '🏛️',
    desc: 'Schools, hospitals, government',
    types: [
      { id: 'school', label: 'School Building', emoji: '🏫', desc: 'Educational facility', floors: '2', area: '300', quality: 'medium' },
      { id: 'hospital', label: 'Hospital / Clinic', emoji: '⚕️', desc: 'Healthcare facility', floors: '3', area: '400', quality: 'premium' },
    ],
  },
  {
    id: 'public',
    label: 'Public',
    icon: '👥',
    desc: 'Community centers, markets, parks',
    types: [
      { id: 'market', label: 'Market / Hall', emoji: '🏪', desc: 'Community marketplace', floors: '1', area: '500', quality: 'standard' },
      { id: 'community', label: 'Community Center', emoji: '👥', desc: 'Multi-purpose facility', floors: '2', area: '300', quality: 'medium' },
    ],
  },
];

// ── Structural Specs with Images ──────────────────────────────────────────
const FOUNDATION_TYPES = [
  {
    id: 'strip', label: 'Strip Foundation',
    desc: 'Standard for 1-2 storey buildings on firm soil',
    mult: 1.0, icon: '▬',
    image: '🏗️ Linear continuous concrete base below walls',
    use: 'Best for: Single storey on stable ground',
  },
  {
    id: 'raft',  label: 'Raft Foundation',
    desc: 'Spreads load across full footprint - waterlogged areas',
    mult: 1.38, icon: '▭',
    image: '📋 Thick reinforced concrete slab under entire building',
    use: 'Best for: Soft/wet soil, multi-storey buildings',
  },
  {
    id: 'pad',   label: 'Pad & Column',
    desc: 'Isolated pads with columns - medium-rise buildings',
    mult: 1.22, icon: '⊞',
    image: '🔘 Individual concrete pads with vertical columns',
    use: 'Best for: Medium-rise (3-5 floors) on stable ground',
  },
  {
    id: 'pile',  label: 'Pile Foundation',
    desc: 'Deep piles for poor soil or high-rise structures',
    mult: 1.85, icon: '⬇',
    image: '📍 Deep underground pilings with pile cap',
    use: 'Best for: Very soft soil or tall buildings (5+ floors)',
  },
];

const WALL_TYPES = [
  {
    id: 'sandcrete9', label: '9" Sandcrete',
    desc: 'Standard external walls - most common in Nigeria',
    mult: 1.0, icon: '🧱',
    image: '🧱 Stacked concrete blocks, 23cm thick',
    use: 'Best for: Standard residential and commercial',
  },
  {
    id: 'sandcrete6', label: '6" Sandcrete',
    desc: 'Internal partition walls - lighter construction',
    mult: 0.86, icon: '▪',
    image: '⬜ Thin partition walls, 15cm thick',
    use: 'Best for: Internal divisions only',
  },
  {
    id: 'brick',      label: 'Face Brick',
    desc: 'Exposed burnt brick - premium aesthetic',
    mult: 1.42, icon: '🏛️',
    image: '🧸 Decorative clay bricks with visible pattern',
    use: 'Best for: Premium residential, exposed facades',
  },
  {
    id: 'icf',        label: 'RC Frame/ICF',
    desc: 'Reinforced concrete frame - high-rise & luxury',
    mult: 2.02, icon: '⚙️',
    image: '🔷 Steel-reinforced concrete structural frame',
    use: 'Best for: High-rise (5+ floors) and premium builds',
  },
];

const SLAB_TYPES = [
  {
    id: 'hollow',  label: 'Hollow Pot',
    desc: 'Most economical - widely used for residential',
    mult: 1.0, icon: '○',
    image: '⭕ Lightweight clay pots with concrete ribs',
    use: 'Best for: Standard residential (1-3 floors)',
  },
  {
    id: 'solid',   label: 'Solid RC',
    desc: 'Stronger - ideal for heavy loads & large spans',
    mult: 1.12, icon: '◼',
    image: '◼️ Solid reinforced concrete slab throughout',
    use: 'Best for: Heavy loads, open floor plans',
  },
  {
    id: 'precast', label: 'Precast',
    desc: 'Factory-made - faster installation on site',
    mult: 0.95, icon: '⬛',
    image: '📦 Pre-fabricated concrete elements assembled on site',
    use: 'Best for: Quick construction, standardized projects',
  },
  {
    id: 'waffle',  label: 'Waffle Slab',
    desc: 'Ribbed two-way system - long spans, less concrete',
    mult: 1.08, icon: '⊞',
    image: '🧇 Grid pattern with coffers, reduces weight',
    use: 'Best for: Large open spaces, aesthetic appeal',
  },
];

const ROOF_TYPES = [
  {
    id: 'hip',     label: 'Hip Roof',
    desc: 'All sides slope - wind resistant & very common',
    icon: '🏠',
    image: '🏠 Four sloped sides meeting at top',
    use: 'Best for: Standard residential, good drainage',
  },
  {
    id: 'gable',   label: 'Gable Roof',
    desc: 'Two sloped sides - simple & cost-effective',
    icon: '🏡',
    image: '🏡 Triangular two-slope design',
    use: 'Best for: Cost-conscious, simple design',
  },
  {
    id: 'flat',    label: 'Flat / Terrace',
    desc: 'Reinforced concrete - allows rooftop use',
    icon: '▬',
    image: '▬️ Level concrete surface, usable rooftop',
    use: 'Best for: Modern look, rooftop utilization',
  },
  {
    id: 'mansard', label: 'Mansard',
    desc: 'Two slopes per side - maximises usable space',
    icon: '🏰',
    image: '🏰 Double-sloped sides with attic space',
    use: 'Best for: Maximizing space, luxury homes',
  },
];

// ── Work Phases ──────────────────────────────────────────────────────────
const PHASES = [
  // Structural Works
  { id: 'excavation',   icon: '⛏️',  label: 'Excavation',             group: 'structural' },
  { id: 'foundation',   icon: '⬇️',  label: 'Foundation',            group: 'structural' },
  { id: 'groundbeam',   icon: '🏗️',  label: 'Ground Beam',           group: 'structural' },
  { id: 'columns',      icon: '📐',  label: 'Columns',               group: 'structural' },
  { id: 'beams',        icon: '━━',  label: 'Beams',                 group: 'structural' },
  { id: 'slab',         icon: '▭',   label: 'Slab',                  group: 'structural' },
  { id: 'staircase',    icon: '🪜',  label: 'Staircase',             group: 'structural' },
  { id: 'roofing',      icon: '🏠',  label: 'Roofing',               group: 'structural' },

  // Finishes
  { id: 'plastering',   icon: '🪣',  label: 'Plastering',            group: 'finishing'  },
  { id: 'screeding',    icon: '📏',  label: 'Screeding',             group: 'finishing'  },
  { id: 'painting',     icon: '🎨',  label: 'Painting',              group: 'finishing'  },
  { id: 'tiling',       icon: '⬜',  label: 'Tiling',                group: 'finishing'  },
  { id: 'ceiling',      icon: '⬜',  label: 'Ceiling',               group: 'finishing'  },
  { id: 'doors',        icon: '🚪',  label: 'Doors',                 group: 'finishing'  },
  { id: 'windows',      icon: '🪟',  label: 'Windows',               group: 'finishing'  },

  // M&E Services
  { id: 'electrical',   icon: '⚡',  label: 'Electrical',            group: 'mep'        },
  { id: 'plumbing',     icon: '🚿',  label: 'Plumbing',              group: 'mep'        },
  { id: 'hvac',         icon: '❄️',  label: 'HVAC',                  group: 'mep'        },
  { id: 'fireprotection', icon: '🔥', label: 'Fire Protection',      group: 'mep'        },
  { id: 'lowvoltage',   icon: '📡',  label: 'Low Voltage Systems',   group: 'mep'        },

  // External Works
  { id: 'fencing',      icon: '🚧',  label: 'Fencing',               group: 'external'   },
  { id: 'gate',         icon: '🚪',  label: 'Gate',                  group: 'external'   },
  { id: 'driveway',     icon: '🛣️',  label: 'Driveway',              group: 'external'   },
  { id: 'landscaping',  icon: '🌳',  label: 'Landscaping',           group: 'external'   },
  { id: 'drainage',     icon: '💧',  label: 'Drainage',              group: 'external'   },
];

const PHASE_GROUPS = [
  { id: 'structural', label: 'Structural Works', color: '#3b82f6' },
  { id: 'finishing',  label: 'Finishes',         color: '#8b5cf6' },
  { id: 'mep',        label: 'M&E / Services',   color: '#f59e0b' },
  { id: 'external',   label: 'External Works',   color: '#10b981' },
];

// ── Cost Calculation ─────────────────────────────────────────────────────
function calcPhases(form, selected, specs) {
  const locMult   = LOCATIONS.find(l => l.value === form.location)?.mult  ?? 1;
  const qualMult  = QUALITY_TIERS.find(q => q.id === form.quality)?.mult ?? 1;
  const foundMult = FOUNDATION_TYPES.find(f => f.id === specs.foundation)?.mult ?? 1;
  const wallMult  = WALL_TYPES.find(w => w.id === specs.wallType)?.mult ?? 1;
  const slabMult  = SLAB_TYPES.find(s => s.id === specs.slabType)?.mult ?? 1;
  const area      = Number(form.area) || 100;
  const floors    = Number(form.floors) || 1;
  const has       = id => selected.includes(id);
  const m         = locMult * qualMult;
  const R         = MARKETPLACE_PRICES;

  const phases = [];

  if (has('foundation')) {
    const bags    = Math.ceil(area * floors * 0.6);
    const sand_m3 = +(area * floors * 0.18).toFixed(1);
    const gran_m3 = +(area * floors * 0.10).toFixed(1);
    const mat = bags * R.cement + sand_m3 * R.sharpSand + gran_m3 * R.granite;
    const lab = area * floors * 6500 * foundMult;
    phases.push({ id: 'foundation', label: 'Foundation & Setting Out', icon: '⬇️', group: 'structural',
      sections: [
        { name: 'Materials', items: [
          { d: `Cement (${bags} bags)`,       a: bags,    u: 'bags', r: R.cement,    t: bags * R.cement },
          { d: `Sharp sand (${sand_m3} m³)`,  a: sand_m3, u: 'm³',   r: R.sharpSand, t: sand_m3 * R.sharpSand },
          { d: `Granite (${gran_m3} m³)`,     a: gran_m3, u: 'm³',   r: R.granite,   t: gran_m3 * R.granite },
        ], subtotal: mat },
        { name: 'Workmanship', items: [
          { d: 'Excavation, formwork & casting', a: 1, u: 'job', r: lab, t: lab },
        ], subtotal: lab },
      ], total: (mat + lab) * m });
  }

  if (has('blockwork')) {
    const blocks  = Math.ceil(area * floors * 10 * wallMult);
    const bags    = Math.ceil(area * floors * 0.4);
    const sand_m3 = +(area * floors * 0.12).toFixed(1);
    const mat = blocks * R.block9 + bags * R.cement + sand_m3 * R.sharpSand;
    const lab = area * floors * 4200 * wallMult;
    phases.push({ id: 'blockwork', label: 'Block Work & Walling', icon: '🧱', group: 'structural',
      sections: [
        { name: 'Materials', items: [
          { d: `9" Sandcrete blocks (${blocks.toLocaleString()})`, a: blocks,  u: 'units', r: R.block9,    t: blocks * R.block9 },
          { d: `Cement (${bags} bags)`,                            a: bags,    u: 'bags',  r: R.cement,    t: bags * R.cement },
          { d: `Sharp sand (${sand_m3} m³)`,                       a: sand_m3, u: 'm³',    r: R.sharpSand, t: sand_m3 * R.sharpSand },
        ], subtotal: mat },
        { name: 'Workmanship', items: [
          { d: 'Block-laying & lintels', a: 1, u: 'job', r: lab, t: lab },
        ], subtotal: lab },
      ], total: (mat + lab) * m });
  }

  if (has('decking') && floors > 1) {
    const bags    = Math.ceil(area * (floors - 1) * 0.8 * slabMult);
    const rebar_t = +(area * (floors - 1) * 0.015 * slabMult).toFixed(2);
    const planks  = Math.ceil(area * (floors - 1) * 2.5);
    const mat = bags * R.cement + rebar_t * 1000 * R.Y16 / 1000 + planks * R.plank1x12;
    const lab = area * (floors - 1) * 8500 * slabMult;
    phases.push({ id: 'decking', label: 'Decking (Suspended Slab)', icon: '🏗️', group: 'structural',
      sections: [
        { name: 'Materials', items: [
          { d: `Cement (${bags} bags)`,           a: bags,   u: 'bags', r: R.cement,    t: bags * R.cement },
          { d: `Y16 rebar (${rebar_t} tonnes)`,   a: rebar_t,u: 'T',   r: 1010000,     t: rebar_t * 1010000 },
          { d: `Planks (${planks} pcs)`,          a: planks, u: 'pcs', r: R.plank1x12, t: planks * R.plank1x12 },
        ], subtotal: mat },
        { name: 'Workmanship', items: [
          { d: 'Formwork, rebar & casting', a: 1, u: 'job', r: lab, t: lab },
        ], subtotal: lab },
      ], total: (mat + lab) * m });
  }

  if (has('roofing')) {
    const sheets  = Math.ceil(area * 1.35);
    const timbers = Math.ceil(area * 0.9);
    const mat = sheets * (qualMult > 1.2 ? R.stoneCoated : R.roofSheet) + timbers * R.plank2x3;
    const lab = area * 3800;
    phases.push({ id: 'roofing', label: 'Roofing', icon: '🏠', group: 'structural',
      sections: [
        { name: 'Materials', items: [
          { d: `Roofing sheets (${sheets})`, a: sheets,  u: 'pcs', r: qualMult > 1.2 ? R.stoneCoated : R.roofSheet, t: mat - timbers * R.plank2x3 },
          { d: `Timber (${timbers} pcs)`,   a: timbers, u: 'pcs', r: R.plank2x3, t: timbers * R.plank2x3 },
        ], subtotal: mat },
        { name: 'Workmanship', items: [
          { d: 'Carpentry & fixing', a: 1, u: 'job', r: lab, t: lab },
        ], subtotal: lab },
      ], total: (mat + lab) * m });
  }

  if (has('plastering')) {
    const bags    = Math.ceil(area * floors * 0.5);
    const sand_m3 = +(area * floors * 0.15).toFixed(1);
    const mat = bags * R.cement + sand_m3 * R.sharpSand;
    const lab = area * floors * 2800;
    phases.push({ id: 'plastering', label: 'Plastering', icon: '🪣', group: 'finishing',
      sections: [
        { name: 'Materials', items: [
          { d: `Cement (${bags} bags)`,      a: bags,   u: 'bags', r: R.cement,    t: bags * R.cement },
          { d: `Sharp sand (${sand_m3} m³)`, a: sand_m3,u: 'm³',   r: R.sharpSand, t: sand_m3 * R.sharpSand },
        ], subtotal: mat },
        { name: 'Workmanship', items: [
          { d: 'Screeding & rendering', a: 1, u: 'job', r: lab, t: lab },
        ], subtotal: lab },
      ], total: (mat + lab) * m });
  }

  if (has('flooring')) {
    const tileRate = qualMult > 1.2 ? R.porcelainTile : R.ceramicTile;
    const tiles    = Math.ceil(area * floors * 1.1);
    const bags     = Math.ceil(area * floors * 0.25);
    const mat = tiles * tileRate + bags * R.cement;
    const lab = area * floors * 2200;
    phases.push({ id: 'flooring', label: 'Screeding & Tiling', icon: '⬜', group: 'finishing',
      sections: [
        { name: 'Materials', items: [
          { d: `Floor tiles (${tiles} m²)`, a: tiles, u: 'm²',  r: tileRate, t: tiles * tileRate },
          { d: `Cement (${bags} bags)`,     a: bags,  u: 'bags',r: R.cement, t: bags * R.cement },
        ], subtotal: mat },
        { name: 'Workmanship', items: [
          { d: 'Floor laying & grouting', a: 1, u: 'job', r: lab, t: lab },
        ], subtotal: lab },
      ], total: (mat + lab) * m });
  }

  if (has('plumbing')) {
    const mat = area * floors * 4500;
    const lab = area * floors * 2100;
    phases.push({ id: 'plumbing', label: 'Plumbing & Sanitary', icon: '🚿', group: 'mep',
      sections: [
        { name: 'Materials', items: [{ d: 'Pipes, fittings & fixtures', a: 1, u: 'lot', r: mat, t: mat }], subtotal: mat },
        { name: 'Workmanship', items: [{ d: 'Plumbing installation', a: 1, u: 'job', r: lab, t: lab }], subtotal: lab },
      ], total: (mat + lab) * m });
  }

  if (has('electrical')) {
    const mat = area * floors * (qualMult > 1.4 ? 7500 : 4800);
    const lab = area * floors * 2400;
    phases.push({ id: 'electrical', label: 'Electrical Works', icon: '⚡', group: 'mep',
      sections: [
        { name: 'Materials', items: [{ d: 'Cables, conduits & fittings', a: 1, u: 'lot', r: mat, t: mat }], subtotal: mat },
        { name: 'Workmanship', items: [{ d: 'Wiring & installation', a: 1, u: 'job', r: lab, t: lab }], subtotal: lab },
      ], total: (mat + lab) * m });
  }

  if (has('painting')) {
    const litres = Math.ceil(area * floors * 0.8);
    const mat = litres * (qualMult > 1.4 ? 3800 : 2200);
    const lab = area * floors * 1800;
    phases.push({ id: 'painting', label: 'Painting & Finishes', icon: '🎨', group: 'finishing',
      sections: [
        { name: 'Materials', items: [{ d: `Paint & primer (${litres} L)`, a: litres, u: 'L', r: mat / litres, t: mat }], subtotal: mat },
        { name: 'Workmanship', items: [{ d: 'Surface prep & painting', a: 1, u: 'job', r: lab, t: lab }], subtotal: lab },
      ], total: (mat + lab) * m });
  }

  if (has('fencing')) {
    const perim   = Math.ceil(Math.sqrt(area) * 4);
    const blocks  = Math.ceil(perim * 22);
    const pillars = Math.ceil(perim / 3);
    const mat = blocks * R.block9 + pillars * 35000;
    const lab = perim * 4500;
    phases.push({ id: 'fencing', label: 'Fencing & Gate', icon: '📲', group: 'external',
      sections: [
        { name: 'Materials', items: [
          { d: `Blocks (${blocks.toLocaleString()})`, a: blocks,  u: 'units', r: R.block9, t: blocks * R.block9 },
          { d: `Pillars & gate`,         a: pillars, u: 'pcs',  r: 35000,    t: pillars * 35000 },
        ], subtotal: mat },
        { name: 'Workmanship', items: [{ d: 'Fencing construction', a: 1, u: 'job', r: lab, t: lab }], subtotal: lab },
      ], total: (mat + lab) * m });
  }

  if (has('windows')) {
    const count = Math.ceil(area * floors * 0.12);
    const mat   = count * (qualMult > 1.4 ? 145000 : 85000);
    const lab   = count * 12000;
    phases.push({ id: 'windows', label: 'Windows & Doors', icon: '🪟', group: 'finishing',
      sections: [
        { name: 'Materials', items: [{ d: `Windows & doors (${count} units)`, a: count, u: 'units', r: mat / count, t: mat }], subtotal: mat },
        { name: 'Workmanship', items: [{ d: 'Installation & glazing', a: 1, u: 'job', r: lab, t: lab }], subtotal: lab },
      ], total: (mat + lab) * m });
  }

  if (has('staircase') && floors > 1) {
    const flights = floors - 1;
    const mat = flights * 280000;
    const lab = flights * 180000;
    phases.push({ id: 'staircase', label: 'Staircase', icon: '🪜', group: 'structural',
      sections: [
        { name: 'Materials', items: [{ d: `Concrete staircase (${flights} flight${flights > 1 ? 's' : ''})`, a: flights, u: 'flights', r: 280000, t: mat }], subtotal: mat },
        { name: 'Workmanship', items: [{ d: 'Formwork, rebar & casting', a: 1, u: 'job', r: lab, t: lab }], subtotal: lab },
      ], total: (mat + lab) * m });
  }

  if (has('siteworks')) {
    const mat = area * 2800;
    const lab = area * 1500;
    phases.push({ id: 'siteworks', label: 'Siteworks & Drainage', icon: '🚜', group: 'external',
      sections: [
        { name: 'Materials', items: [{ d: 'Drainage, paving & landscaping', a: 1, u: 'lot', r: mat, t: mat }], subtotal: mat },
        { name: 'Workmanship', items: [{ d: 'Site clearing & grading', a: 1, u: 'job', r: lab, t: lab }], subtotal: lab },
      ], total: (mat + lab) * m });
  }

  return phases;
}

// ── Formatters ───────────────────────────────────────────────────────────
const fmt      = n => '₦' + Math.round(n).toLocaleString();
const fmtShort = n =>
  n >= 1e9 ? `₦${(n/1e9).toFixed(2)}B` :
  n >= 1e6 ? `₦${(n/1e6).toFixed(1)}M` :
             `₦${Math.round(n/1000)}K`;

// ── CSV export ───────────────────────────────────────────────────────────
function exportCSV(form, phases, grandTotal, specs) {
  const loc  = LOCATIONS.find(l => l.value === form.location)?.label || form.location;
  const qual = QUALITY_TIERS.find(q => q.id === form.quality)?.label || form.quality;

  const rows = [
    ['BUILDMART - PROJECT COST ESTIMATE'],
    ['Project:', form.projectName], ['Client:', form.clientName],
    ['Location:', loc], ['Area (m²):', form.area], ['Floors:', form.floors],
    ['Quality Tier:', qual], [],
    ['BILL OF QUANTITIES'],
    ['Phase', 'Section', 'Description', 'Qty', 'Unit', 'Rate (NGN)', 'Amount (NGN)'],
  ];

  phases.forEach(ph => {
    ph.sections.forEach(sec => {
      sec.items.forEach(item => {
        rows.push([ph.label, sec.name, item.d, item.a, item.u, item.r, item.t]);
      });
    });
    rows.push([ph.label, '', 'PHASE TOTAL', '', '', '', ph.total]);
    rows.push([]);
  });
  rows.push(['', '', 'GRAND TOTAL', '', '', '', grandTotal]);

  const csv  = rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `BuildMart_Estimate_${form.projectName || 'Project'}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

// ── Popular Building Types (6-8 most commonly selected)
const POPULAR_BUILDING_TYPES = [
  { id: 'bungalow', label: 'Bungalow', emoji: '🏠', categoryId: 'residential' },
  { id: 'duplex', label: 'Duplex', emoji: '🏡', categoryId: 'residential' },
  { id: 'terrace', label: 'Terrace House', emoji: '🏘️', categoryId: 'residential' },
  { id: 'office', label: 'Office Building', emoji: '🏢', categoryId: 'commercial' },
  { id: 'retail', label: 'Retail / Shop', emoji: '🛍️', categoryId: 'commercial' },
  { id: 'warehouse', label: 'Warehouse', emoji: '🏭', categoryId: 'industrial' },
  { id: 'school', label: 'School Building', emoji: '🏫', categoryId: 'institutional' },
  { id: 'hotel', label: 'Hotel / Guest House', emoji: '🏨', categoryId: 'commercial' },
];

// ── Browse All Modal Component ──────────────────────────────────────────
function BrowseAllModal({ isOpen, onClose, BUILDING_CATEGORIES, onSelectType, selectedTypeId, styles }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  if (!isOpen) return null;

  const allTypes = BUILDING_CATEGORIES.flatMap(cat =>
    cat.types.map(type => ({ ...type, categoryId: cat.id, categoryIcon: cat.icon, categoryLabel: cat.label }))
  );

  const filteredCategories = searchTerm
    ? BUILDING_CATEGORIES.map(cat => ({
        ...cat,
        types: cat.types.filter(type =>
          type.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          type.desc.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      })).filter(cat => cat.types.length > 0)
    : BUILDING_CATEGORIES;

  const toggleCategory = (catId) => {
    setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const handleSelectType = (type) => {
    onSelectType(type);
    onClose();
  };

  return (
    <>
      <div className={styles.modalBackdrop} onClick={onClose} />
      <div className={styles.browseAllModal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Building Types</h2>
          <button className={styles.modalCloseBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalSearchContainer}>
          <input
            className={styles.modalSearchInput}
            type="text"
            placeholder="Search building types..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        <div className={styles.modalContent}>
          {filteredCategories.length > 0 ? (
            filteredCategories.map(category => (
              <div key={category.id} className={styles.categorySection}>
                <button
                  className={styles.categoryHeader}
                  onClick={() => toggleCategory(category.id)}>
                  <span className={styles.categoryHeaderText}>
                    {category.icon} {category.label}
                  </span>
                  <span className={styles.categoryChevron}>
                    {expandedCategories[category.id] ? '▼' : '▶'}
                  </span>
                </button>
                {expandedCategories[category.id] && (
                  <div className={styles.categoryTypes}>
                    {category.types.map(type => (
                      <button
                        key={type.id}
                        className={`${styles.typeOption} ${selectedTypeId === type.id ? styles.typeOptionSelected : ''}`}
                        onClick={() => handleSelectType(type)}>
                        <span className={styles.typeOptionEmoji}>{type.emoji}</span>
                        <div className={styles.typeOptionContent}>
                          <div className={styles.typeOptionName}>{type.label}</div>
                          <div className={styles.typeOptionDesc}>{type.desc}</div>
                        </div>
                        {selectedTypeId === type.id && (
                          <span className={styles.typeOptionCheck}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.noResults}>No building types match your search</div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Building Type Step Component (Refactored) ──────────────────────────────
function BuildingTypeStep({ form, setF, canNext, back, next, BUILDING_CATEGORIES, styles }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showBrowseModal, setShowBrowseModal] = useState(false);

  const allTypes = BUILDING_CATEGORIES.flatMap(cat =>
    cat.types.map(type => ({ ...type, categoryId: cat.id }))
  );

  const filteredTypes = searchTerm.trim() ? allTypes.filter(type =>
    type.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.desc.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const selectedType = form.buildingType ? allTypes.find(t => t.id === form.buildingType) : null;

  const selectType = (type) => {
    setF('buildingType', type.id);
    setF('customBuildingDesc', '');
    setF('floors', type.floors);
    setF('area', type.area);
    setF('quality', type.quality);
    setSearchTerm('');
    setShowSearchResults(false);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setShowSearchResults(value.trim().length > 0);
  };

  const clearSelection = () => {
    setF('buildingType', '');
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>What Do You Want to Build?</h2>
        <p className={styles.cardSub}>Describe your custom project or select from pre-defined building types</p>
      </div>

      {/* CUSTOM PROJECT SECTION */}
      <div className={styles.sectionLabel}>✏️ Describe Your Custom Project</div>
      <div className={styles.customBox}>
        <label className={styles.label}>Tell us about your project</label>
        <textarea className={styles.textarea}
          placeholder="e.g. I want to build a 4-storey office complex with modern finishes, basement parking, and rooftop garden..."
          value={form.customBuildingDesc} onChange={e => { setF('customBuildingDesc', e.target.value); setF('buildingType', ''); }} />
        {form.customBuildingDesc && (
          <button className={styles.customBoxNextBtn} onClick={next} disabled={!form.customBuildingDesc.trim()}>
            Next: Project Details →
          </button>
        )}
      </div>

      {/* SMART SEARCH */}
      <div className={styles.sectionLabel} style={{ marginTop: 32 }}>🔍 Or Select Pre-Defined Type</div>
      <div className={styles.smartSearchContainer}>
        <input
          className={styles.smartSearchInput}
          type="text"
          placeholder="Search building types..."
          value={searchTerm}
          onChange={e => handleSearchChange(e.target.value)}
          onFocus={() => searchTerm.trim().length > 0 && setShowSearchResults(true)}
        />
        {showSearchResults && filteredTypes.length > 0 && (
          <div className={styles.smartSearchResults}>
            {filteredTypes.map(type => (
              <button
                key={type.id}
                className={styles.smartSearchResultItem}
                onClick={() => selectType(type)}>
                <div className={styles.smartSearchResultEmoji}>{type.emoji}</div>
                <div className={styles.smartSearchResultContent}>
                  <div className={styles.smartSearchResultName}>{type.label}</div>
                  <div className={styles.smartSearchResultDesc}>{type.desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SELECTED TYPE SUMMARY */}
      {selectedType && (
        <div className={styles.selectedTypeSummary}>
          <div className={styles.selectedTypeContent}>
            <span className={styles.selectedTypeEmoji}>{selectedType.emoji}</span>
            <div className={styles.selectedTypeInfo}>
              <div className={styles.selectedTypeName}>{selectedType.label}</div>
              <div className={styles.selectedTypeHint}>Selected • {selectedType.floors} floor{Number(selectedType.floors) !== 1 ? 's' : ''} • {selectedType.area}m²</div>
            </div>
          </div>
          <button className={styles.selectedTypeChangeBtn} onClick={clearSelection}>Change</button>
        </div>
      )}

      {/* POPULAR BUILDING TYPES */}
      {!selectedType && (
        <>
          <div className={styles.sectionLabel} style={{ marginTop: 28 }}>Popular Options</div>
          <div className={styles.popularTypesGrid}>
            {POPULAR_BUILDING_TYPES.map(popType => {
              const fullType = allTypes.find(t => t.id === popType.id);
              return (
                <button
                  key={popType.id}
                  className={styles.popularTypeCard}
                  onClick={() => selectType(fullType)}>
                  <div className={styles.popularTypeEmoji}>{popType.emoji}</div>
                  <div className={styles.popularTypeName}>{popType.label}</div>
                  <div className={styles.popularTypeDesc}>{fullType.desc}</div>
                </button>
              );
            })}
          </div>

          {/* BROWSE ALL BUTTON */}
          <button
            className={styles.browseAllBtn}
            onClick={() => setShowBrowseModal(true)}>
            Browse All Building Types
          </button>
        </>
      )}

      {/* BROWSE ALL MODAL */}
      <BrowseAllModal
        isOpen={showBrowseModal}
        onClose={() => setShowBrowseModal(false)}
        BUILDING_CATEGORIES={BUILDING_CATEGORIES}
        onSelectType={selectType}
        selectedTypeId={selectedType?.id}
        styles={styles}
      />

      <div className={styles.navRow}>
        <button className={styles.btnGhost} onClick={back}>← Back</button>
        <button className={styles.btnPrimary} onClick={next} disabled={!canNext}>Next: Project Details →</button>
      </div>
    </div>
  );
}

// ── Structural Specs Step Component ──────────────────────────────────────
// ── Helper: Get recommended work phases based on building type and floors
function getRecommendedPhases(selectedType, floors, PHASES) {
  if (!selectedType || !PHASES) return [];

  const isResidential = selectedType.categoryId === 'residential';
  const isMultiStorey = floors > 1;

  // Core structural phases (always included)
  const recommended = ['excavation', 'foundation', 'groundbeam', 'columns', 'beams', 'roofing'];

  // Add multi-storey phases if applicable
  if (isMultiStorey) {
    recommended.push('slab', 'staircase');
  }

  // Add finishing phases
  recommended.push('plastering', 'screeding', 'tiling', 'painting');

  // Add MEP services
  recommended.push('plumbing', 'electrical', 'windows', 'doors');

  // Add external works for all
  recommended.push('drainage');

  return PHASES.filter(p => recommended.includes(p.id)).map(p => p.id);
}

// ── Helper: Get recommended option based on building type and quality
function getRecommendation(selectedType, quality, optionType, FOUNDATION_TYPES, WALL_TYPES, SLAB_TYPES, ROOF_TYPES) {
  if (!selectedType) return null;

  const isResidential = selectedType.categoryId === 'residential';
  const isPremium = quality === 'premium';

  if (optionType === 'foundation') {
    if (isPremium) return FOUNDATION_TYPES.find(f => f.id === 'raft');
    if (isResidential) return FOUNDATION_TYPES.find(f => f.id === 'strip');
    return FOUNDATION_TYPES.find(f => f.id === 'strip');
  }

  if (optionType === 'wall') {
    if (isPremium) return WALL_TYPES.find(w => w.id === 'brick');
    if (isResidential) return WALL_TYPES.find(w => w.id === 'sandcrete9');
    return WALL_TYPES.find(w => w.id === 'sandcrete9');
  }

  if (optionType === 'slab') {
    if (isPremium) return SLAB_TYPES.find(s => s.id === 'solid');
    return SLAB_TYPES.find(s => s.id === 'hollow');
  }

  if (optionType === 'roof') {
    if (isPremium) return ROOF_TYPES.find(r => r.id === 'flat');
    return ROOF_TYPES.find(r => r.id === 'hip');
  }

  return null;
}

// ── Compact Summary Panel Component ─────────────────────────────────────────
function SpecificationsSummary({ form, specs, onEdit, QUALITY_TIERS, FOUNDATION_TYPES, WALL_TYPES, SLAB_TYPES, ROOF_TYPES, styles }) {
  const floors = Number(form.floors) || 1;
  const needsSlab = floors > 1;

  const summaryItems = [
    form.area && {
      label: 'Project',
      value: `${form.area}m² • ${floors} floor${floors !== 1 ? 's' : ''}`,
      section: 'dimensions',
    },
    form.quality && {
      label: 'Quality',
      value: QUALITY_TIERS.find(q => q.id === form.quality)?.label,
      section: 'quality',
    },
    specs.foundation && {
      label: 'Foundation',
      value: FOUNDATION_TYPES.find(f => f.id === specs.foundation)?.label,
      section: 'foundation',
    },
    specs.wallType && {
      label: 'Wall',
      value: WALL_TYPES.find(w => w.id === specs.wallType)?.label,
      section: 'wall',
    },
    (needsSlab && specs.slabType) && {
      label: 'Slab',
      value: SLAB_TYPES.find(s => s.id === specs.slabType)?.label,
      section: 'slab',
    },
    specs.roofType && {
      label: 'Roof',
      value: ROOF_TYPES.find(r => r.id === specs.roofType)?.label,
      section: 'roof',
    },
  ].filter(Boolean);

  if (summaryItems.length === 0) return null;

  return (
    <div className={styles.specificationsSummary}>
      <div className={styles.summaryGrid}>
        {summaryItems.map((item, idx) => (
          <button key={idx} className={styles.summaryItemButton} onClick={() => onEdit?.(item.section)}>
            <div className={styles.summaryItem}>
              <div className={styles.summaryItemLabel}>{item.label}</div>
              <div className={styles.summaryItemValue}>{item.value}</div>
            </div>
            <div className={styles.summaryItemEditIcon}>✎</div>
          </button>
        ))}
      </div>
      <button className={styles.summaryEditBtn} onClick={() => onEdit?.('dimensions')}>← Back to Edit All</button>
    </div>
  );
}

// ── Progress Tracker Component ──────────────────────────────────────────────
function ProgressTracker({ sections, activeSection, onSelectSection, styles }) {
  return (
    <div className={styles.progressTracker}>
      <div className={styles.progressTrackerContent}>
        {sections.map(section => (
          <button
            key={section.id}
            className={`${styles.progressStep} ${activeSection === section.id ? styles.progressStepActive : ''} ${section.completed ? styles.progressStepDone : ''}`}
            onClick={() => section.completed && onSelectSection(section.id)}
            disabled={!section.completed && activeSection !== section.id}>
            <span className={styles.progressStepDot}>{section.completed ? '✓' : section.number}</span>
            <span className={styles.progressStepLabel}>{section.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Structural Specs Step Component (Completely Redesigned) ────────────────
function StructuralSpecsStep({ form, setF, specs, setSp, selected, togglePhase, setSelected, canNext, back, next, QUALITY_TIERS, PHASES, PHASE_GROUPS, FOUNDATION_TYPES, WALL_TYPES, SLAB_TYPES, ROOF_TYPES, styles }) {
  const [activeSection, setActiveSection] = useState('dimensions');
  const [expandedPhaseGroups, setExpandedPhaseGroups] = useState({});

  const floors = Number(form.floors) || 1;
  const needsSlab = floors > 1;
  const allTypes = BUILDING_CATEGORIES.flatMap(cat => cat.types.map(type => ({ ...type, categoryId: cat.id })));
  const selectedType = form.buildingType ? allTypes.find(t => t.id === form.buildingType) : null;

  const sections = [
    { id: 'dimensions', number: 1, label: 'Dimensions', completed: !!form.area && !!form.floors },
    { id: 'quality', number: 2, label: 'Quality', completed: !!form.quality },
    { id: 'foundation', number: 3, label: 'Foundation', completed: !!specs.foundation },
    { id: 'wall', number: 4, label: 'Wall', completed: !!specs.wallType },
    ...(needsSlab ? [{ id: 'slab', number: 5, label: 'Slab', completed: !!specs.slabType }] : []),
    { id: 'roof', number: needsSlab ? 6 : 5, label: 'Roof', completed: !!specs.roofType },
    { id: 'phases', number: needsSlab ? 7 : 6, label: 'Work Phases', completed: selected.length > 0 },
  ];

  const autoExpandNextSection = (completedId) => {
    const currentIndex = sections.findIndex(s => s.id === completedId);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  const handleDimensionsChange = (key, value) => {
    setF(key, value);
  };

  const handleDimensionsDone = () => {
    if (form.area && form.floors) {
      autoExpandNextSection('dimensions');
    }
  };

  const handleQualitySelect = (qualityId) => {
    setF('quality', qualityId);
    autoExpandNextSection('quality');
  };

  const handleSpecSelect = (specKey, specId) => {
    setSp(specKey, specId);
    // Map specKey to section id
    const sectionMap = {
      'foundation': 'foundation',
      'wallType': 'wall',
      'slabType': 'slab',
      'roofType': 'roof'
    };
    autoExpandNextSection(sectionMap[specKey] || specKey);
  };

  const handlePhaseToggle = (phaseId) => {
    togglePhase(phaseId);
  };

  const togglePhaseGroup = (groupId) => {
    setExpandedPhaseGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleSelectRecommendedPhases = () => {
    const recommended = getRecommendedPhases(selectedType, floors, PHASES);
    const currentSelected = new Set(selected);

    // Add recommended phases
    recommended.forEach(phaseId => {
      if (!currentSelected.has(phaseId)) {
        currentSelected.add(phaseId);
      }
    });

    setSelected(Array.from(currentSelected));

    // Expand groups that have recommended phases
    const recommendedSet = new Set(recommended);
    const newExpanded = {};
    PHASE_GROUPS.forEach(group => {
      const groupPhases = PHASES.filter(p => p.group === group.id);
      const hasRecommended = groupPhases.some(p => recommendedSet.has(p.id));
      if (hasRecommended) {
        newExpanded[group.id] = true;
      }
    });
    setExpandedPhaseGroups(newExpanded);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Structural Specifications</h2>
        <p className={styles.cardSub}>Configure your project step by step</p>
      </div>

      {/* HELPER TEXT */}
      <div className={styles.helperText}>
        💡 Click on any completed step below to review or modify it. Complete the current step to continue.
      </div>

      {/* STICKY PROGRESS TRACKER */}
      <ProgressTracker
        sections={sections}
        activeSection={activeSection}
        onSelectSection={id => sections.find(s => s.id === id).completed && setActiveSection(id)}
        styles={styles}
      />

      {/* COMPACT SUMMARY PANEL */}
      {(form.area || form.quality || specs.foundation || specs.wallType || specs.slabType || specs.roofType) && (
        <SpecificationsSummary
          form={form}
          specs={specs}
          onEdit={(section) => setActiveSection(section || 'dimensions')}
          QUALITY_TIERS={QUALITY_TIERS}
          FOUNDATION_TYPES={FOUNDATION_TYPES}
          WALL_TYPES={WALL_TYPES}
          SLAB_TYPES={SLAB_TYPES}
          ROOF_TYPES={ROOF_TYPES}
          styles={styles}
        />
      )}

      {/* ACTIVE CONFIGURATION PANEL */}
      <div className={styles.progressiveContent}>

        {/* ACTIVE SECTION: PROJECT DIMENSIONS */}
        {activeSection === 'dimensions' && (
          <div className={styles.activeSection}>
            <h3 className={styles.activeSectionTitle}>📐 Project Dimensions</h3>
            <p className={styles.sectionGuidance}>Tell us the basic size and structure of your project. These details help us recommend the right materials and estimate costs accurately.</p>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Total Floor Area (m²)</label>
                <input
                  className={styles.input}
                  type="number"
                  min="20"
                  placeholder="e.g. 150"
                  value={form.area}
                  onChange={e => handleDimensionsChange('area', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Number of Floors</label>
                <select
                  className={styles.select}
                  value={form.floors}
                  onChange={e => handleDimensionsChange('floors', e.target.value)}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Storey' : 'Storeys'}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              className={styles.activeSectionContinueBtn}
              onClick={handleDimensionsDone}
              disabled={!form.area || !form.floors}>
              Continue →
            </button>
          </div>
        )}

        {/* ACTIVE SECTION: QUALITY TIER */}
        {activeSection === 'quality' && (
          <div className={styles.activeSection}>
            <h3 className={styles.activeSectionTitle}>⭐ Quality Tier</h3>
            <p className={styles.sectionGuidance}>Choose the quality level that matches your budget and preferences. Each tier includes materials and finishes appropriate for your building type.</p>
            <div className={styles.tierGrid}>
              {QUALITY_TIERS.map(tier => (
                <button
                  key={tier.id}
                  className={`${styles.tierCard} ${form.quality === tier.id ? styles.tierCardOn : ''}`}
                  style={form.quality === tier.id ? { borderColor: tier.color } : {}}
                  onClick={() => handleQualitySelect(tier.id)}>
                  {tier.popular && <div className={styles.tierBadge} style={{ background: tier.color }}>POPULAR</div>}
                  <div className={styles.tierIcon}>{tier.icon}</div>
                  <div className={styles.tierName} style={{ color: tier.color }}>{tier.label}</div>
                  <div className={styles.tierDesc}>{tier.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVE SECTION: FOUNDATION TYPE */}
        {activeSection === 'foundation' && (
          <div className={styles.activeSection}>
            <h3 className={styles.activeSectionTitle}>⬇️ Foundation Type</h3>
            <p className={styles.sectionGuidance}>The foundation supports your entire building. Choose based on soil conditions and building weight. We recommend options suitable for your project.</p>
            {selectedType && (
              <div className={styles.recommendationCard}>
                <span className={styles.recommendationStar}>⭐</span>
                <div>
                  <div className={styles.recommendationLabel}>Recommended for {selectedType.label}</div>
                  <div className={styles.recommendationValue}>
                    {getRecommendation(selectedType, form.quality, 'foundation', FOUNDATION_TYPES, WALL_TYPES, SLAB_TYPES, ROOF_TYPES)?.label}
                  </div>
                </div>
              </div>
            )}
            <div className={styles.specGrid}>
              {FOUNDATION_TYPES.map(f => (
                <button
                  key={f.id}
                  className={`${styles.specCard} ${specs.foundation === f.id ? styles.specCardOn : ''}`}
                  onClick={() => handleSpecSelect('foundation', f.id)}>
                  <div className={styles.specIcon}>{f.icon}</div>
                  <div className={styles.specName}>{f.label}</div>
                  <div className={styles.specImage}>{f.image}</div>
                  <div className={styles.specUse}>{f.use}</div>
                  <div className={styles.specMult} style={{ color: f.mult > 1 ? '#f59e0b' : '#1D9E75' }}>
                    {f.mult > 1 ? `+${Math.round((f.mult - 1) * 100)}% cost` : 'Base cost'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVE SECTION: WALL TYPE */}
        {activeSection === 'wall' && (
          <div className={styles.activeSection}>
            <h3 className={styles.activeSectionTitle}>🧱 Wall Type</h3>
            <p className={styles.sectionGuidance}>Walls define your building's durability and aesthetics. Choose materials based on climate, budget, and desired finish quality.</p>
            {selectedType && (
              <div className={styles.recommendationCard}>
                <span className={styles.recommendationStar}>⭐</span>
                <div>
                  <div className={styles.recommendationLabel}>Recommended for {selectedType.label}</div>
                  <div className={styles.recommendationValue}>
                    {getRecommendation(selectedType, form.quality, 'wall', FOUNDATION_TYPES, WALL_TYPES, SLAB_TYPES, ROOF_TYPES)?.label}
                  </div>
                </div>
              </div>
            )}
            <div className={styles.specGrid}>
              {WALL_TYPES.map(w => (
                <button
                  key={w.id}
                  className={`${styles.specCard} ${specs.wallType === w.id ? styles.specCardOn : ''}`}
                  onClick={() => handleSpecSelect('wallType', w.id)}>
                  <div className={styles.specIcon}>{w.icon}</div>
                  <div className={styles.specName}>{w.label}</div>
                  <div className={styles.specImage}>{w.image}</div>
                  <div className={styles.specUse}>{w.use}</div>
                  <div className={styles.specMult} style={{ color: w.mult > 1 ? '#f59e0b' : '#1D9E75' }}>
                    {w.mult > 1 ? `+${Math.round((w.mult - 1) * 100)}% cost` : w.mult < 1 ? `-${Math.round((1 - w.mult) * 100)}% cost` : 'Base cost'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVE SECTION: SLAB TYPE (CONDITIONAL) */}
        {needsSlab && activeSection === 'slab' && (
          <div className={styles.activeSection}>
            <h3 className={styles.activeSectionTitle}>🏗️ Slab Type</h3>
            <p className={styles.sectionGuidance}>Slabs separate building floors. Choose based on span distance, load capacity, and cost preference for your multi-storey project.</p>
            {selectedType && (
              <div className={styles.recommendationCard}>
                <span className={styles.recommendationStar}>⭐</span>
                <div>
                  <div className={styles.recommendationLabel}>Recommended for {selectedType.label}</div>
                  <div className={styles.recommendationValue}>
                    {getRecommendation(selectedType, form.quality, 'slab', FOUNDATION_TYPES, WALL_TYPES, SLAB_TYPES, ROOF_TYPES)?.label}
                  </div>
                </div>
              </div>
            )}
            <div className={styles.specGrid}>
              {SLAB_TYPES.map(s => (
                <button
                  key={s.id}
                  className={`${styles.specCard} ${specs.slabType === s.id ? styles.specCardOn : ''}`}
                  onClick={() => handleSpecSelect('slabType', s.id)}>
                  <div className={styles.specIcon}>{s.icon}</div>
                  <div className={styles.specName}>{s.label}</div>
                  <div className={styles.specImage}>{s.image}</div>
                  <div className={styles.specUse}>{s.use}</div>
                  <div className={styles.specMult} style={{ color: s.mult > 1 ? '#f59e0b' : '#1D9E75' }}>
                    {s.mult > 1 ? `+${Math.round((s.mult - 1) * 100)}% cost` : s.mult < 1 ? `-${Math.round((1 - s.mult) * 100)}% cost` : 'Base cost'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVE SECTION: ROOF TYPE */}
        {activeSection === 'roof' && (
          <div className={styles.activeSection}>
            <h3 className={styles.activeSectionTitle}>🏠 Roof Type</h3>
            <p className={styles.sectionGuidance}>The roof protects your building from weather. Choose materials based on climate, aesthetics, and durability needs.</p>
            {selectedType && (
              <div className={styles.recommendationCard}>
                <span className={styles.recommendationStar}>⭐</span>
                <div>
                  <div className={styles.recommendationLabel}>Recommended for {selectedType.label}</div>
                  <div className={styles.recommendationValue}>
                    {getRecommendation(selectedType, form.quality, 'roof', FOUNDATION_TYPES, WALL_TYPES, SLAB_TYPES, ROOF_TYPES)?.label}
                  </div>
                </div>
              </div>
            )}
            <div className={styles.specGrid}>
              {ROOF_TYPES.map(r => (
                <button
                  key={r.id}
                  className={`${styles.specCard} ${specs.roofType === r.id ? styles.specCardOn : ''}`}
                  onClick={() => handleSpecSelect('roofType', r.id)}>
                  <div className={styles.specIcon}>{r.icon}</div>
                  <div className={styles.specName}>{r.label}</div>
                  <div className={styles.specImage}>{r.image}</div>
                  <div className={styles.specUse}>{r.use}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVE SECTION: WORK PHASES */}
        {activeSection === 'phases' && (
          <div className={styles.activeSection}>
            <h3 className={styles.activeSectionTitle}>✅ Select Work Phases</h3>
            <p className={styles.sectionGuidance}>Choose which construction phases you need. Our system can recommend phases based on your building type, or you can manually select them.</p>
            <button
              className={styles.selectRecommendedBtn}
              onClick={handleSelectRecommendedPhases}
              disabled={!selectedType || selected.length === getRecommendedPhases(selectedType, floors, PHASES).length}>
              ✨ Select Recommended Phases
            </button>
            <div className={styles.phasesContainer}>
              {PHASE_GROUPS.map(group => {
                const groupPhases = PHASES.filter(p => p.group === group.id);
                const groupIsExpanded = expandedPhaseGroups[group.id];
                const groupItemsSelected = groupPhases.filter(p => selected.includes(p.id)).length;

                return (
                  <div key={group.id} className={styles.phaseGroupCollapsible}>
                    <button
                      className={styles.phaseGroupCollapsibleHeader}
                      onClick={() => togglePhaseGroup(group.id)}
                      style={{ borderColor: group.color }}>
                      <span className={styles.phaseGroupCollapsibleTitle}>
                        <span className={styles.phaseGroupCollapsibleDot} style={{ background: group.color }} />
                        {group.label}
                        <span className={styles.phaseGroupCollapsibleCount}>({groupItemsSelected}/{groupPhases.length})</span>
                      </span>
                      <span className={styles.phaseGroupCollapsibleChevron}>
                        {groupIsExpanded ? '▼' : '▶'}
                      </span>
                    </button>
                    {groupIsExpanded && (
                      <div className={styles.phaseGroupCollapsibleContent}>
                        {groupPhases.map(ph => {
                          const isOn = selected.includes(ph.id);
                          const disabled = (ph.id === 'slab' || ph.id === 'staircase') && floors === 1;
                          return (
                            <button
                              key={ph.id}
                              className={`${styles.phaseItem} ${isOn ? styles.phaseItemOn : ''} ${disabled ? styles.phaseItemDisabled : ''}`}
                              onClick={() => !disabled && handlePhaseToggle(ph.id)}
                              disabled={disabled}>
                              <span className={styles.phaseItemCheck}>{isOn ? '✓' : ''}</span>
                              <span className={styles.phaseItemIcon}>{ph.icon}</span>
                              <span className={styles.phaseItemLabel}>{ph.label}</span>
                              {disabled && <span className={styles.phaseItemDisabledTag}>N/A</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className={styles.navRow}>
        <button className={styles.btnGhost} onClick={back}>← Back</button>
        <button className={styles.btnPrimary} onClick={next} disabled={!canNext}>Next: 3D Preview →</button>
      </div>
    </div>
  );
}

// ── Step Indicator ───────────────────────────────────────────────────────
const STEP_LABELS = [
  { n: 1, label: 'Welcome' },
  { n: 2, label: 'Building Type' },
  { n: 3, label: 'Project Details' },
  { n: 4, label: 'Structure' },
  { n: 5, label: '3D Preview' },
  { n: 6, label: 'Cost Estimate' },
];

function StepBar({ step }) {
  return (
    <div className={styles.stepBar}>
      {STEP_LABELS.map((s, i) => (
        <React.Fragment key={s.n}>
          <div className={`${styles.stepNode} ${step === s.n ? styles.stepActive : ''} ${step > s.n ? styles.stepDone : ''}`}>
            <div className={styles.stepCircle}>{step > s.n ? '✓' : s.n}</div>
            <span className={styles.stepLabel}>{s.label}</span>
          </div>
          {i < STEP_LABELS.length - 1 && <div className={`${styles.stepLine} ${step > s.n ? styles.stepLineDone : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────
export default function Estimator() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    projectName: '', clientName: '', location: 'lagos',
    buildingType: '', customBuildingDesc: '',
    area: '', floors: '1', quality: 'medium',
  });
  const [specs, setSpecs] = useState({
    foundation: 'strip', wallType: 'sandcrete9', slabType: 'hollow', roofType: 'hip',
  });
  const [selected, setSelected] = useState([]);
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [saveMsg, setSaveMsg] = useState('');

  const phases = useMemo(() => calcPhases(form, selected, specs), [form, selected, specs]);
  const grandTotal = useMemo(() => phases.reduce((s, ph) => s + ph.total, 0), [phases]);

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setSp = (k, v) => setSpecs(s => ({ ...s, [k]: v }));
  const togglePhase = id => setSelected(sel =>
    sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]
  );

  const canNext2 = !!(form.projectName && form.clientName && form.location);
  const canNext3 = !!(form.buildingType || form.customBuildingDesc);
  const canNext4 = !!selected.length;
  const canNext5 = !!(form.area && form.floors);

  const next = () => setStep(s => Math.min(s + 1, 6));
  const back = () => setStep(s => Math.max(s - 1, 1));
  const reset = () => {
    setStep(1);
    setForm({ projectName: '', clientName: '', location: 'lagos', buildingType: '', customBuildingDesc: '', area: '', floors: '1', quality: 'medium' });
    setSpecs({ foundation: 'strip', wallType: 'sandcrete9', slabType: 'hollow', roofType: 'hip' });
    setSelected([]);
  };

  const handleSave = () => {
    try {
      const key = 'buildmart_projects';
      const prev = JSON.parse(localStorage.getItem(key) || '[]');
      const entry = { id: Date.now(), form, specs, selected, grandTotal, savedAt: new Date().toISOString() };
      localStorage.setItem(key, JSON.stringify([entry, ...prev].slice(0, 10)));
      setSaveMsg('Project saved!');
      setTimeout(() => setSaveMsg(''), 2500);
    } catch { setSaveMsg('Save failed.'); }
  };

  const handleExport = () => exportCSV(form, phases, grandTotal, specs);

  return (
    <div className={styles.root}>
      {saveMsg && <div className={styles.saveToast}>{saveMsg}</div>}
      <div className={styles.layout}>
        <main className={styles.main}>
          <StepBar step={step} />

          {/* ════ STEP 1 — WELCOME ════ */}
          {step === 1 && (
            <div className={styles.card}>
              <div className={styles.welcomeHeader}>
                <div className={styles.welcomeIcon}>🏗️</div>
                <h1 className={styles.welcomeTitle}>Welcome to BuildMart Estimator</h1>
                <p className={styles.welcomeSub}>
                  Get accurate, detailed cost estimates for your building projects in minutes.
                  From residential homes to commercial complexes, we've got you covered.
                </p>
              </div>


              <div className={styles.navRow}>
                <span />
                <button className={styles.btnPrimary} onClick={next}>Get Started →</button>
              </div>
            </div>
          )}

          {/* ════ STEP 2 — BUILDING TYPE ════ */}
          {step === 2 && (
            <BuildingTypeStep
              form={form} setF={setF} canNext={canNext3}
              back={back} next={next}
              BUILDING_CATEGORIES={BUILDING_CATEGORIES}
              styles={styles}
            />
          )}

          {/* ════ STEP 3 — PROJECT DETAILS ════ */}
          {step === 3 && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Project Details</h2>
                <p className={styles.cardSub}>Tell us about your project</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Project Name</label>
                  <input className={styles.input} placeholder="e.g. Lekki Duplex Phase 1"
                    value={form.projectName} onChange={e => setF('projectName', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Client Name</label>
                  <input className={styles.input} placeholder="e.g. Mr. Adeyemi"
                    value={form.clientName} onChange={e => setF('clientName', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Location</label>
                  <select className={styles.select} value={form.location} onChange={e => setF('location', e.target.value)}>
                    {LOCATIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </div>
              </div>

              <div className={styles.navRow}>
                <button className={styles.btnGhost} onClick={back}>← Back</button>
                <button className={styles.btnPrimary} onClick={next} disabled={!canNext2}>Next: Structural Specs →</button>
              </div>
            </div>
          )}

          {/* ════ STEP 4 — STRUCTURAL SPECS ════ */}
          {step === 4 && (
            <StructuralSpecsStep
              form={form} setF={setF} specs={specs} setSp={setSp}
              selected={selected} togglePhase={togglePhase} setSelected={setSelected}
              canNext={canNext4} back={back} next={next}
              QUALITY_TIERS={QUALITY_TIERS} PHASES={PHASES} PHASE_GROUPS={PHASE_GROUPS}
              FOUNDATION_TYPES={FOUNDATION_TYPES} WALL_TYPES={WALL_TYPES}
              SLAB_TYPES={SLAB_TYPES} ROOF_TYPES={ROOF_TYPES}
              styles={styles}
            />
          )}

          {/* ════ STEP 5 — 3D PREVIEW ════ */}
          {step === 5 && (
            <Visualizer3D
              form={form} selected={selected} phases={phases}
              grandTotal={grandTotal}
              specs={specs}
              onBack={back} onNext={next}
            />
          )}

          {/* ════ STEP 6 — COST ESTIMATE ════ */}
          {step === 6 && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Cost Estimate & Bill of Quantities</h2>
                <p className={styles.cardSub}>
                  Detailed breakdown with marketplace prices · {form.area}m² · {form.floors} floor{Number(form.floors) !== 1 ? 's' : ''}
                </p>
              </div>

              <div className={styles.grandTotalBanner}>
                <div className={styles.grandTotalLabel}>TOTAL PROJECT ESTIMATE</div>
                <div className={styles.grandTotalValue}>{fmt(grandTotal)}</div>
                <div className={styles.grandTotalSub}>{fmtShort(grandTotal)} (marketplace prices included)</div>
              </div>

              {/* Price Breakdown */}
              {phases.length > 0 && (
                <div className={styles.priceBreakdown}>
                  <div className={styles.breakdownTitle}>How Your Price Is Calculated</div>

                  {(() => {
                    const subtotalBeforeMult = phases.reduce((s, ph) => {
                      const matTotal = ph.sections[0]?.subtotal || 0;
                      const labTotal = ph.sections[1]?.subtotal || 0;
                      return s + matTotal + labTotal;
                    }, 0);

                    const locMult = LOCATIONS.find(l => l.value === form.location)?.mult ?? 1;
                    const qualMult = QUALITY_TIERS.find(q => q.id === form.quality)?.mult ?? 1;
                    const totalMult = locMult * qualMult;
                    const adjustmentAmount = subtotalBeforeMult * (totalMult - 1);

                    const locName = LOCATIONS.find(l => l.value === form.location)?.label || form.location;
                    const qualName = QUALITY_TIERS.find(q => q.id === form.quality)?.label || form.quality;

                    return (
                      <>
                        <div className={styles.breakdownRow}>
                          <span className={styles.breakdownLabel}>1. Materials & Labour (Base Cost)</span>
                          <span className={styles.breakdownValue}>{fmt(subtotalBeforeMult)}</span>
                        </div>

                        <div className={styles.breakdownDivider} />

                        <div className={styles.breakdownRow}>
                          <span className={styles.breakdownLabel}>
                            2. Location Adjustment ({locName})
                            <span className={styles.breakdownPercent}>+{Math.round((locMult - 1) * 100)}%</span>
                          </span>
                          <span className={styles.breakdownValue}>{fmt(subtotalBeforeMult * (locMult - 1))}</span>
                        </div>

                        <div className={styles.breakdownRow}>
                          <span className={styles.breakdownLabel}>
                            3. Quality Adjustment ({qualName})
                            <span className={styles.breakdownPercent}>+{Math.round((qualMult - 1) * 100)}%</span>
                          </span>
                          <span className={styles.breakdownValue}>{fmt(subtotalBeforeMult * (qualMult - 1))}</span>
                        </div>

                        <div className={styles.breakdownDivider} />

                        <div className={styles.breakdownRowTotal}>
                          <span className={styles.breakdownLabel}>FINAL ESTIMATE</span>
                          <span className={styles.breakdownValueTotal}>{fmt(grandTotal)}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {phases.map(ph => (
                <div key={ph.id} className={styles.boqPhase}>
                  <button className={styles.boqPhaseHeader}
                    onClick={() => setExpandedPhase(expandedPhase === ph.id ? null : ph.id)}>
                    <span>{ph.icon} {ph.label}</span>
                    <span className={styles.boqPhaseTotal}>{fmt(ph.total)}</span>
                    <span className={styles.boqChevron}>{expandedPhase === ph.id ? '▲' : '▼'}</span>
                  </button>
                  {expandedPhase === ph.id && (
                    <div className={styles.boqDetail}>
                      {ph.sections.map(sec => (
                        <div key={sec.name}>
                          <div className={styles.boqSecLabel}>{sec.name}</div>
                          <table className={styles.boqTable}>
                            <thead>
                              <tr><th>Description</th><th>Qty</th><th>Unit</th><th>Rate (₦)</th><th>Amount (₦)</th></tr>
                            </thead>
                            <tbody>
                              {sec.items.map((item, i) => (
                                <tr key={i}>
                                  <td>{item.d}</td>
                                  <td>{typeof item.a === 'number' ? item.a.toLocaleString() : item.a}</td>
                                  <td>{item.u}</td>
                                  <td>{fmt(item.r)}</td>
                                  <td className={styles.boqAmt}>{fmt(item.t)}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan={4}><strong>{sec.name} Subtotal</strong></td>
                                <td className={styles.boqAmt}><strong>{fmt(sec.subtotal)}</strong></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className={styles.boqGrandTotal}>
                <span>GRAND TOTAL</span>
                <span>{fmt(grandTotal)}</span>
              </div>

              <div className={styles.exportRow}>
                <button className={styles.btnExport} onClick={handleExport}>📊 Export CSV</button>
                <button className={styles.btnSave} onClick={handleSave}>💾 Save Project</button>
              </div>

              <div className={styles.navRow}>
                <button className={styles.btnGhost} onClick={back}>← Back</button>
                <button className={styles.btnPrimary} onClick={reset}>+ New Estimate</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
