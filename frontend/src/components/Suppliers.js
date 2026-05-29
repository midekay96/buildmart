import React from 'react';
import { suppliers } from '../data/products';
import styles from './Suppliers.module.css';

function Suppliers() {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>🏭 Verified Suppliers</h2>
      <div className={styles.grid}>
        {suppliers.map((s, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.header}>
              <div className={styles.iconBox}>{s.icon}</div>
              <div>
                <div className={styles.name}>{s.name}</div>
                <div className={styles.cat}>{s.cat}</div>
              </div>
            </div>
            <div className={styles.meta}>
              <span>📍 {s.loc}</span>
              <span>⭐ {s.rating}</span>
              <span>📦 {s.orders}</span>
            </div>
            <button className={styles.viewBtn}>View Catalogue</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Suppliers;
