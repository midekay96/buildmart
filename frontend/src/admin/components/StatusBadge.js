import React from 'react';
import styles from './StatusBadge.module.css';

const map = {
  Delivered:   'delivered',
  'In Transit':'transit',
  Processing:  'processing',
  Pending:     'pending',
  Active:      'active',
  active:      'active',
  Inactive:    'suspended',
  inactive:    'suspended',
  'Low Stock': 'lowstock',
  Verified:    'verified',
  Success:     'success',
  Disputed:    'disputed',
  Suspended:   'suspended',
};

function StatusBadge({ status }) {
  const cls = map[status] || 'pending';
  return <span className={`${styles.badge} ${styles[cls]}`}>● {status}</span>;
}

export default StatusBadge;