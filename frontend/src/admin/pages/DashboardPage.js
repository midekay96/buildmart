import React, { useState, useEffect } from 'react';
import KpiCard from '../components/KpiCard';
import StatusBadge from '../components/StatusBadge';
import { getOrders } from '../../services/api';
import { kpiData, activities, topCategories } from '../adminData';
import styles from './Pages.module.css';

function DashboardPage({ setActivePage }) {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const ordersRes = await getOrders();
        setRecentOrders(ordersRes?.data || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className={styles.kpiRow}>
        <KpiCard label="Total Revenue"    value={kpiData.revenue.value}   change={kpiData.revenue.change}   sub={kpiData.revenue.sub}   color="teal"  />
        <KpiCard label="Total Orders"     value={kpiData.orders.value}    change={kpiData.orders.change}    sub={kpiData.orders.sub}    color="amber" />
        <KpiCard label="Active Customers" value={kpiData.customers.value} change={kpiData.customers.change} sub={kpiData.customers.sub} color="blue"  />
        <KpiCard label="Avg Order Value"  value={kpiData.avgOrder.value}  change={kpiData.avgOrder.change}  sub={kpiData.avgOrder.sub}  color="green" />
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>Recent Orders</div>
          <button className={styles.btn} onClick={() => setActivePage('orders')}>View all →</button>
        </div>
        <table className={styles.table}>
          <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
          <tbody>
            {recentOrders.slice(0, 5).map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customer}</td>
                <td>{o.items}</td>
                <td className={styles.mono}>₦{o.amount}</td>
                <td><StatusBadge status={o.status} /></td>
                <td>{o.date}</td>
                <td><button className={styles.actionBtn}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.miniCard}>
          <div className={styles.miniTitle}>Recent Activity</div>
          {activities.map((a, i) => (
            <div key={i} className={styles.activityItem}>
              <div className={`${styles.actDot} ${styles['dot_' + a.type]}`} />
              <div>
                <div className={styles.actText}>{a.text}</div>
                <div className={styles.actTime}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.miniCard}>
          <div className={styles.miniTitle}>Top Categories This Month</div>
          {topCategories.map((c, i) => (
            <div key={i} className={styles.catRow}>
              <span className={styles.catName}>{c.name}</span>
              <div className={styles.catBarWrap}>
                <div className={styles.catBar}>
                  <div className={styles.catBarFill} style={{ width: c.pct + '%', background: c.color }} />
                </div>
              </div>
              <span className={styles.catNum}>{c.revenue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;