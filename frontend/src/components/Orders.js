import React from 'react';
import { sampleOrders } from '../data/products';
import styles from './Orders.module.css';

const statusStyle = {
  Delivered:   { bg: '#E1F5EE', color: '#085041' },
  'In Transit':{ bg: '#FAEEDA', color: '#BA7517' },
  Processing:  { bg: '#E6F1FB', color: '#185FA5' },
};

function Orders() {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>📦 My Orders</h2>
      {sampleOrders.map(o => (
        <div key={o.id} className={styles.card}>
          <div className={styles.left}>
            <div className={styles.row}>
              <span className={styles.orderId}>{o.id}</span>
              <span
                className={styles.status}
                style={{ background: statusStyle[o.status]?.bg, color: statusStyle[o.status]?.color }}
              >
                {o.status}
              </span>
            </div>
            <div className={styles.items}>{o.items}</div>
            <div className={styles.date}>{o.date}</div>
          </div>
          <div className={styles.right}>
            <div className={styles.total}>{o.total}</div>
            <button className={styles.trackBtn}>Track Order</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Orders;
