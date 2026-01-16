
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { login as authServiceLogin, register as authServiceRegister, logout as authServiceLogout } from '@/services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch extended profile data from public.users
  const fetchUserProfile = async (authUserId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUserId)
        .maybeSingle();
      
      return data || null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // 1. Check active session on mount
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (initialSession?.user) {
            setSession(initialSession);
            const profile = await fetchUserProfile(initialSession.user.id);
            // Merge auth user with profile data
            setUser({ ...initialSession.user, ...profile });
          } else {
            setSession(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!mounted) return;
      
      if (currentSession?.user) {
        setSession(currentSession);
        const profile = await fetchUserProfile(currentSession.user.id);
        setUser({ ...currentSession.user, ...profile });
      } else {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Wrappers for auth services to expose via context
  const login = async (email, password) => {
    const result = await authServiceLogin(email, password);
    if (result.user && !result.error) {
       // State update happens automatically via onAuthStateChange
    }
    return result;
  };

  const signup = async (userData) => {
    const result = await authServiceRegister(userData);
    return result;
  };

  const logout = async () => {
    const result = await authServiceLogout();
    if (!result.error) {
      setSession(null);
      setUser(null);
    }
    return result;
  };

  const refreshUser = async () => {
    if (user?.id) {
      const profile = await fetchUserProfile(user.id);
      if (profile) {
         // Re-merge with existing auth user data to keep auth metadata
         setUser(prev => ({ ...prev, ...profile }));
      }
    }
  };

  const value = {
    user,
    session,
    loading,
    login,
    signup,
    logout,
    refreshUser,
    isAuthenticated: !!session,
    isAdmin: user?.role === 'admin' || user?.role === 'master',
    isMaster: user?.role === 'master',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
