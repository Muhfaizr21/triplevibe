import React, { useState, useEffect } from 'react';
import Home from './Home';
import Expertise from './Expertise';
import Projects from './Projects';
import Process from './Process';
import Contact from './Contact';
import Navbar from './components/layout/Navbar';
import LoginForm from './components/auth/LoginForm';
import SuperAdminDashboard from './pages/admin/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

const APP_PAGES = new Set(['home', 'expertise', 'projects', 'process', 'contact', 'login', 'superadmin']);

function AppContent() {
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('triplevibe_last_page') || 'home';
    return APP_PAGES.has(savedPage) ? savedPage : 'home';
  });

  const { user, isAdmin, loading } = useAuth();
  const resolvedPage =
    currentPage === 'superadmin' && !user
      ? 'login'
      : currentPage === 'superadmin' && user && !isAdmin
        ? 'home'
        : user && isAdmin && currentPage === 'login'
          ? 'superadmin'
          : currentPage;

  useEffect(() => {
    localStorage.setItem('triplevibe_last_page', resolvedPage);
  }, [resolvedPage]);

  if (loading) return null;

  const renderPage = () => {
    switch (resolvedPage) {
      case 'home': return <Home onPageChange={setCurrentPage} />;
      case 'expertise': return <Expertise onPageChange={setCurrentPage} />;
      case 'projects': return <Projects />;
      case 'process': return <Process />;
      case 'contact': return <Contact onPageChange={setCurrentPage} />;
      case 'login': return <LoginForm onLoginSuccess={(data) => setCurrentPage(data?.profile?.role === 'admin' || data?.profile?.role === 'superadmin' ? 'superadmin' : 'home')} />;
      case 'superadmin':
        if (!isAdmin) return null;
        return <SuperAdminDashboard onPageChange={setCurrentPage} />;
      default: return <Home onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-mn-surface font-manrope">
      {resolvedPage !== 'superadmin' && (
        <Navbar currentPage={resolvedPage} onPageChange={setCurrentPage} />
      )}
      {renderPage()}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
