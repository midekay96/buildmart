import React from 'react';
import KpiCard from '../components/KpiCard';
import StatusBadge from '../components/StatusBadge';
import { suppliers } from '../adminData';
import styles from './Pages.module.css';

function SuppliersPage() {
  return (
    <div>
      <div className={styles.kpiRow}>
        <KpiCard label="Active Suppliers"      value="34"     color="teal"  />
        <KpiCard label="Pending Review"        value="3"      color="amber" />
        <KpiCard label="Total Products Listed" value="1,248"  color="blue"  />
        <KpiCard label="Payouts (May)"         value="₦61.4M" color="green" />
      </div>
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>Supplier Directory</div>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>+ Add Supplier</button>
        </div>
        <table className={styles.table}>
          <thead><tr><th>Supplier</th><th>Category</th><th>Location</th><th>Products</th><th>Sales (May)</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {suppliers.map((s, i) => (
              <tr key={i}>
                <td><strong>{s.name}</strong></td>
                <td>{s.cat}</td>
                <td>{s.location}</td>
                <td>{s.products}</td>
                <td className={styles.mono}>{s.sales}</td>
                <td>{s.rating !== '—' ? '⭐ ' + s.rating : '—'}</td>
                <td><StatusBadge status={s.status} /></td>
                <td style={{ display: 'flex', gap: 4 }}>
                  {s.status === 'Pending' ? (
                    <><button className={styles.actionBtn}>Approve</button><button className={`${styles.actionBtn} ${styles.actionBtnRed}`}>Reject</button></>
                  ) : (
                    <button className={styles.actionBtn}>View</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SuppliersPage;