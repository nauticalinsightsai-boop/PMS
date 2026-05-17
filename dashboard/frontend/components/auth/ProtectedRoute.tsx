'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      sessionStorage.setItem('redirect_after_login', pathname);
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gw-bg-primary">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gw-accent-primary border-t-transparent" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};
