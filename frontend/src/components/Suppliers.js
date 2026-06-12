import React, { useState } from 'react';
import { suppliers as allSuppliers } from '../data/products';
import styles from './Suppliers.module.css';

const SUPPORT_EMAIL    = process.env.REACT_APP_SUPPORT_EMAIL    || 'support@buildmart.ng';
const SUPPORT_WHATSAPP = process.env.REACT_APP_SUPPORT_WHATSAPP || '+2348012345678';

// ── Category grouping ─────────────────────────────────────────────────────────
const CAT_ORDER = [
  'Cement & Concrete', 'Cement', 'Iron & Steel', 'Tiles & Flooring',
  'Timber & Wood', 'Roofing', 'Sand & Aggregates', 'Blocks & Masonry',
];

// Star rating display
function Stars({ rating }) {
  const n = parseFloat(rating) || 0;
  return (
    <span className={styles.stars}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(n) ? '#F59E0B' : '#d1d5db' }}>★</span>
      ))}
      <span className={styles.ratingVal}>{rating}</span>
    </span>
  );
}

// ── Single supplier card ───────────────────────────────────────────────────────
function SupplierCard({ s, index }) {
  const waMsg  = encodeURIComponent(`Hi BuildMart, I'd like to enquire about ${s.name}`);
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Supplier Enquiry – ${s.name}`)}`;

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.supplierNum}>{String(index + 1).padStart(2, '0')}</div>
        <div className={styles.iconBox}>{s.icon || '🏭'}</div>
        <div className={styles.supplierInfo}>
          <div className={styles.supplierName}>{s.name}</div>
          <div className={styles.supplierCat}>{s.cat}</div>
        </div>
        <div className={styles.verifiedBadge}>✓ Verified</div>
      </div>

      <div className={styles.cardMeta}>
        <div className={styles.metaItem}>
          <span className={styles.metaIcon}>📍</span>
          <span>{s.loc || s.location || 'Nigeria'}</span>
        </div>
        <div className={styles.metaItem}>
          <Stars rating={s.rating} />
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaIcon}>📦</span>
          <span>{s.orders || s.products || '--'} orders fulfilled</span>
        </div>
      </div>

      <div className={styles.privacyNote}>
        🔒 Contact details are kept private — BuildMart is your point of contact
      </div>

      <div className={styles.cardActions}>
        <a href={mailto} className={styles.enquireEmailBtn}>
          📧 Enquire via Email
        </a>
        <a
          href={`https://wa.me/${SUPPORT_WHATSAPP.replace(/\D/g,'')}?text=${waMsg}`}
          target="_blank"
          rel="noreferrer"
          className={styles.enquireWaBtn}
        >
          💬 WhatsApp BuildMart
        </a>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function Suppliers() {
  const [filter, setFilter] = useState('');

  const filtered = filter
    ? allSuppliers.filter(s => (s.cat || '').toLowerCase().includes(filter.toLowerCase()) ||
                               (s.name || '').toLowerCase().includes(filter.toLowerCase()))
    : allSuppliers;

  const cats = ['All', ...new Set(allSuppliers.map(s => s.cat).filter(Boolean))];

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.pageHead}>
        <div>
          <h2 className={styles.pageTitle}>🏭 Verified Suppliers</h2>
          <p className={styles.pageSub}>
            {allSuppliers.length} verified suppliers · All enquiries handled by BuildMart
          </p>
        </div>
      </div>

      {/* BuildMart bridge banner */}
      <div className={styles.bridgeBanner}>
        <div className={styles.bridgeLeft}>
          <div className={styles.bridgeLock}>🔒</div>
          <div>
            <div className={styles.bridgeTitle}>All enquiries go through BuildMart</div>
            <div className={styles.bridgeSub}>
              Supplier contact details are kept private to protect all parties.
              We negotiate on your behalf and ensure quality delivery.
            </div>
          </div>
        </div>
        <div className={styles.bridgeContacts}>
          <a href={`mailto:${SUPPORT_EMAIL}`} className={styles.bridgeLink}>
            📧 {SUPPORT_EMAIL}
          </a>
          <a
            href={`https://wa.me/${SUPPORT_WHATSAPP.replace(/\D/g,'')}`}
            target="_blank" rel="noreferrer"
            className={styles.bridgeLink}
          >
            💬 WhatsApp Us
          </a>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className={styles.filterTabs}>
        {cats.map(c => (
          <button
            key={c}
            className={`${styles.filterTab} ${(filter === '' && c === 'All') || filter === c ? styles.filterTabOn : ''}`}
            onClick={() => setFilter(c === 'All' ? '' : c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Supplier grid */}
      <div className={styles.grid}>
        {filtered.map((s, i) => (
          <SupplierCard key={i} s={s} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={styles.empty}>No suppliers found for "{filter}".</div>
      )}

      <div className={styles.footerNote}>
        🔒 Supplier phone numbers, emails, and direct contacts are never shared with customers.
        BuildMart handles all communication and ensures fair, transparent transactions.
      </div>
    </div>
  );
}

export default Suppliers;
