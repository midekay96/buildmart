import React, { useState } from 'react';
import styles from './ProductCard.module.css';

function ProductCard({ product, onAddToCart }) {
  const [added,    setAdded]    = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 800);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imgArea} style={imgError ? { background: product.color } : {}}>
        {product.img && !imgError ? (
          <img
            src={product.img}
            alt={product.name}
            className={styles.img}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.iconFallback} style={{ background: product.color }}>
            <span className={styles.icon}>{product.icon}</span>
          </div>
        )}
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
        {product.supplier && (
          <div className={styles.supplierTag}>
            🏭 {product.supplier}
          </div>
        )}
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
