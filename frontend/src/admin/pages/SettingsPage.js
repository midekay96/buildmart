import React, { useState } from 'react';
import styles from './Pages.module.css';
import { useTheme } from '../../ThemeContext';

function SettingRow({ label, description, children }) {
  return (
    <div className={styles.settingRow}>
      <div className={styles.settingInfo}>
        <div className={styles.settingLabel}>{label}</div>
        {description && <div className={styles.settingDesc}>{description}</div>}
      </div>
      <div className={styles.settingControl}>{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <label className={styles.toggle}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className={styles.toggleTrack} />
    </label>
  );
}

function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderAlerts:        true,
    lowStockAlerts:     true,
    newSupplierAlerts:  false,
    maintenanceMode:    false,
    twoFactorAdmin:     false,
    sessionTimeout:     '30',
    supportEmail:       process.env.REACT_APP_SUPPORT_EMAIL    || 'support@buildmart.ng',
    supportWhatsApp:    process.env.REACT_APP_SUPPORT_WHATSAPP || '+2348012345678',
    storeName:          'BuildMart',
    currency:           'NGN',
    deliveryStandard:   '5000',
    deliveryExpress:    '25000',
  });

  const set = (key) => (e) =>
    setSettings(prev => ({
      ...prev,
      [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));

  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      {/* ── General ───────────────────────────────────────── */}
      <div className={styles.tableCard} style={{ marginBottom: 20 }}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>General</div>
        </div>
        <SettingRow label="Store Name">
          <input className={styles.settingInput} value={settings.storeName} onChange={set('storeName')} />
        </SettingRow>
        <SettingRow label="Currency">
          <select className={styles.settingSelect} value={settings.currency} onChange={set('currency')}>
            <option value="NGN">NGN — Nigerian Naira (₦)</option>
            <option value="USD">USD — US Dollar ($)</option>
            <option value="GBP">GBP — British Pound (£)</option>
          </select>
        </SettingRow>
        <SettingRow label="Theme" description="Applies site-wide including the storefront.">
          <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
          <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--admin-muted)' }}>
            {theme === 'dark' ? 'Dark mode' : 'Light mode'}
          </span>
        </SettingRow>
        <SettingRow label="Maintenance Mode" description="Temporarily shows a maintenance page to all store visitors.">
          <Toggle checked={settings.maintenanceMode} onChange={set('maintenanceMode')} />
        </SettingRow>
      </div>

      {/* ── Delivery Fees ─────────────────────────────────── */}
      <div className={styles.tableCard} style={{ marginBottom: 20 }}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>Delivery Fees (₦)</div>
        </div>
        <SettingRow label="Standard Delivery" description="2–4 business days">
          <input className={styles.settingInput} type="number" value={settings.deliveryStandard} onChange={set('deliveryStandard')} />
        </SettingRow>
        <SettingRow label="Express Delivery" description="Next business day">
          <input className={styles.settingInput} type="number" value={settings.deliveryExpress} onChange={set('deliveryExpress')} />
        </SettingRow>
      </div>

      {/* ── Support Contact ───────────────────────────────── */}
      <div className={styles.tableCard} style={{ marginBottom: 20 }}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>Support Contact</div>
        </div>
        <SettingRow label="Support Email" description="Shown to customers when they raise an issue.">
          <input className={styles.settingInput} value={settings.supportEmail} onChange={set('supportEmail')} />
        </SettingRow>
        <SettingRow label="WhatsApp Number" description="Include country code, no spaces.">
          <input className={styles.settingInput} value={settings.supportWhatsApp} onChange={set('supportWhatsApp')} />
        </SettingRow>
      </div>

      {/* ── Notifications ─────────────────────────────────── */}
      <div className={styles.tableCard} style={{ marginBottom: 20 }}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>Notifications</div>
        </div>
        <SettingRow label="Email Notifications" description="Receive admin digest emails.">
          <Toggle checked={settings.emailNotifications} onChange={set('emailNotifications')} />
        </SettingRow>
        <SettingRow label="New Order Alerts">
          <Toggle checked={settings.orderAlerts} onChange={set('orderAlerts')} />
        </SettingRow>
        <SettingRow label="Low Stock Alerts">
          <Toggle checked={settings.lowStockAlerts} onChange={set('lowStockAlerts')} />
        </SettingRow>
        <SettingRow label="New Supplier Application Alerts">
          <Toggle checked={settings.newSupplierAlerts} onChange={set('newSupplierAlerts')} />
        </SettingRow>
      </div>

      {/* ── Security ──────────────────────────────────────── */}
      <div className={styles.tableCard} style={{ marginBottom: 20 }}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>Security</div>
        </div>
        <SettingRow label="Session Timeout (minutes)" description="Admin sessions auto-expire after this period of inactivity.">
          <select className={styles.settingSelect} value={settings.sessionTimeout} onChange={set('sessionTimeout')}>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
          </select>
        </SettingRow>
        <SettingRow label="Two-Factor Authentication" description="Require OTP on admin login (requires backend support).">
          <Toggle checked={settings.twoFactorAdmin} onChange={set('twoFactorAdmin')} />
        </SettingRow>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        {saved && (
          <div style={{ color: '#1D9E75', fontSize: 13, alignSelf: 'center' }}>
            ✓ Settings saved
          </div>
        )}
        <button className={styles.saveBtn} onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
