import React, { useState, useEffect } from 'react';
import styles from './Orders.module.css';
import { getOrders } from '../services/api';

const SUPPORT_EMAIL    = process.env.REACT_APP_SUPPORT_EMAIL    || 'support@buildmart.ng';
const SUPPORT_WHATSAPP = process.env.REACT_APP_SUPPORT_WHATSAPP || '+2348012345678';

// ── Stage icons ───────────────────────────────────────────────────────────────
const STAGE_ICONS = ['📋', '⚙️', '🔍', '🚛', '🛣️', '🏃', '✅'];

// ── Status colour map ─────────────────────────────────────────────────────────
const STATUS_COLOR = {
  Delivered:    { bg: '#E1F5EE', color: '#085041', dot: '#1D9E75' },
  'In Transit': { bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B' },
  Processing:   { bg: '#DBEAFE', color: '#1E40AF', dot: '#3B82F6' },
  Pending:      { bg: '#F3F4F6', color: '#374151', dot: '#9CA3AF' },
};

// ── Support panel ─────────────────────────────────────────────────────────────
function SupportPanel({ orderId, onClose }) {
  const waText = encodeURIComponent(`Hi BuildMart, I need help with order ${orderId}`);
  return (
    <div className={styles.supportPanel}>
      <div className={styles.supportHead}>
        <div className={styles.supportTitle}>📞 BuildMart Support</div>
        <button className={styles.supportClose} onClick={onClose}>✕</button>
      </div>
      <p className={styles.supportNote}>
        All supplier queries go through BuildMart. Quote your order ID below.
      </p>
      <div className={styles.supportLinks}>
        <a href={`mailto:${SUPPORT_EMAIL}?subject=Order%20Query%20${orderId}`} className={styles.supportLink}>
          📧 {SUPPORT_EMAIL}
        </a>
        <a href={`https://wa.me/${SUPPORT_WHATSAPP.replace(/\D/g,'')}?text=${waText}`}
          target="_blank" rel="noreferrer" className={styles.supportLink}>
          💬 WhatsApp Support
        </a>
      </div>
      <div className={styles.supportRef}>Order ID: <strong>{orderId}</strong></div>
    </div>
  );
}

// ── Single order card ─────────────────────────────────────────────────────────
function OrderCard({ o }) {
  const [expanded,    setExpanded]    = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const st = STATUS_COLOR[o.status] || STATUS_COLOR.Pending;
  const itemsTotal = o.items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className={styles.card}>
      {/* ── Header row ── */}
      <div className={styles.cardHead}>
        <div className={styles.cardLeft}>
          <div className={styles.orderId}>{o.id}</div>
          <div className={styles.orderDate}>{o.date}</div>
        </div>
        <div className={styles.cardMid}>
          <span className={styles.statusBadge} style={{ background: st.bg, color: st.color }}>
            <span className={styles.statusDot} style={{ background: st.dot }} />
            {o.status}
          </span>
          <div className={styles.deliveryBadge}>{o.deliveryType}</div>
        </div>
        <div className={styles.cardRight}>
          <div className={styles.total}>{o.total}</div>
          <button className={styles.expandBtn} onClick={() => setExpanded(v => !v)}>
            {expanded ? '▲ Hide details' : '▼ View details'}
          </button>
        </div>
      </div>

      {/* ── Stage progress tracker (always visible) ── */}
      <div className={styles.stageTracker}>
        {o.timeline.map((t, i) => {
          const isActive  = i === o.stage;
          const isDone    = i < o.stage || (i === o.stage && o.status === 'Delivered');
          const isCurrent = i === o.stage && o.status !== 'Delivered';
          return (
            <div key={t.label} className={styles.stageStep}>
              <div className={`${styles.stageDot}
                ${isDone    ? styles.stageDotDone    : ''}
                ${isCurrent ? styles.stageDotActive  : ''}
                ${!isDone && !isCurrent ? styles.stageDotPending : ''}`}>
                {isDone ? '✓' : STAGE_ICONS[i]}
              </div>
              <div className={`${styles.stageLabel} ${isActive || isDone ? styles.stageLabelOn : ''}`}>
                {t.label}
              </div>
              {i < o.timeline.length - 1 && (
                <div className={`${styles.stageLine} ${isDone ? styles.stageLineDone : ''}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── ETA strip ── */}
      <div className={styles.etaStrip}>
        <span className={styles.etaIcon}>{o.status === 'Delivered' ? '✅' : '📅'}</span>
        <span className={styles.etaText}>{o.eta}</span>
        <span className={styles.etaAddr}>📍 {o.address}</span>
      </div>

      {/* ── Expanded details ── */}
      {expanded && (
        <div className={styles.expandedBody}>
          {/* Items */}
          <div className={styles.itemsSection}>
            <div className={styles.sectionHead}>🛒 Order Items</div>
            <table className={styles.itemsTable}>
              <thead>
                <tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr>
              </thead>
              <tbody>
                {o.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>₦{item.price.toLocaleString()}</td>
                    <td><strong>₦{(item.price * item.qty).toLocaleString()}</strong></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3}>Items Subtotal</td>
                  <td><strong>₦{itemsTotal.toLocaleString()}</strong></td>
                </tr>
                <tr>
                  <td colSpan={3}>Delivery Fee ({o.deliveryType})</td>
                  <td>{o.deliveryFee}</td>
                </tr>
                <tr className={styles.totalRow}>
                  <td colSpan={3}><strong>Total Paid</strong></td>
                  <td><strong>{o.total}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Timeline events */}
          <div className={styles.timelineSection}>
            <div className={styles.sectionHead}>🕐 Order Timeline</div>
            <div className={styles.timeline}>
              {o.timeline.map((t, i) => {
                const isDone = i < o.stage || (o.status === 'Delivered');
                return (
                  <div key={t.label}
                    className={`${styles.timelineItem} ${isDone ? styles.timelineItemDone : ''} ${i === o.stage && o.status !== 'Delivered' ? styles.timelineItemActive : ''}`}>
                    <div className={styles.timelineDot}>
                      {isDone ? '✓' : STAGE_ICONS[i]}
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineLabel}>{t.label}</div>
                      {t.note && <div className={styles.timelineNote}>{t.note}</div>}
                      <div className={styles.timelineTime}>{t.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actionRow}>
            <button className={styles.supportBtn} onClick={() => setShowSupport(v => !v)}>
              {showSupport ? '✕ Close' : '💬 Contact Support'}
            </button>
            {o.status === 'Delivered' && (
              <button className={styles.rateBtn}>⭐ Rate this Order</button>
            )}
          </div>

          {showSupport && (
            <SupportPanel orderId={o.id} onClose={() => setShowSupport(false)} />
          )}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await getOrders();
        const orderData = res?.data || [];
        setOrders(orderData);
      } catch (err) {
        console.error('Failed to load orders:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.pageHead}>
          <h2 className={styles.pageTitle}>📦 My Orders</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>Loading orders...</div>
      </div>
    );
  }

  const delivered  = orders.filter(o => o.status === 'Delivered').length;
  const inProgress = orders.length - delivered;

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.pageHead}>
        <div>
          <h2 className={styles.pageTitle}>📦 My Orders</h2>
          <p className={styles.pageSub}>
            {orders.length} total orders · {inProgress} in progress · {delivered} delivered
          </p>
        </div>
      </div>

      <div className={styles.bridgeNote}>
        🔒 All supplier communication is managed by BuildMart. Tap{' '}
        <strong>Contact Support</strong> on any order for assistance.
      </div>

      <div className={styles.orderList}>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
            No orders yet. Start shopping!
          </div>
        ) : (
          orders.map(o => <OrderCard key={o.id} o={o} />)
        )}
      </div>
    </div>
  );
}

export default Orders;
