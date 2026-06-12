import React, { useState } from 'react';
import styles from './CheckoutModal.module.css';
import { initiatePayment, verifyPayment, placeOrder } from '../services/api';

const IS_LIVE = Boolean(process.env.REACT_APP_API_URL);

const STEPS = ['Delivery', 'Payment', 'Confirm'];

function CheckoutModal({ cart, grand, vat, subtotal, onClose, onSuccess }) {
  const [step, setStep] = useState(0);
  const [payMethod, setPayMethod] = useState('card');
  const [cardForm, setCardForm] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [transferDone, setTransferDone] = useState(false);
  const [delivery,      setDelivery]      = useState({ name: '', phone: '', address: '', state: 'Lagos', note: '' });
  const [deliveryOpt,   setDeliveryOpt]   = useState('standard');
  const [loading,       setLoading]       = useState(false);
  const [paid,          setPaid]          = useState(false);
  const [refundAck,     setRefundAck]     = useState(false);

  const deliveryFee    = deliveryOpt === 'express' ? 15000 : 5000;
  const totalAmount    = grand + deliveryFee;

  const setCard = (k, v) => setCardForm(p => ({ ...p, [k]: v }));
  const setDel  = (k, v) => setDelivery(p => ({ ...p, [k]: v }));

  const formatCard   = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (val) => {
    const d = val.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      if (IS_LIVE) {
        // ── LIVE: use Paystack ────────────────────────────────────────────
        const initRes = await initiatePayment({
          amount:   totalAmount,
          email:    delivery.email || `customer_${Date.now()}@buildmart.ng`,
          metadata: {
            customerName: delivery.name,
            deliveryAddress: delivery.address,
            deliveryState: delivery.state,
            deliveryOption: deliveryOpt,
          }
        });

        if (!initRes.success) throw new Error('Payment initiation failed');

        // Load Paystack inline handler
        const PaystackPop = window.PaystackPop;
        if (!PaystackPop) {
          throw new Error('Paystack not loaded. Check your internet connection.');
        }

        const handler = PaystackPop.setup({
          key:       process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
          email:     delivery.email || `customer@buildmart.ng`,
          amount:    totalAmount * 100,  // kobo
          currency:  'NGN',
          ref:       initRes.reference,
          onSuccess: async (txn) => {
            const vRes = await verifyPayment(txn.reference);
            if (vRes.paid) {
              await placeOrder({
                items:             cart,
                delivery,
                deliveryOption:    deliveryOpt,
                total:             totalAmount,
                paymentReference:  txn.reference
              });
              setLoading(false);
              setPaid(true);
            } else {
              setLoading(false);
              alert('Payment verification failed. Please contact support.');
            }
          },
          onCancel: () => {
            setLoading(false);
          }
        });
        handler.openIframe();
      } else {
        // ── MOCK: simulate 2 second payment ──────────────────────────────
        await placeOrder({ items: cart, delivery, deliveryOption: deliveryOpt, total: totalAmount });
        setTimeout(() => { setLoading(false); setPaid(true); }, 2200);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setLoading(false);
      alert(err.message || 'Payment failed. Please try again.');
    }
  };

  if (paid) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.successScreen}>
            <div className={styles.successCircle}>✓</div>
            <h2 className={styles.successTitle}>Payment Successful!</h2>
            <p className={styles.successSub}>Your order <strong>#BM-{Math.floor(3000 + Math.random() * 999)}</strong> has been placed. You'll receive a confirmation SMS shortly.</p>
            <div className={styles.successMeta}>
              <div className={styles.metaRow}><span>Amount Paid</span><strong>₦{totalAmount.toLocaleString()}</strong></div>
              <div className={styles.metaRow}><span>Delivery to</span><strong>{delivery.state}</strong></div>
              <div className={styles.metaRow}><span>Est. Delivery</span><strong>2–4 business days</strong></div>
            </div>
            <button className={styles.doneBtn} onClick={onSuccess}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>Checkout</div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.stepper}>
          {STEPS.map((s, i) => (
            <div key={s} className={styles.stepWrap}>
              <div className={`${styles.stepDot} ${i <= step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <div className={`${styles.stepLabel} ${i === step ? styles.stepLabelActive : ''}`}>{s}</div>
              {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${i < step ? styles.stepLineDone : ''}`} />}
            </div>
          ))}
        </div>

        {/* STEP 0 — Delivery */}
        {step === 0 && (
          <div className={styles.body}>
            <div className={styles.sectionTitle}>📦 Delivery Details</div>
            <div className={styles.formGrid}>
              <label className={styles.fLabel}>Full Name
                <input className={styles.fInput} placeholder="Chidi Okeke" value={delivery.name} onChange={e => setDel('name', e.target.value)} />
              </label>
              <label className={styles.fLabel}>Phone Number
                <input className={styles.fInput} placeholder="08012345678" value={delivery.phone} onChange={e => setDel('phone', e.target.value)} />
              </label>
            </div>
            <label className={styles.fLabel}>Delivery Address
              <input className={styles.fInput} placeholder="12 Bode Thomas Street, Surulere" value={delivery.address} onChange={e => setDel('address', e.target.value)} />
            </label>
            <div className={styles.formGrid}>
              <label className={styles.fLabel}>State
                <select className={styles.fSelect} value={delivery.state} onChange={e => setDel('state', e.target.value)}>
                  {['Lagos','Abuja','Ogun','Oyo','Rivers','Kano','Delta','Anambra','Enugu','Edo'].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className={styles.fLabel}>Delivery Note (optional)
                <input className={styles.fInput} placeholder="Call before arriving" value={delivery.note} onChange={e => setDel('note', e.target.value)} />
              </label>
            </div>
            <div className={styles.deliveryOpts}>
              <div className={`${styles.delOpt} ${deliveryOpt === 'standard' ? styles.delOptActive : ''}`}
                onClick={() => setDeliveryOpt('standard')}>
                <div className={styles.delOptIcon}>🚚</div>
                <div>
                  <div className={styles.delOptTitle}>Standard Delivery</div>
                  <div className={styles.delOptSub}>2–4 business days</div>
                </div>
                <div className={styles.delOptPrice}>₦5,000</div>
              </div>
              <div className={`${styles.delOpt} ${deliveryOpt === 'express' ? styles.delOptActive : ''}`}
                onClick={() => setDeliveryOpt('express')}>
                <div className={styles.delOptIcon}>⚡</div>
                <div>
                  <div className={styles.delOptTitle}>Express Delivery</div>
                  <div className={styles.delOptSub}>Next business day</div>
                </div>
                <div className={styles.delOptPrice}>₦15,000</div>
              </div>
            </div>
            <button className={styles.nextBtn} disabled={!delivery.name || !delivery.phone || !delivery.address} onClick={() => setStep(1)}>
              Continue to Payment →
            </button>
          </div>
        )}

        {/* STEP 1 — Payment */}
        {step === 1 && (
          <div className={styles.body}>
            <div className={styles.sectionTitle}>💳 Choose Payment Method</div>
            <div className={styles.methodTabs}>
              {[
                { id: 'card',     icon: '💳', name: 'Debit / Credit Card', sub: 'Visa, Mastercard, Verve' },
                { id: 'transfer', icon: '🏦', name: 'Bank Transfer',       sub: 'Pay via direct transfer' },
                { id: 'ussd',     icon: '📱', name: 'USSD',                sub: 'Dial code to pay'        },
              ].map(m => (
                <button key={m.id} className={`${styles.methodTab} ${payMethod === m.id ? styles.methodTabActive : ''}`} onClick={() => setPayMethod(m.id)}>
                  <span className={styles.methodIcon}>{m.icon}</span>
                  <div><div className={styles.methodName}>{m.name}</div><div className={styles.methodSub}>{m.sub}</div></div>
                </button>
              ))}
            </div>

            {payMethod === 'card' && (
              <div className={styles.payPanel}>
                <div className={styles.cardPreview}>
                  <div className={styles.cardPreviewTop}><span className={styles.cardChip}>▬</span><span>💳</span></div>
                  <div className={styles.cardNumber}>{cardForm.number || '•••• •••• •••• ••••'}</div>
                  <div className={styles.cardBottom}>
                    <div><div className={styles.cardFieldLabel}>CARD HOLDER</div><div className={styles.cardFieldVal}>{cardForm.name || 'FULL NAME'}</div></div>
                    <div><div className={styles.cardFieldLabel}>EXPIRES</div><div className={styles.cardFieldVal}>{cardForm.expiry || 'MM/YY'}</div></div>
                  </div>
                </div>
                <div className={styles.formGrid}>
                  <label className={`${styles.fLabel} ${styles.spanFull}`}>Card Number
                    <input className={styles.fInput} placeholder="0000 0000 0000 0000" value={cardForm.number} onChange={e => setCard('number', formatCard(e.target.value))} maxLength={19} />
                  </label>
                  <label className={`${styles.fLabel} ${styles.spanFull}`}>Name on Card
                    <input className={styles.fInput} placeholder="CHIDI OKEKE" value={cardForm.name} onChange={e => setCard('name', e.target.value.toUpperCase())} />
                  </label>
                  <label className={styles.fLabel}>Expiry Date
                    <input className={styles.fInput} placeholder="MM/YY" value={cardForm.expiry} onChange={e => setCard('expiry', formatExpiry(e.target.value))} maxLength={5} />
                  </label>
                  <label className={styles.fLabel}>CVV
                    <input className={styles.fInput} placeholder="•••" type="password" value={cardForm.cvv} onChange={e => setCard('cvv', e.target.value.replace(/\D/g,'').slice(0,4))} />
                  </label>
                </div>
                <div className={styles.secureBadge}>🔒 256-bit SSL encryption · Your card details are never stored</div>
              </div>
            )}

            {payMethod === 'transfer' && (
              <div className={styles.payPanel}>
                <div className={styles.transferInfo}>
                  <div className={styles.transferBankName}>BuildMart Payments Ltd</div>
                  <div className={styles.transferRow}><span className={styles.transferLabel}>Bank</span><span className={styles.transferVal}>Zenith Bank</span></div>
                  <div className={styles.transferRow}>
                    <span className={styles.transferLabel}>Account Number</span>
                    <span className={styles.transferVal}><strong>2048 109 345</strong>
                      <button className={styles.copyBtn} onClick={() => navigator.clipboard?.writeText('2048109345')}>Copy</button>
                    </span>
                  </div>
                  <div className={styles.transferRow}><span className={styles.transferLabel}>Amount</span><span className={styles.transferAmt}>₦{totalAmount.toLocaleString()}</span></div>
                  <div className={styles.transferRow}><span className={styles.transferLabel}>Reference</span><span className={styles.transferVal}><strong>BM-{Date.now().toString().slice(-8)}</strong></span></div>
                </div>
                <div className={styles.transferNote}>⚠️ Use the reference code as your narration so we can identify your payment.</div>
                <label className={styles.checkRow}>
                  <input type="checkbox" checked={transferDone} onChange={e => setTransferDone(e.target.checked)} style={{ accentColor: 'var(--t400)' }} />
                  <span>I have completed the transfer</span>
                </label>
              </div>
            )}

            {payMethod === 'ussd' && (
              <div className={styles.payPanel}>
                <div className={styles.ussdGrid}>
                  {[
                    { bank: 'GTBank',       code: `*737*1*${totalAmount}*10#` },
                    { bank: 'First Bank',   code: `*894*${totalAmount}#`      },
                    { bank: 'Access Bank',  code: `*901*${totalAmount}#`      },
                    { bank: 'Zenith Bank',  code: `*966*${totalAmount}#`      },
                    { bank: 'UBA',          code: `*919*3*${totalAmount}#`    },
                    { bank: 'Sterling Bank',code: `*822*${totalAmount}#`      },
                  ].map(u => (
                    <div key={u.bank} className={styles.ussdCard}>
                      <div className={styles.ussdBank}>{u.bank}</div>
                      <div className={styles.ussdCode}>{u.code}</div>
                    </div>
                  ))}
                </div>
                <div className={styles.transferNote}>📞 Dial the code for your bank from your registered mobile number.</div>
              </div>
            )}


            <div className={styles.navRow}>
              <button className={styles.backBtn} onClick={() => setStep(0)}>← Back</button>
              <button className={styles.nextBtn} disabled={payMethod === 'transfer' && !transferDone} onClick={() => setStep(2)}>
                Review Order →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — Confirm */}
        {step === 2 && (
          <div className={styles.body}>
            <div className={styles.sectionTitle}>🧾 Order Summary</div>
            <div className={styles.orderItems}>
              {cart.map(p => (
                <div key={p.id} className={styles.orderItem}>
                  <span className={styles.orderItemIcon} style={{ background: p.color }}>{p.icon}</span>
                  <span className={styles.orderItemName}>{p.name} × {p.qty}</span>
                  <span className={styles.orderItemPrice}>₦{(p.price * p.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className={styles.confirmMeta}>
              <div className={styles.confirmRow}><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
              <div className={styles.confirmRow}><span>VAT (7.5%)</span><span>₦{vat.toLocaleString()}</span></div>
              <div className={styles.confirmRow}>
                <span>{deliveryOpt === 'express' ? '⚡ Express Delivery' : '🚚 Standard Delivery'}</span>
                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>
              <div className={styles.confirmRow}><span>Payment</span>
                <span className={styles.methodBadge}>
                  {payMethod === 'card' ? '💳 Card' : payMethod === 'transfer' ? '🏦 Transfer' : '📱 USSD'}
                </span>
              </div>
              <div className={styles.confirmRow}><span>Deliver to</span><span>{delivery.address}, {delivery.state}</span></div>
            </div>
            <div className={styles.grandTotal}><span>Total</span><span>₦{totalAmount.toLocaleString()}</span></div>

            {/* No-Refund Policy acknowledgment */}
            <div className={styles.refundPolicy}>
              <div className={styles.refundPolicyTitle}>⚠️ No-Refund Policy</div>
              <div className={styles.refundPolicyText}>
                Once your order has been confirmed and supplier processing begins,{' '}
                <strong>no refunds will be issued</strong>. All disputes must be raised
                through BuildMart Support — not directly with the supplier.
              </div>
              <label className={styles.refundAckRow}>
                <input
                  type="checkbox"
                  checked={refundAck}
                  onChange={e => setRefundAck(e.target.checked)}
                  style={{ accentColor: 'var(--t400)' }}
                />
                <span>I understand and agree to the no-refund policy once order processing begins</span>
              </label>
            </div>

            <div className={styles.navRow}>
              <button className={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
              <button className={styles.payBtn} onClick={handlePay} disabled={loading || !refundAck}>
                {loading ? <span className={styles.spinner} /> : `Pay ₦${totalAmount.toLocaleString()}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;