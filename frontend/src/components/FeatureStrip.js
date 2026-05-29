import React from 'react';
import styles from './FeatureStrip.module.css';

const features = [
  { icon: '🚚', label: 'Free Delivery', sub: 'Orders above ₦500k' },
  { icon: '✅', label: 'Verified Suppliers', sub: 'All vendors certified' },
  { icon: '📐', label: 'Free Estimator', sub: 'Plan before you spend' },
  { icon: '💳', label: 'Flexible Payment', sub: 'Bank transfer, card, BNPL' },
];

function FeatureStrip() {
  return (
    <div className={styles.strip}>
      {features.map((f, i) => (
        <div key={i} className={styles.item}>
          <div className={styles.icon}>{f.icon}</div>
          <div className={styles.label}>{f.label}</div>
          <div className={styles.sub}>{f.sub}</div>
        </div>
      ))}
    </div>
  );
}

export default FeatureStrip;
