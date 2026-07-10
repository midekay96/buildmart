import React, { useState, useEffect } from 'react';
import KpiCard from '../components/KpiCard';
import StatusBadge from '../components/StatusBadge';
import { getOrders } from '../../services/api';
import styles from './Pages.module.css';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await getOrders();
        setOrders(res?.data || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <div className={styles.kpiRow}>
        <KpiCard label="Pending"         value="47"    color="amber" />
        <KpiCard label="In Transit"      value="128"   color="blue"  />
        <KpiCard label="Delivered Today" value="84"    change="+12 vs yesterday" color="teal" />
        <KpiCard label="Total This Month" value="2,847" change="+12.1%" color="green" />
      </div>
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>All Orders — May 2026</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className={styles.searchBox} placeholder="Search order ID..." />
            <button className={styles.btn}>Filter ▾</button>
            <button className={styles.btn}>⬇ Export</button>
          </div>
        </div>
        <table className={styles.table}>
          <thead><tr><th>Order ID</th><th>Customer</th><th>Products</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.address || 'Customer'}</td>
                <td>{o.items?.map(i => i.name).join(', ') || 'N/A'}</td>
                <td className={styles.mono}>{o.total}</td>
                <td>{o.deliveryType || 'Standard'}</td>
                <td><StatusBadge status={o.status} /></td>
                <td>{o.date}</td>
                <td style={{ display: 'flex', gap: 4 }}>
                  <button className={styles.actionBtn}>View</button>
                  {o.status === 'Processing' && <button className={styles.actionBtn}>Ship</button>}
                  {o.status === 'Pending' && <button className={`${styles.actionBtn} ${styles.actionBtnRed}`}>Cancel</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersPage;