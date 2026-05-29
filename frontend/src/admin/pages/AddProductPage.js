import React, { useState } from 'react';
import styles from './Pages.module.css';

function AddProductPage({ setActivePage }) {
  const [form, setForm] = useState({ name: '', cat: 'Cement', brand: '', price: '', unit: '', description: '', stock: '', reorder: '', supplier: 'Dangote Industries', warehouse: 'Lagos — Apapa', status: 'Active', badge: 'None', oldPrice: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button className={styles.cancelBtn} onClick={() => setActivePage('products')}>← Back</button>
        <div style={{ fontSize: 13, color: '#8B949E' }}>Products / Add New Product</div>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formSectionTitle}>Basic Information</div>
        <div className={styles.formGrid}>
          <label className={`${styles.fLabel} ${styles.spanFull}`}>Product Name<input className={styles.fInput} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Dangote Cement 42.5" /></label>
          <label className={styles.fLabel}>Category<select className={styles.fSelect} value={form.cat} onChange={e => set('cat', e.target.value)}><option>Cement</option><option>Sand</option><option>Granite</option><option>Blocks</option><option>Iron & Steel</option><option>Tiles</option><option>Timber</option><option>Roofing</option><option>Paint</option></select></label>
          <label className={styles.fLabel}>Brand<input className={styles.fInput} value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="e.g. Dangote" /></label>
          <label className={styles.fLabel}>Price (₦)<input className={styles.fInput} type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="9800" /></label>
          <label className={styles.fLabel}>Unit<input className={styles.fInput} value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="e.g. per bag (50kg)" /></label>
          <label className={`${styles.fLabel} ${styles.spanFull}`}>Description<textarea className={styles.fTextarea} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the product, grade, specifications..." /></label>
        </div>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formSectionTitle}>Inventory & Stock</div>
        <div className={styles.formGrid}>
          <label className={styles.fLabel}>Initial Stock Quantity<input className={styles.fInput} type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="500" /></label>
          <label className={styles.fLabel}>Reorder Level (Alert Threshold)<input className={styles.fInput} type="number" value={form.reorder} onChange={e => set('reorder', e.target.value)} placeholder="50" /></label>
          <label className={styles.fLabel}>Supplier<select className={styles.fSelect} value={form.supplier} onChange={e => set('supplier', e.target.value)}><option>Dangote Industries</option><option>BUA Cement Co.</option><option>Iron Flex Ltd</option><option>GraniteCo</option><option>SandMart</option><option>BlockPro</option></select></label>
          <label className={styles.fLabel}>Warehouse<select className={styles.fSelect} value={form.warehouse} onChange={e => set('warehouse', e.target.value)}><option>Lagos — Apapa</option><option>Abuja — Wuse</option><option>Port Harcourt</option></select></label>
        </div>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formSectionTitle}>Visibility & Badges</div>
        <div className={styles.formGrid}>
          <label className={styles.fLabel}>Status<select className={styles.fSelect} value={form.status} onChange={e => set('status', e.target.value)}><option>Active</option><option>Inactive</option><option>Coming Soon</option></select></label>
          <label className={styles.fLabel}>Badge<select className={styles.fSelect} value={form.badge} onChange={e => set('badge', e.target.value)}><option>None</option><option>New</option><option>Hot</option><option>Sale</option></select></label>
          <label className={styles.fLabel}>Old Price (₦)<input className={styles.fInput} type="number" value={form.oldPrice} onChange={e => set('oldPrice', e.target.value)} placeholder="Leave blank if no discount" /></label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className={styles.saveBtn}>Save Product</button>
        <button className={styles.cancelBtn} onClick={() => setActivePage('products')}>Cancel</button>
      </div>
    </div>
  );
}

export default AddProductPage;