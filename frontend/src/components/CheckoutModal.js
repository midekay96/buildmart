import React, { useState } from 'react';
import styles from './CheckoutModal.module.css';

const STEPS = ['Delivery', 'Payment', 'Confirm'];

function CheckoutModal({ cart, grand, vat, subtotal, onClose, onSuccess }) {
  const [step, setStep] = useState(0);
  const [payMethod, setPayMethod] = useState('card');
  const [cardForm, setCardForm] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [transferDone, setTransferDone] = useState(false);
  const [delivery, setDelivery] = useState({ name: '', phone: '', address: '', state: 'Lagos', note: '' });
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const setCard = (k, v) => setCardForm(p => ({ ...p, [k]: v }));
  const setDel  = (k, v) => setDelivery(p => ({ ...p, [k]: v }));

  const formatCard   = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (val) => {
    const d = val.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  };

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setPaid(true); }, 2200);
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
              <div className={styles.metaRow}><span>Amount Paid</span><strong>₦{grand.toLocaleString()}</strong></div>
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
              <div className={`${styles.delOpt} ${styles.delOptActive}`}>
                <div className={styles.delOptIcon}>🚚</div>
                <div><div className={styles.delOptTitle}>Standard Delivery</div><div className={styles.delOptSub}>2–4 business days</div></div>
                <div className={styles.delOptPrice}>Free</div>
              </div>
              <div className={styles.delOpt}>
                <div className={styles.delOptIcon}>⚡</div>
                <div><div className={styles.delOptTitle}>Express Delivery</div><div className={styles.delOptSub}>Next business day</div></div>
                <div className={styles.delOptPrice}>₦25,000</div>
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
                { id: 'bnpl',     icon: '📅', name: 'Buy Now Pay Later',   sub: 'Carbon / CredPal'        },
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
                  <div className={styles.transferRow}><span className={styles.transferLabel}>Amount</span><span className={styles.transferAmt}>₦{grand.toLocaleString()}</span></div>
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
                    { bank: 'GTBank',       code: `*737*1*${grand}*10#` },
                    { bank: 'First Bank',   code: `*894*${grand}#`      },
                    { bank: 'Access Bank',  code: `*901*${grand}#`      },
                    { bank: 'Zenith Bank',  code: `*966*${grand}#`      },
                    { bank: 'UBA',          code: `*919*3*${grand}#`    },
                    { bank: 'Sterling Bank',code: `*822*${grand}#`      },
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

            {payMethod === 'bnpl' && (
              <div className={styles.payPanel}>
                <div className={styles.bnplOptions}>
                  {[
                    { name: 'Carbon (Paylater)', monthly: Math.round(grand / 3),  months: 3,  icon: '🟢' },
                    { name: 'CredPal',           monthly: Math.round(grand / 6),  months: 6,  icon: '🔵' },
                    { name: 'Paga Credit',       monthly: Math.round(grand / 12), months: 12, icon: '🟣' },
                  ].map(b => (
                    <div key={b.name} className={styles.bnplCard}>
                      <span className={styles.bnplIcon}>{b.icon}</span>
                      <div className={styles.bnplInfo}>
                        <div className={styles.bnplName}>{b.name}</div>
                        <div className={styles.bnplTerms}>{b.months} monthly payments of <strong>₦{b.monthly.toLocaleString()}</strong></div>
                      </div>
                      <button className={styles.bnplSelect}>Select</button>
                    </div>
                  ))}
                </div>
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
              <div className={styles.confirmRow}><span>Delivery</span><span className={styles.free}>Free</span></div>
              <div className={styles.confirmRow}><span>VAT (7.5%)</span><span>₦{vat.toLocaleString()}</span></div>
              <div className={styles.confirmRow}><span>Payment</span>
                <span className={styles.methodBadge}>
                  {payMethod === 'card' ? '💳 Card' : payMethod === 'transfer' ? '🏦 Transfer' : payMethod === 'ussd' ? '📱 USSD' : '📅 BNPL'}
                </span>
              </div>
              <div className={styles.confirmRow}><span>Deliver to</span><span>{delivery.address}, {delivery.state}</span></div>
            </div>
            <div className={styles.grandTotal}><span>Total</span><span>₦{grand.toLocaleString()}</span></div>
            <div className={styles.navRow}>
              <button className={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
              <button className={styles.payBtn} onClick={handlePay} disabled={loading}>
                {loading ? <span className={styles.spinner} /> : `Pay ₦${grand.toLocaleString()}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;