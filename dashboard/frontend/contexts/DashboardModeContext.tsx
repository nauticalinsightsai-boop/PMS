'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ADMIN_ROUTE_PREFIXES,
  BOOKINGS_ROUTE_PREFIXES,
  EDITOR_ROUTE_PREFIXES,
} from '@/constants/dashboardRoutes';
import { WEBSITE_CMS_PATHS } from '@/constants/websiteCmsPaths';

export type DashboardMode = 'editor' | 'bookings' | 'admin';

interface DashboardModeContextType {
  mode: DashboardMode;
  setMode: (mode: DashboardMode) => void;
}

const DashboardModeContext = createContext<DashboardModeContextType | undefined>(undefined);

export const DashboardModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<DashboardMode>('editor');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (EDITOR_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      setMode('editor');
    } else if (BOOKINGS_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      setMode('bookings');
    } else if (ADMIN_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      setMode('admin');
    } else if (pathname === '/dashboard') {
      setMode('editor');
    }
  }, [pathname]);

  const handleSetMode = (newMode: DashboardMode) => {
    setMode(newMode);
    if (newMode === 'editor') router.push(WEBSITE_CMS_PATHS.mediaLibrary);
    if (newMode === 'bookings') router.push('/dashboard/booking-crm/cta');
    if (newMode === 'admin') router.push('/dashboard/site-system/home');
  };

  return (
    <DashboardModeContext.Provider value={{ mode, setMode: handleSetMode }}>
      {children}
    </DashboardModeContext.Provider>
  );
};

export const useDashboardMode = () => {
  const context = useContext(DashboardModeContext);
  if (!context) {
    throw new Error('useDashboardMode must be used within a DashboardModeProvider');
  }
  return context;
};
