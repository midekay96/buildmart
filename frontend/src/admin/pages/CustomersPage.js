import React, { useEffect, useState } from 'react';
import styles from './Pages.module.css';
import StatusBadge from '../components/StatusBadge';
import { getCustomers } from '../../services/api';

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getCustomers()
      .then(setCustomers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard} style={{ borderTop: '3px solid #1D9E75' }}>
          <div className={styles.kpiLabel}>Total Customers</div>
          <div className={styles.kpiValue}>{customers.length.toLocaleString()}</div>
        </div>
        <div className={styles.kpiCard} style={{ borderTop: '3px solid #3B82F6' }}>
          <div className={styles.kpiLabel}>Active This Month</div>
          <div className={styles.kpiValue}>
            {customers.filter(c => c.status === 'active').length}
          </div>
        </div>
        <div className={styles.kpiCard} style={{ borderTop: '3px solid #F59E0B' }}>
          <div className={styles.kpiLabel}>New (30 days)</div>
          <div className={styles.kpiValue}>
            {customers.filter(c => c.isNew).length}
          </div>
        </div>
        <div className={styles.kpiCard} style={{ borderTop: '3px solid #8B5CF6' }}>
          <div className={styles.kpiLabel}>Avg. Orders / Customer</div>
          <div className={styles.kpiValue}>
            {customers.length
              ? (customers.reduce((s, c) => s + (c.orders || 0), 0) / customers.length).toFixed(1)
              : '—'}
          </div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>All Customers</div>
          <input
            className={styles.searchInput}
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className={styles.loadingRow}>Loading customers…</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className={styles.customerCell}>
                      <div className={styles.avatar}>{c.name.charAt(0)}</div>
                      <div>
                        <div className={styles.customerName}>{c.name}</div>
                        {c.isNew && <span className={styles.newBadge}>New</span>}
                      </div>
                    </div>
                  </td>
                  <td className={styles.mono}>{c.email}</td>
                  <td className={styles.mono}>{c.phone || '—'}</td>
                  <td>{c.orders ?? 0}</td>
                  <td className={styles.mono}>{c.totalSpent ?? '—'}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td className={styles.muted}>{c.joined || '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.emptyRow}>No customers match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CustomersPage;
