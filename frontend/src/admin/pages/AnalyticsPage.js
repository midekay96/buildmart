import React from 'react';
import KpiCard from '../components/KpiCard';
import { topCategories } from '../adminData';
import styles from './Pages.module.css';

function AnalyticsPage() {
  return (
    <div>
      <div className={styles.kpiRow}>
        <KpiCard label="Total Revenue"    value="₦84.2M" change="+12%" color="teal"  />
        <KpiCard label="Orders (May)"     value="2,847"  change="+8%"  color="blue"  />
        <KpiCard label="Conversion Rate"  value="3.4%"   change="+0.6%"color="green" />
        <KpiCard label="Avg Order Value"  value="₦29.6K" change="+2%"  color="amber" />
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>Top Categories by Revenue</div>
        </div>
        {topCategories.map(cat => (
          <div key={cat.name} style={{ marginBottom: 14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:5 }}>
              <span style={{ color:'var(--admin-text)' }}>{cat.name}</span>
              <span style={{ color:'var(--admin-muted)', fontFamily:'monospace' }}>{cat.revenue}</span>
            </div>
            <div style={{ background:'var(--admin-border)', borderRadius:4, height:8 }}>
              <div style={{ background:cat.color, width:`${cat.pct}%`, height:'100%', borderRadius:4, transition:'width 0.5s' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsPage;
