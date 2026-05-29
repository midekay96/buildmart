import React, { useState } from 'react';
import CheckoutModal from './CheckoutModal';
import styles from './Cart.module.css';

function Cart({ cart, changeQty, setActiveTab }) {
  const [showCheckout, setShowCheckout] = useState(false);

  const subtotal = cart.reduce((s, p) => s + p.price * p.qty, 0);
  const vat = Math.round(subtotal * 0.075);
  const grand = subtotal + vat;

  const handleSuccess = () => {
    setShowCheckout(false);
    setActiveTab('orders');
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🛒</div>
          <div className={styles.emptyText}>Your cart is empty</div>
          <p className={styles.emptySub}>Browse materials and add items to get started</p>
          <button className={styles.browseBtn} onClick={() => setActiveTab('shop')}>
            Browse Materials
          </button>
        </div>
      ) : (
        <>
          <div className={styles.items}>
            {cart.map(p => (
              <div key={p.id} className={styles.item}>
                <div className={styles.itemImg} style={{ background: p.color }}>
                  <span>{p.icon}</span>
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{p.name}</div>
                  <div className={styles.itemUnit}>{p.unit}</div>
                </div>
                <div className={styles.qtyControls}>
                  <button onClick={() => changeQty(p.id, -1)}>−</button>
                  <span>{p.qty}</span>
                  <button onClick={() => changeQty(p.id, 1)}>+</button>
                </div>
                <div className={styles.itemTotal}>
                  <div className={styles.itemPrice}>₦{(p.price * p.qty).toLocaleString()}</div>
                  <div className={styles.itemEach}>₦{p.price.toLocaleString()} each</div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <div className={styles.summRow}><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
            <div className={styles.summRow}><span>Delivery (Lagos)</span><span className={styles.free}>Free</span></div>
            <div className={styles.summRow}><span>VAT (7.5%)</span><span>₦{vat.toLocaleString()}</span></div>
            <div className={styles.grandRow}>
              <span>Total</span>
              <span className={styles.grandVal}>₦{grand.toLocaleString()}</span>
            </div>
          </div>

          <button className={styles.checkoutBtn} onClick={() => setShowCheckout(true)}>
            🔒 Proceed to Checkout — ₦{grand.toLocaleString()}
          </button>
          <p className={styles.secureNote}>🛡 Secured by SSL · Card, Transfer, USSD & BNPL available</p>
        </>
      )}

      {showCheckout && (
        <CheckoutModal
          cart={cart}
          subtotal={subtotal}
          vat={vat}
          grand={grand}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default Cart;