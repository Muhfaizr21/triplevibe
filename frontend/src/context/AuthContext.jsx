import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

const API_URL = 'http://localhost:5001/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync session from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('triplevibe_user');
    const token = localStorage.getItem('triplevibe_token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { data: null, error: { message: data.message || 'Login failed' } };
      }

      setUser(data.user);
      localStorage.setItem('triplevibe_user', JSON.stringify(data.user));
      localStorage.setItem('triplevibe_token', data.token);

      return { data: { user: data.user, profile: data.user }, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('triplevibe_user');
    localStorage.removeItem('triplevibe_token');
    return { error: null };
  };

  const userRole = user?.role || 'user';

  const value = {
    user,
    profile: user,
    loading,
    signIn,
    signOut,
    role: userRole,
    isAdmin: userRole === 'admin' || userRole === 'superadmin',
    isSuperAdmin: userRole === 'superadmin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
