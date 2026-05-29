import React from 'react';
import StatusBadge from '../components/StatusBadge';
import { products } from '../adminData';
import styles from './Pages.module.css';

function ProductsPage({ setActivePage }) {
  return (
    <div>
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>Product Catalogue — 155 items</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className={styles.searchBox} placeholder="Search products..." />
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setActivePage('products-add')}>+ New Product</button>
          </div>
        </div>
        <table className={styles.table}>
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Sales/Mo</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i}>
                <td>
                  <span style={{ width: 28, height: 28, background: p.color, borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, marginRight: 8, verticalAlign: 'middle' }}>{p.icon}</span>
                  {p.name}
                </td>
                <td>{p.cat}</td>
                <td className={styles.mono}>{p.price}</td>
                <td>
                  <div style={{ color: p.stock / p.stockMax < 0.15 ? '#E24B4A' : p.stock / p.stockMax < 0.25 ? '#EF9F27' : '#E6EDF3', fontSize: 12 }}>{p.stock.toLocaleString()} {p.unit}</div>
                  <div style={{ height: 4, background: '#21262D', borderRadius: 2, marginTop: 4, width: 80, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 2, width: Math.round(p.stock / p.stockMax * 100) + '%', background: p.stock / p.stockMax < 0.15 ? '#E24B4A' : p.stock / p.stockMax < 0.25 ? '#EF9F27' : '#1D9E75' }} />
                  </div>
                </td>
                <td className={styles.mono}>{p.sales}</td>
                <td><StatusBadge status={p.status} /></td>
                <td style={{ display: 'flex', gap: 4 }}>
                  {p.status === 'Low Stock' && <button className={styles.actionBtn}>Restock</button>}
                  <button className={styles.actionBtn}>Edit</button>
                  <button className={`${styles.actionBtn} ${styles.actionBtnRed}`}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductsPage;