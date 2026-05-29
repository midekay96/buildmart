import React from 'react';
import styles from './AdminLayout.module.css';
import { useTheme } from '../../ThemeContext';
import { adminLogout } from '../../services/api';

const navItems = [
  { id: 'dashboard',     label: 'Dashboard',     icon: '▣', badge: null },
  { id: 'analytics',     label: 'Analytics',     icon: '↗', badge: null },
  { id: 'notifications', label: 'Notifications', icon: '◎', badge: 5   },
  { id: 'orders',        label: 'Orders',        icon: '⊡', badge: 12  },
  { id: 'products',      label: 'Products',      icon: '⊞', badge: null },
  { id: 'suppliers',     label: 'Suppliers',     icon: '⊙', badge: 3, badgeGreen: true },
  { id: 'customers',     label: 'Customers',     icon: '◎', badge: null },
  { id: 'payments',      label: 'Payments',      icon: '◈', badge: null },
  { id: 'reports',       label: 'Reports',       icon: '≡', badge: null },
  { id: 'settings',      label: 'Settings',      icon: '⊕', badge: null },
];

const sections = [
  { label: 'Overview',    ids: ['dashboard', 'analytics', 'notifications'] },
  { label: 'Marketplace', ids: ['orders', 'products', 'suppliers', 'customers'] },
  { label: 'Finance',     ids: ['payments', 'reports'] },
  { label: 'System',      ids: ['settings'] },
];

const TODAY = new Date().toLocaleDateString('en-GB', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
});

function AdminLayout({ activePage, setActivePage, onLogout, children }) {
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    adminLogout();
    if (onLogout) onLogout();
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>🏗</div>
          <div>
            <div className={styles.logoText}>BuildMart</div>
            <div className={styles.logoSub}>Admin Panel</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {sections.map(section => (
            <div key={section.label} className={styles.section}>
              <div className={styles.sectionLabel}>{section.label}</div>
              {section.ids.map(id => {
                const item = navItems.find(n => n.id === id);
                return (
                  <div
                    key={id}
                    className={`${styles.navItem} ${activePage === id ? styles.active : ''}`}
                    onClick={() => setActivePage(id)}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    {item.label}
                    {item.badge && (
                      <span className={`${styles.badge} ${item.badgeGreen ? styles.badgeGreen : ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.user}>
            <div className={styles.avatar}>A</div>
            <div>
              <div className={styles.userName}>Admin</div>
              <div className={styles.userRole}>Super Admin</div>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Sign out">
            ⏻ Sign out
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <div className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <div className={styles.pageTitle}>
              {navItems.find(n => n.id === activePage)?.label || 'Dashboard'}
            </div>
            <div className={styles.pageDate}>{TODAY}</div>
          </div>
          <div className={styles.topbarRight}>
            <input className={styles.searchBox} placeholder="Search orders, products…" />
            <button
              className={styles.themeBtn}
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀' : '🌙'}
            </button>
            <button className={styles.btn}>⬇ Export</button>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => setActivePage('products-add')}
            >
              + Add Product
            </button>
          </div>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}

export default AdminLayout;
