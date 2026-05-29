import React, { useState } from 'react';
import AdminLayout       from './components/AdminLayout';
import DashboardPage     from './pages/DashboardPage';
import AnalyticsPage     from './pages/AnalyticsPage';
import OrdersPage        from './pages/OrdersPage';
import ProductsPage      from './pages/ProductsPage';
import AddProductPage    from './pages/AddProductPage';
import SuppliersPage     from './pages/SuppliersPage';
import CustomersPage     from './pages/CustomersPage';
import PaymentsPage      from './pages/PaymentsPage';
import NotificationsPage from './pages/NotificationsPage';
import ReportsPage       from './pages/ReportsPage';
import SettingsPage      from './pages/SettingsPage';

function AdminApp({ onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':     return <DashboardPage setActivePage={setActivePage} />;
      case 'analytics':     return <AnalyticsPage />;
      case 'orders':        return <OrdersPage />;
      case 'products':      return <ProductsPage setActivePage={setActivePage} />;
      case 'products-add':  return <AddProductPage setActivePage={setActivePage} />;
      case 'suppliers':     return <SuppliersPage />;
      case 'customers':     return <CustomersPage />;
      case 'payments':      return <PaymentsPage />;
      case 'notifications': return <NotificationsPage />;
      case 'reports':       return <ReportsPage />;
      case 'settings':      return <SettingsPage />;
      default:              return <DashboardPage setActivePage={setActivePage} />;
    }
  };

  return (
    <AdminLayout activePage={activePage} setActivePage={setActivePage} onLogout={onLogout}>
      {renderPage()}
    </AdminLayout>
  );
}

export default AdminApp;
