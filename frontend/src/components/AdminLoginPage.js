import React, { useState } from 'react';
import { adminLogin } from '../services/api';

const styles = {
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10000, fontFamily:"'DM Sans', sans-serif" },
  modal:   { background:'#161B22', border:'1px solid #30363D', borderRadius:16, padding:32, width:'100%', maxWidth:400, margin:16, boxShadow:'0 24px 64px rgba(0,0,0,0.6)' },
  header:  { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 },
  logoRow: { display:'flex', alignItems:'center', gap:10 },
  logoMark:{ width:36, height:36, background:'#1D9E75', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 },
  logoText:{ fontFamily:"'Syne', sans-serif", fontSize:15, fontWeight:800, color:'#E6EDF3' },
  logoSub: { fontSize:10, color:'#8B949E', textTransform:'uppercase', letterSpacing:1 },
  closeBtn:{ background:'none', border:'1px solid #30363D', borderRadius:6, color:'#8B949E', width:28, height:28, cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center' },
  title:   { fontFamily:"'Syne', sans-serif", fontSize:20, fontWeight:800, color:'#E6EDF3', margin:'0 0 4px' },
  sub:     { fontSize:13, color:'#8B949E', margin:'0 0 24px' },
  form:    { display:'flex', flexDirection:'column', gap:16, marginBottom:20 },
  label:   { display:'flex', flexDirection:'column', gap:6, fontSize:12, fontWeight:500, color:'#8B949E' },
  input:   { background:'#1C2330', border:'1px solid #30363D', borderRadius:8, padding:'10px 14px', fontSize:14, fontFamily:"'DM Sans', sans-serif", color:'#E6EDF3', outline:'none' },
  error:   { background:'rgba(226,75,74,0.12)', border:'1px solid rgba(226,75,74,0.3)', borderRadius:8, padding:'10px 14px', fontSize:12, color:'#F08080' },
  btn:     { background:'#1D9E75', border:'none', borderRadius:10, padding:12, fontSize:14, fontWeight:600, color:'white', cursor:'pointer', fontFamily:"'DM Sans', sans-serif", marginTop:4 },
  note:    { textAlign:'center', fontSize:11, color:'#484F58', marginTop:4 },
};

function AdminLoginPage({ onLogin, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await adminLogin(username, password);
      onLogin(result.user || {});
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.logoRow}>
            <div style={styles.logoMark}>🏗</div>
            <div>
              <div style={styles.logoText}>BuildMart</div>
              <div style={styles.logoSub}>Admin Access</div>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <h2 style={styles.title}>Sign in to Admin Panel</h2>
        <p style={styles.sub}>Authorised personnel only</p>

        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.label}>
            Username
            <input style={styles.input} type="text" placeholder="Username"
              value={username} onChange={e => setUsername(e.target.value)}
              autoFocus autoComplete="username" required />
          </label>
          <label style={styles.label}>
            Password
            <input style={styles.input} type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="current-password" required />
          </label>
          {error && <div style={styles.error}>{error}</div>}
          <button style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Access Admin Panel →'}
          </button>
        </form>

        <div style={styles.note}>🔒 Secure access · All sessions are logged</div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
