import React from 'react';
import KpiCard from '../components/KpiCard';
import StatusBadge from '../components/StatusBadge';
import { transactions } from '../adminData';
import styles from './Pages.module.css';

function PaymentsPage() {
  return (
    <div>
      <div className={styles.kpiRow}>
        <KpiCard label="Collected (May)"       value="₦84.2M" color="teal"  />
        <KpiCard label="Pending Settlement"    value="₦14.8M" color="amber" />
        <KpiCard label="Settled to Suppliers"  value="₦61.4M" color="blue"  />
        <KpiCard label="Platform Fees Earned"  value="₦6.6M"  color="green" />
      </div>
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>Transaction Log</div>
          <button className={styles.btn}>⬇ Export CSV</button>
        </div>
        <table className={styles.table}>
          <thead><tr><th>Reference</th><th>Customer</th><th>Method</th><th>Amount</th><th>Fee</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i}>
                <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{t.ref}</td>
                <td>{t.customer}</td>
                <td>{t.method}</td>
                <td className={styles.mono}>{t.amount}</td>
                <td style={{ color: '#8B949E', fontFamily: 'monospace', fontSize: 11 }}>{t.fee}</td>
                <td><StatusBadge status={t.status} /></td>
                <td>{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentsPage;