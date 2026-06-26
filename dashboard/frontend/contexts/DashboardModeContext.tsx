'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ADMIN_ROUTE_PREFIXES,
  BOOKINGS_ROUTE_PREFIXES,
  EDITOR_ROUTE_PREFIXES,
} from '@/constants/dashboardRoutes';
import { WEBSITE_CMS_PATHS } from '@/constants/websiteCmsPaths';
import { dashboardHref, normalizeDashboardPath } from '@/lib/base-path';

export type DashboardMode = 'editor' | 'bookings' | 'admin';

interface DashboardModeContextType {
  mode: DashboardMode;
  setMode: (mode: DashboardMode) => void;
}

const DashboardModeContext = createContext<DashboardModeContextType | undefined>(undefined);

export const DashboardModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<DashboardMode>('admin');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const path = normalizeDashboardPath(pathname ?? '');
    if (EDITOR_ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix))) {
      setMode('editor');
    } else if (BOOKINGS_ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix))) {
      setMode('bookings');
    } else if (ADMIN_ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix))) {
      setMode('admin');
    } else if (path === '/dashboard' || path.startsWith('/dashboard/site-system/media')) {
      setMode('admin');
    }
  }, [pathname]);

  const handleSetMode = (newMode: DashboardMode) => {
    setMode(newMode);
    if (newMode === 'editor') router.push(dashboardHref(WEBSITE_CMS_PATHS.newsletter));
    if (newMode === 'bookings') router.push(dashboardHref('/dashboard/booking-crm/cta'));
    if (newMode === 'admin') router.push(dashboardHref('/dashboard/site-system/home'));
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
