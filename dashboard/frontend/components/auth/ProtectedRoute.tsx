'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { withBasePath } from '@/lib/base-path';
import PageSkeleton from '@/components/shared/PageSkeleton';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      sessionStorage.setItem('redirect_after_login', pathname);
      window.location.assign(withBasePath('/login'));
    }
  }, [isAuthenticated, loading, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-shell-gradient p-8">
        <PageSkeleton className="w-full max-w-md" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};
