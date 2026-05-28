'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PageSkeleton } from '@/components/shared/PageSkeleton';

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
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-shell-gradient p-8">
        <PageSkeleton className="w-full max-w-md" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};
