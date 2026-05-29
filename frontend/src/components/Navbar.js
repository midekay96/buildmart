import React from 'react';
import styles from './Navbar.module.css';

const tabs = [
  { id: 'shop', label: 'Shop' },
  { id: 'estimator', label: 'Estimator' },
  { id: 'orders', label: 'Orders' },
  { id: 'suppliers', label: 'Suppliers' },
];

function Navbar({ activeTab, setActiveTab, cartCount }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>🏗</div>
        BuildMart
      </div>
      <div className={styles.links}>
        {tabs.map(t => (
          <span
            key={t.id}
            className={`${styles.link} ${activeTab === t.id ? styles.active : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </span>
        ))}
      </div>
      <button className={styles.cartBtn} onClick={() => setActiveTab('cart')}>
        🛒 Cart <span className={styles.badge}>{cartCount}</span>
      </button>
    </nav>
  );
}

export default Navbar;
