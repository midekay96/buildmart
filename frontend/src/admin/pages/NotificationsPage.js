import React from 'react';
import { notifications } from '../adminData';
import styles from './Pages.module.css';

const iconBg = { teal: 'rgba(29,158,117,0.15)', amber: 'rgba(239,159,39,0.15)', red: 'rgba(226,75,74,0.15)', blue: 'rgba(55,138,221,0.15)' };

function NotificationsPage() {
  return (
    <div style={{ maxWidth: 640 }}>
      <div className={styles.miniCard}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div className={styles.miniTitle} style={{ margin: 0 }}>Notifications</div>
          <button className={styles.cancelBtn}>Mark all read</button>
        </div>
        {notifications.map((n, i) => (
          <div key={i} className={styles.notifItem}>
            <div style={{ width: 34, height: 34, background: iconBg[n.type], borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#E6EDF3', marginBottom: 3 }}>{n.title}</div>
              <div style={{ fontSize: 11, color: '#8B949E' }}>{n.sub}</div>
            </div>
            <div style={{ fontSize: 10, color: '#484F58', whiteSpace: 'nowrap', marginLeft: 12 }}>{n.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsPage;