/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (uid) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

      if (error) throw error;

      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      setProfile(null);
      return null;
    }
  }, []);

  const syncSession = useCallback(async (session) => {
    if (!session?.user) {
      setUser(null);
      setProfile(null);
      return;
    }

    setUser(session.user);
    await fetchProfile(session.user.id);
  }, [fetchProfile]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await syncSession(session);
      setLoading(false);
    });

    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        await syncSession(session);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    return () => subscription.unsubscribe();
  }, [syncSession]);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { data, error };

    const nextProfile = data.user ? await fetchProfile(data.user.id) : null;
    return { data: { ...data, profile: nextProfile }, error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    return { error };
  };

  const userRole = profile?.role || user?.user_metadata?.role || 'user';

  const value = {
    user,
    profile,
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
