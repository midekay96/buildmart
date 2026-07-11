import React, { useState } from 'react';
import styles from './Navbar.module.css';
import { useTheme } from '../ThemeContext';

const tabs = [
  { id: 'shop',      label: 'Shop' },
  { id: 'estimator', label: 'Estimator' },
  { id: 'orders',    label: 'Orders' },
];

function Navbar({ activeTab, setActiveTab, cartCount }) {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMenuOpen(false);
  };

  const handleLogoClick = () => {
    handleNavClick('shop');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src="/logo-green.svg" alt="BuildMart" className={styles.logoIcon} />
        <span className={styles.logoText}>BuildMart</span>
      </div>

      {/* Desktop Navigation */}
      <div className={styles.links}>
        {tabs.map(t => (
          <span
            key={t.id}
            className={`${styles.link} ${activeTab === t.id ? styles.active : ''}`}
            onClick={() => handleNavClick(t.id)}
          >
            {t.label}
          </span>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        className={styles.menuBtn}
        onClick={() => setMenuOpen(!menuOpen)}
        title="Toggle menu"
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {tabs.map(t => (
            <span
              key={t.id}
              className={`${styles.mobileLink} ${activeTab === t.id ? styles.active : ''}`}
              onClick={() => handleNavClick(t.id)}
            >
              {t.label}
            </span>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <button
          className={styles.themeBtn}
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀' : '🌙'}
        </button>
        <button className={styles.cartBtn} onClick={() => handleNavClick('cart')}>
          🛒 Cart <span className={styles.badge}>{cartCount}</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
