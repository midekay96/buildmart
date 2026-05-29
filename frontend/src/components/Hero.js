import React from 'react';
import styles from './Hero.module.css';

function Hero({ setActiveTab }) {
  return (
    <div className={styles.hero}>
      <div className={styles.text}>
        <div className={styles.eyebrow}>Nigeria's #1 Building Materials Marketplace</div>
        <h1 className={styles.title}>
          Build Smarter,<br /><span>Save More</span>
        </h1>
        <p className={styles.sub}>
          Source cement, iron rods, tiles, timber and everything else directly from verified
          suppliers. Estimate costs before you buy.
        </p>
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={() => setActiveTab('estimator')}>
            📐 Open Estimator
          </button>
          <button className={styles.btnSecondary} onClick={() => setActiveTab('shop')}>
            Browse Materials →
          </button>
        </div>
        <div className={styles.stats}>
          <div><div className={styles.statNum}>12K+</div><div className={styles.statLabel}>Products</div></div>
          <div><div className={styles.statNum}>340+</div><div className={styles.statLabel}>Suppliers</div></div>
          <div><div className={styles.statNum}>98%</div><div className={styles.statLabel}>On-time delivery</div></div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
