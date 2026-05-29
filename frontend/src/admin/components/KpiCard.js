import React from 'react';
import styles from './KpiCard.module.css';

function KpiCard({ label, value, change, sub, color }) {
  const up = change && change.startsWith('+');
  return (
    <div className={`${styles.card} ${styles['c_' + color]}`}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
      {change && (
        <div className={`${styles.change} ${up ? styles.up : styles.down}`}>
          {up ? '▲' : '▼'} {change} vs last month
        </div>
      )}
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  );
}

export default KpiCard;