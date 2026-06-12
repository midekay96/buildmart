import React from 'react';
import styles from './Navbar.module.css';
import { useTheme } from '../ThemeContext';

const tabs = [
  { id: 'shop',      label: 'Shop' },
  { id: 'estimator', label: 'Estimator' },
  { id: 'orders',    label: 'Orders' },
  { id: 'suppliers', label: 'Suppliers' },
];

function Navbar({ activeTab, setActiveTab, cartCount }) {
  const { theme, toggleTheme } = useTheme();

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

      <div className={styles.actions}>
        <button
          className={styles.themeBtn}
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀' : '🌙'}
        </button>
        <button className={styles.cartBtn} onClick={() => setActiveTab('cart')}>
          🛒 Cart <span className={styles.badge}>{cartCount}</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
