import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './ThemeContext';
import AdminApp        from './admin/AdminApp';
import AdminLoginPage  from './components/AdminLoginPage';
import Navbar          from './components/Navbar';
import Hero            from './components/Hero';
import FeatureStrip    from './components/FeatureStrip';
import SearchBar       from './components/SearchBar';
import Shop            from './components/Shop';
import Estimator       from './components/Estimator';
import Cart            from './components/Cart';
import Orders          from './components/Orders';
import Suppliers       from './components/Suppliers';
import { adminLogout } from './services/api';

function AppInner() {
  const [adminLoggedIn,  setAdminLoggedIn]  = useState(
    () => sessionStorage.getItem('bm_admin_auth') === 'true'
  );
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [activeTab,      setActiveTab]      = useState('shop');
  const [cart,           setCart]           = useState([]);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Secret URL hash trigger: navigate to /#admin to open login
  useEffect(() => {
    const check = () => {
      if (window.location.hash === '#admin') {
        // Immediately clear the hash so it doesn't stay in address bar
        window.history.replaceState(
          null, '',
          window.location.pathname + window.location.search
        );
        if (!adminLoggedIn) setShowAdminLogin(true);
      }
    };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, [adminLoggedIn]);

  const handleAdminLogin = (user) => {
    sessionStorage.setItem('bm_admin_auth', 'true');
    setAdminLoggedIn(true);
    setShowAdminLogin(false);
  };

  const handleAdminLogout = () => {
    adminLogout();
    sessionStorage.removeItem('bm_admin_auth');
    setAdminLoggedIn(false);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(x => x.id === product.id);
      if (existing) {
        return prev.map(x => x.id === product.id ? { ...x, qty: x.qty + 1 } : x);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const changeQty = (id, delta) => {
    setCart(prev => {
      const updated = prev.map(x => x.id === id ? { ...x, qty: x.qty + delta } : x);
      return updated.filter(x => x.qty > 0);
    });
  };

  // Admin portal — full-screen, replaces storefront
  if (adminLoggedIn) {
    return <AdminApp onLogout={handleAdminLogout} />;
  }

  return (
    <>
      {showAdminLogin && (
        <AdminLoginPage
          onLogin={handleAdminLogin}
          onClose={() => setShowAdminLogin(false)}
        />
      )}

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} cartCount={cartCount} />

      {activeTab === 'shop' && (
        <>
          <Hero setActiveTab={setActiveTab} />
          <FeatureStrip />
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
          <Shop
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            addToCart={addToCart}
          />
        </>
      )}
      {activeTab === 'estimator' && <Estimator />}
      {activeTab === 'cart'      && <Cart cart={cart} changeQty={changeQty} setActiveTab={setActiveTab} />}
      {activeTab === 'orders'    && <Orders />}
      {activeTab === 'suppliers' && <Suppliers />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

export default App;
