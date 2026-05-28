'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import {
  clearDemoSession,
  createDemoUser,
  isDemoCredentials,
  isDemoLoginAllowed,
  persistDemoSession,
  readDemoSessionEmail,
} from '@/lib/demo-auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const demoEmail = readDemoSessionEmail();
      if (demoEmail) {
        setUser(createDemoUser(demoEmail));
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (readDemoSessionEmail()) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (isDemoLoginAllowed() && isDemoCredentials(email, password)) {
      const mockUser = createDemoUser(email);
      persistDemoSession(email);
      setUser(mockUser);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw error;
  };

  const logout = async () => {
    if (readDemoSessionEmail() || user?.id === 'demo-user-id') {
      clearDemoSession();
      setUser(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const requestPasswordReset = async (email: string) => {
    const redirectTo = `${window.location.origin}/login/update-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    if (error) throw error;
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        requestPasswordReset,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
