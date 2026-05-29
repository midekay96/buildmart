import React, { useState, useEffect } from 'react';
import styles from './Estimator.module.css';

const rates = {
  cement: 9500,
  roofs: { zinc: 4000, stone: 12000, clay: 9000, concrete: 18000 },
  floors: { ceramic: 4000, porcelain: 7500, terrazzo: 5500, screed: 2500 },
  qualityMult: { standard: 1, medium: 1.25, premium: 1.65 },
  locationMult: { lagos: 1, abuja: 1.1, phc: 1.05, other: 0.9 },
};

function Estimator() {
  const [form, setForm] = useState({
    type: 'bungalow', area: 150, floors: 1, rooms: 3, baths: 2,
    wall: 'block', roof: 'zinc', floor: 'ceramic',
    quality: 'standard', location: 'lagos',
  });
  const [breakdown, setBreakdown] = useState([]);
  const [total, setTotal] = useState(0);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  useEffect(() => {
    const { area, floors, rooms, baths, roof, floor, quality, location } = form;
    const qm = rates.qualityMult[quality];
    const lm = rates.locationMult[location];
    const totalArea = area * floors;

    const cementBags = Math.round(totalArea * 0.4);
    const steelTonnes = Math.round(totalArea * 0.08 * 10) / 10;

    const items = [
      { label: 'Cement & Concrete', value: Math.round(cementBags * rates.cement * qm * lm), detail: `~${cementBags} bags` },
      { label: 'Iron & Reinforcement Steel', value: Math.round(steelTonnes * 94000 * qm * lm), detail: `~${steelTonnes}T` },
      { label: 'Blocks & Masonry', value: Math.round(totalArea * 12 * 450 * qm * lm), detail: `~${Math.round(totalArea * 12).toLocaleString()} blocks` },
      { label: 'Roofing', value: Math.round(area * rates.roofs[roof] * qm * lm), detail: `${area}m²` },
      { label: 'Flooring & Tiles', value: Math.round(totalArea * rates.floors[floor] * qm * lm), detail: `${totalArea}m²` },
      { label: 'Plumbing & Sanitary', value: Math.round((rooms + baths) * 120000 * qm * lm), detail: `${baths} baths` },
      { label: 'Electrical', value: Math.round(totalArea * 3500 * qm * lm), detail: '' },
      { label: 'Paints & Finishes', value: Math.round(totalArea * 1800 * qm * lm), detail: '' },
    ];
    const t = items.reduce((s, i) => s + i.value, 0);
    setBreakdown(items);
    setTotal(t);
  }, [form]);

  const maxVal = Math.max(...breakdown.map(i => i.value), 1);

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        <h2 className={styles.title}>📐 Project Cost Estimator</h2>
        <p className={styles.sub}>Calculate your building materials cost before purchasing. All prices based on current market rates.</p>
      </div>

      <div className={styles.grid}>
        {/* Dimensions */}
        <div className={styles.card}>
          <div className={styles.cardTitle}><span className={styles.cardIcon}>📏</span> Project Dimensions</div>
          <label className={styles.label}>Building Type
            <select className={styles.select} value={form.type} onChange={e => set('type', e.target.value)}>
              <option value="bungalow">Bungalow (Single Story)</option>
              <option value="duplex">Duplex (2 Story)</option>
              <option value="block">Block of Flats</option>
              <option value="commercial">Commercial Building</option>
            </select>
          </label>
          <label className={styles.label}>Floor Area (m²)
            <input className={styles.input} type="number" min="10" max="5000" value={form.area} onChange={e => set('area', +e.target.value)} />
          </label>
          <label className={styles.label}>Number of Floors
            <input className={styles.input} type="number" min="1" max="20" value={form.floors} onChange={e => set('floors', +e.target.value)} />
          </label>
          <label className={styles.label}>Number of Rooms
            <input className={styles.input} type="number" min="1" max="50" value={form.rooms} onChange={e => set('rooms', +e.target.value)} />
          </label>
          <label className={styles.label}>Number of Bathrooms
            <input className={styles.input} type="number" min="1" max="20" value={form.baths} onChange={e => set('baths', +e.target.value)} />
          </label>
        </div>

        {/* Specifications */}
        <div className={styles.card}>
          <div className={styles.cardTitle}><span className={styles.cardIcon}>🏗</span> Material Specifications</div>
          <label className={styles.label}>Wall Material
            <select className={styles.select} value={form.wall} onChange={e => set('wall', e.target.value)}>
              <option value="block">Sandcrete Block (Standard)</option>
              <option value="brick">Burnt Brick</option>
              <option value="precast">Precast Panel</option>
            </select>
          </label>
          <label className={styles.label}>Roofing Type
            <select className={styles.select} value={form.roof} onChange={e => set('roof', e.target.value)}>
              <option value="zinc">Zinc/Iron Sheet</option>
              <option value="stone">Stone Coated Steel</option>
              <option value="clay">Clay Tiles</option>
              <option value="concrete">Concrete Flat Roof</option>
            </select>
          </label>
          <label className={styles.label}>Flooring
            <select className={styles.select} value={form.floor} onChange={e => set('floor', e.target.value)}>
              <option value="ceramic">Ceramic Tiles</option>
              <option value="porcelain">Porcelain Tiles</option>
              <option value="terrazzo">Terrazzo</option>
              <option value="screed">Screed/Concrete</option>
            </select>
          </label>
          <label className={styles.label}>Finish Quality
            <select className={styles.select} value={form.quality} onChange={e => set('quality', e.target.value)}>
              <option value="standard">Standard</option>
              <option value="medium">Medium</option>
              <option value="premium">Premium / Luxury</option>
            </select>
          </label>
          <label className={styles.label}>Location
            <select className={styles.select} value={form.location} onChange={e => set('location', e.target.value)}>
              <option value="lagos">Lagos</option>
              <option value="abuja">Abuja</option>
              <option value="phc">Port Harcourt</option>
              <option value="other">Other Cities</option>
            </select>
          </label>
        </div>
      </div>

      {/* Result */}
      <div className={styles.result}>
        <div className={styles.resultTitle}>📊 Cost Breakdown Estimate</div>
        <div className={styles.rows}>
          {breakdown.map((item, i) => (
            <div key={i} className={styles.row}>
              <span className={styles.rowLabel}>
                {item.label} <span className={styles.rowDetail}>{item.detail}</span>
              </span>
              <span className={styles.rowVal}>₦{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className={styles.bars}>
          {breakdown.map((item, i) => (
            <div key={i} className={styles.barRow}>
              <div className={styles.barMeta}>
                <span>{item.label}</span>
                <span>{Math.round(item.value / total * 100)}%</span>
              </div>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: `${Math.round(item.value / maxVal * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Total Estimated Cost</span>
          <span className={styles.totalVal}>₦{total.toLocaleString()}</span>
        </div>
        <p className={styles.disclaimer}>* Estimates based on current market prices. Actual costs may vary ±15%.</p>
      </div>
    </div>
  );
}

export default Estimator;
