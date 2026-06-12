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
  { id: 'foundation', icon: '⬇️', label: 'Foundation & Setting Out', group: 'structural' },
  { id: 'blockwork',  icon: '🧱', label: 'Block Work & Walling',     group: 'structural' },
  { id: 'decking',    icon: '🏗️', label: 'Decking (Suspended Slab)', group: 'structural' },
  { id: 'roofing',    icon: '🏠', label: 'Roofing',                  group: 'structural' },
  { id: 'plastering', icon: '🪣', label: 'Plastering',               group: 'finishing'  },
  { id: 'flooring',   icon: '⬜', label: 'Screeding & Tiling',       group: 'finishing'  },
  { id: 'plumbing',   icon: '🚿', label: 'Plumbing & Sanitary',      group: 'mep'        },
  { id: 'electrical', icon: '⚡', label: 'Electrical Works',          group: 'mep'        },
  { id: 'painting',   icon: '🎨', label: 'Painting & Finishes',      group: 'finishing'  },
  { id: 'fencing',    icon: '📲', label: 'Fencing & Gate',           group: 'external'   },
  { id: 'windows',    icon: '🪟', label: 'Windows & Doors',          group: 'finishing'  },
  { id: 'staircase',  icon: '🪜', label: 'Staircase',                group: 'structural' },
  { id: 'siteworks',  icon: '🚜', label: 'Siteworks & Drainage',     group: 'external'   },
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

