import React, { useState } from 'react';
import styles from './ProductCard.module.css';

function ProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 800);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imgArea} style={{ background: product.color }}>
        <span className={styles.icon}>{product.icon}</span>
        {product.badge && (
          <span className={`${styles.badge} ${styles[`badge_${product.badge}`]}`}>
            {product.badge}
          </span>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.brand}>{product.brand}</div>
        <div className={styles.name}>{product.name}</div>
        <div className={styles.unit}>{product.unit}</div>
        <div className={styles.footer}>
          <div>
            <div className={styles.price}>₦{product.price.toLocaleString()}</div>
            {product.oldPrice && (
              <div className={styles.oldPrice}>₦{product.oldPrice.toLocaleString()}</div>
            )}
          </div>
          <button
            className={`${styles.addBtn} ${added ? styles.added : ''}`}
            onClick={handleAdd}
          >
            {added ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
