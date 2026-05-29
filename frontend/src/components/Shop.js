import React, { useState } from 'react';
import { products, categories } from '../data/products';
import ProductCard from './ProductCard';
import styles from './Shop.module.css';

function Shop({ searchQuery, categoryFilter, setCategoryFilter, addToCart }) {
  const [activeCategory, setActiveCategory] = useState('');

  const handleCatClick = (value) => {
    setActiveCategory(value);
    setCategoryFilter(value);
  };

  const filtered = products.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
    const cat = categoryFilter || activeCategory;
    const matchCat = !cat || p.cat === cat;
    return matchQ && matchCat;
  });

  return (
    <div className={styles.main}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sideSection}>
          <div className={styles.sideTitle}>Categories</div>
          {categories.map(c => (
            <div
              key={c.value}
              className={`${styles.catItem} ${activeCategory === c.value ? styles.active : ''}`}
              onClick={() => handleCatClick(c.value)}
            >
              <span>{c.label}</span>
              <span className={styles.catCount}>{c.count}</span>
            </div>
          ))}
        </div>

        <div className={styles.sideSection}>
          <div className={styles.sideTitle}>Brand</div>
          {['Dangote', 'BUA', 'Lafarge', 'Iron Flex', 'RomaTile'].map(b => (
            <label key={b} className={styles.checkRow}>
              <input type="checkbox" defaultChecked={['Dangote', 'BUA'].includes(b)} />
              <span>{b}</span>
            </label>
          ))}
        </div>

        <div className={styles.sideSection}>
          <div className={styles.sideTitle}>Availability</div>
          {['In Stock', 'Pre-order', 'Lagos Warehouse', 'Abuja Warehouse'].map(a => (
            <label key={a} className={styles.checkRow}>
              <input type="checkbox" defaultChecked={a === 'In Stock'} />
              <span>{a}</span>
            </label>
          ))}
        </div>
      </aside>

      {/* Grid */}
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <span className={styles.contentTitle}>
              {categories.find(c => c.value === activeCategory)?.label || 'All Materials'}
            </span>
            <span className={styles.contentMeta}> — {filtered.length} products</span>
          </div>
          <select className={styles.sortSelect}>
            <option>Sort: Most Popular</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>
        <div className={styles.grid}>
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop;
