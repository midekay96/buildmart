import React, { useState } from 'react';
import styles from './Pages.module.css';

const REPORTS = [
  {
    id: 'revenue',
    title: 'Revenue Report',
    description: 'Monthly and annual revenue breakdown by category, product, and region.',
    icon: '₦',
    color: '#1D9E75',
    lastGenerated: 'Today, 08:30 AM',
    format: 'PDF / Excel',
  },
  {
    id: 'orders',
    title: 'Orders Report',
    description: 'Order volume, fulfilment rate, cancellations, and delivery performance.',
    icon: '⊡',
    color: '#3B82F6',
    lastGenerated: 'Yesterday, 11:00 PM',
    format: 'PDF / CSV',
  },
  {
    id: 'inventory',
    title: 'Inventory Report',
    description: 'Stock levels, low-stock alerts, and product turnover rates.',
    icon: '⊞',
    color: '#F59E0B',
    lastGenerated: '23 May 2026',
    format: 'Excel / CSV',
  },
  {
    id: 'customers',
    title: 'Customer Report',
    description: 'New registrations, churn rate, top buyers, and lifetime value analysis.',
    icon: '◎',
    color: '#8B5CF6',
    lastGenerated: '20 May 2026',
    format: 'PDF / Excel',
  },
  {
    id: 'suppliers',
    title: 'Supplier Report',
    description: 'Approved/pending suppliers, product listings, and compliance status.',
    icon: '⊙',
    color: '#EC4899',
    lastGenerated: '18 May 2026',
    format: 'PDF',
  },
  {
    id: 'payments',
    title: 'Payments & Reconciliation',
    description: 'Transaction logs, failed payments, refund requests, and reconciliation summary.',
    icon: '◈',
    color: '#14B8A6',
    lastGenerated: 'Today, 06:00 AM',
    format: 'PDF / CSV',
  },
];

function ReportsPage() {
  const [generating, setGenerating] = useState(null);

  const handleGenerate = (id) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      alert(`Report "${REPORTS.find(r => r.id === id)?.title}" would be downloaded here when backend is connected.`);
    }, 1800);
  };

  return (
    <div>
      <div className={styles.tableCard} style={{ marginBottom: 24 }}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>Generate & Download Reports</div>
          <div style={{ fontSize: 12, color: 'var(--admin-muted)' }}>
            Reports are generated live from the current dataset.
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {REPORTS.map(report => (
          <div key={report.id} className={styles.reportCard}>
            <div className={styles.reportCardTop}>
              <div className={styles.reportIcon} style={{ background: report.color + '22', color: report.color }}>
                {report.icon}
              </div>
              <div className={styles.reportMeta}>
                <div className={styles.reportFormat}>{report.format}</div>
              </div>
            </div>
            <div className={styles.reportTitle}>{report.title}</div>
            <div className={styles.reportDesc}>{report.description}</div>
            <div className={styles.reportFooter}>
              <span className={styles.reportDate}>Last: {report.lastGenerated}</span>
              <button
                className={styles.reportBtn}
                onClick={() => handleGenerate(report.id)}
                disabled={generating === report.id}
                style={{ borderColor: report.color, color: report.color }}
              >
                {generating === report.id ? 'Generating…' : '⬇ Download'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportsPage;
