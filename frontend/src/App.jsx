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
import { ThemeProvider } from './context/ThemeContext';

const APP_PAGES = new Set(['home', 'expertise', 'projects', 'process', 'contact', 'login', 'superadmin']);

function AppContent() {
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, ''); // Ambil path dari URL ('projects', 'contact')
    const validPage = path || 'home'; // Jika '/' maka jadi 'home'
    return APP_PAGES.has(validPage) ? validPage : 'home';
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
    const path = resolvedPage === 'home' ? '/' : `/${resolvedPage}`;
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    localStorage.setItem('triplevibe_last_page', resolvedPage);

    // Track page view
    fetch('http://localhost:5001/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: path }),
    }).catch(() => {});
  }, [resolvedPage]);

  // Handle ketika user tekan tombol Back/Forward di Browser
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/|\/$/g, '');
      const validPage = path || 'home';
      setCurrentPage(APP_PAGES.has(validPage) ? validPage : 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