// ── Step Indicator ───────────────────────────────────────────────────────
const STEP_LABELS = [
  { n: 1, label: 'Welcome' },
  { n: 2, label: 'Project Details' },
  { n: 3, label: 'Building Type' },
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

              <div className={styles.welcomeFeatures}>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>💰</span>
                  <div>
                    <h3>Marketplace Prices</h3>
                    <p>All material costs synchronized with our live marketplace</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>🎨</span>
                  <div>
                    <h3>Quality Options</h3>
                    <p>Choose between Standard, Medium, and Premium finishes</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>📊</span>
                  <div>
                    <h3>Detailed Breakdown</h3>
                    <p>Bill of Quantities with materials, labour, and phases</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>🔍</span>
                  <div>
                    <h3>Expert Specs</h3>
                    <p>Engineering recommendations based on best practices</p>
                  </div>
                </div>
              </div>

              <div className={styles.navRow}>
                <span />
                <button className={styles.btnPrimary} onClick={next}>Get Started →</button>
              </div>
            </div>
          )}

          {/* ════ STEP 2 — PROJECT DETAILS ════ */}
          {step === 2 && (
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
                <button className={styles.btnPrimary} onClick={next} disabled={!canNext2}>Next: Building Type →</button>
              </div>
            </div>
          )}

          {/* ════ STEP 3 — BUILDING TYPE ════ */}
          {step === 3 && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>What Do You Want to Build?</h2>
                <p className={styles.cardSub}>Choose from pre-defined types or describe your custom project</p>
              </div>

              {BUILDING_CATEGORIES.map(category => (
                <div key={category.id}>
                  <div className={styles.sectionLabel}>{category.icon} {category.label}</div>
                  <div className={styles.typeGrid}>
                    {category.types.map(type => (
                      <div key={type.id}
                        className={`${styles.typeCard} ${form.buildingType === type.id ? styles.typeCardOn : ''}`}
                        onClick={() => { setF('buildingType', type.id); setF('customBuildingDesc', ''); setF('floors', type.floors); setF('area', type.area); setF('quality', type.quality); }}>
                        <div className={styles.typeEmoji}>{type.emoji}</div>
                        <div className={styles.typeName}>{type.label}</div>
                        <div className={styles.typeDesc}>{type.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className={styles.sectionLabel} style={{ marginTop: 24 }}>✏️ Custom Project</div>
              <div className={styles.customBox}>
                <label className={styles.label}>Describe your project</label>
                <textarea className={styles.textarea}
                  placeholder="e.g. I want to build a 4-storey office complex with modern finishes, basement parking, and rooftop garden..."
                  value={form.customBuildingDesc} onChange={e => { setF('customBuildingDesc', e.target.value); setF('buildingType', ''); }} />
              </div>

              <div className={styles.navRow}>
                <button className={styles.btnGhost} onClick={back}>← Back</button>
                <button className={styles.btnPrimary} onClick={next} disabled={!canNext3}>Next: Structural Specs →</button>
              </div>
            </div>
          )}

          {/* ════ STEP 4 — STRUCTURAL SPECS ════ */}
          {step === 4 && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Structural Specifications</h2>
                <p className={styles.cardSub}>Choose the right foundation, walls, slabs, and roof for your building</p>
              </div>

              <div className={styles.specSection}>
                <div className={styles.specSectionTitle}>Foundation Type</div>
                <div className={styles.specGrid}>
                  {FOUNDATION_TYPES.map(f => (
                    <div key={f.id}
                      className={`${styles.specCard} ${specs.foundation === f.id ? styles.specCardOn : ''}`}
                      onClick={() => setSp('foundation', f.id)}>
                      <div className={styles.specIcon}>{f.icon}</div>
                      <div className={styles.specName}>{f.label}</div>
                      <div className={styles.specImage}>{f.image}</div>
                      <div className={styles.specUse}>{f.use}</div>
                      <div className={styles.specMult} style={{ color: f.mult > 1 ? '#f59e0b' : '#1D9E75' }}>
                        {f.mult > 1 ? `+${Math.round((f.mult - 1) * 100)}% cost` : 'Base cost'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.specSection}>
                <div className={styles.specSectionTitle}>Wall Type</div>
                <div className={styles.specGrid}>
                  {WALL_TYPES.map(w => (
                    <div key={w.id}
                      className={`${styles.specCard} ${specs.wallType === w.id ? styles.specCardOn : ''}`}
                      onClick={() => setSp('wallType', w.id)}>
                      <div className={styles.specIcon}>{w.icon}</div>
                      <div className={styles.specName}>{w.label}</div>
                      <div className={styles.specImage}>{w.image}</div>
                      <div className={styles.specUse}>{w.use}</div>
                      <div className={styles.specMult} style={{ color: w.mult > 1 ? '#f59e0b' : '#1D9E75' }}>
                        {w.mult > 1 ? `+${Math.round((w.mult - 1) * 100)}% cost` : w.mult < 1 ? `-${Math.round((1 - w.mult) * 100)}% cost` : 'Base cost'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.specSection}>
                <div className={styles.specSectionTitle}>Slab Type (for multi-storey)</div>
                <div className={styles.specGrid}>
                  {SLAB_TYPES.map(s => (
                    <div key={s.id}
                      className={`${styles.specCard} ${specs.slabType === s.id ? styles.specCardOn : ''}`}
                      onClick={() => setSp('slabType', s.id)}>
                      <div className={styles.specIcon}>{s.icon}</div>
                      <div className={styles.specName}>{s.label}</div>
                      <div className={styles.specImage}>{s.image}</div>
                      <div className={styles.specUse}>{s.use}</div>
                      <div className={styles.specMult} style={{ color: s.mult > 1 ? '#f59e0b' : '#1D9E75' }}>
                        {s.mult > 1 ? `+${Math.round((s.mult - 1) * 100)}% cost` : s.mult < 1 ? `-${Math.round((1 - s.mult) * 100)}% cost` : 'Base cost'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.specSection}>
                <div className={styles.specSectionTitle}>Roof Type</div>
                <div className={styles.specGrid}>
                  {ROOF_TYPES.map(r => (
                    <div key={r.id}
                      className={`${styles.specCard} ${specs.roofType === r.id ? styles.specCardOn : ''}`}
                      onClick={() => setSp('roofType', r.id)}>
                      <div className={styles.specIcon}>{r.icon}</div>
                      <div className={styles.specName}>{r.label}</div>
                      <div className={styles.specImage}>{r.image}</div>
                      <div className={styles.specUse}>{r.use}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.sectionLabel} style={{ marginTop: 24 }}>Project Dimensions & Quality</div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Total Floor Area (m²)</label>
                  <input className={styles.input} type="number" min="20" placeholder="e.g. 150"
                    value={form.area} onChange={e => setF('area', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Number of Floors</label>
                  <select className={styles.select} value={form.floors} onChange={e => setF('floors', e.target.value)}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Storey' : 'Storeys'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.sectionLabel}>Quality Tier</div>
              <div className={styles.tierGrid}>
                {QUALITY_TIERS.map(tier => (
                  <div key={tier.id}
                    className={`${styles.tierCard} ${form.quality === tier.id ? styles.tierCardOn : ''}`}
                    style={form.quality === tier.id ? { borderColor: tier.color } : {}}
                    onClick={() => setF('quality', tier.id)}>
                    {tier.popular && <div className={styles.tierBadge} style={{ background: tier.color }}>POPULAR</div>}
                    <div className={styles.tierIcon}>{tier.icon}</div>
                    <div className={styles.tierName} style={{ color: tier.color }}>{tier.label}</div>
                    <div className={styles.tierDesc}>{tier.desc}</div>
                  </div>
                ))}
              </div>

              <div className={styles.sectionLabel}>Select Work Phases</div>
              {PHASE_GROUPS.map(group => {
                const groupPhases = PHASES.filter(p => p.group === group.id);
                return (
                  <div key={group.id} className={styles.phaseGroup}>
                    <div className={styles.phaseGroupLabel} style={{ borderColor: group.color }}>
                      <span className={styles.phaseGroupDot} style={{ background: group.color }} />
                      {group.label}
                    </div>
                    <div className={styles.phaseGrid}>
                      {groupPhases.map(ph => {
                        const isOn = selected.includes(ph.id);
                        const disabled = (ph.id === 'decking' || ph.id === 'staircase') && Number(form.floors) === 1;
                        return (
                          <div key={ph.id}
                            className={`${styles.phaseCard} ${isOn ? styles.phaseCardOn : ''} ${disabled ? styles.phaseCardDisabled : ''}`}
                            style={isOn ? { borderColor: group.color } : {}}
                            onClick={() => !disabled && togglePhase(ph.id)}>
                            <div className={styles.phaseCheck}>{isOn ? '✓' : ''}</div>
                            <div className={styles.phaseIcon}>{ph.icon}</div>
                            <div className={styles.phaseName}>{ph.label}</div>
                            {disabled && <div className={styles.phaseDisabledTag}>N/A</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className={styles.navRow}>
                <button className={styles.btnGhost} onClick={back}>← Back</button>
                <button className={styles.btnPrimary} onClick={next} disabled={!canNext4}>Next: 3D Preview →</button>
              </div>
            </div>
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
