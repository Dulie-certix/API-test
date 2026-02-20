import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '@/components/Layout';
import Dashboard from './Dashboard';
import ProductsPage from './Products/ProductsPage';
import UsersPage from './User/UsersPage';
import { AuthUser } from '@/types/auth';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const user: AuthUser = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard searchQuery={searchQuery} />;
      case 'products':
        return <ProductsPage />;
      case 'users':
        return <UsersPage />;
      default:
        return <Dashboard searchQuery={searchQuery} />;
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      user={user}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default DashboardPage;