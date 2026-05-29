'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  PUBLISHER_ROUTE_PREFIXES,
  BOOKINGS_ROUTE_PREFIXES,
  WEBSITE_ROUTE_PREFIXES,
} from '@/constants/dashboardRoutes';

export type DashboardMode = 'publisher' | 'bookings' | 'website';

interface DashboardModeContextType {
  mode: DashboardMode;
  setMode: (mode: DashboardMode) => void;
}

const DashboardModeContext = createContext<DashboardModeContextType | undefined>(undefined);

export const DashboardModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<DashboardMode>('website');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (PUBLISHER_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      setMode('publisher');
    } else if (
      WEBSITE_ROUTE_PREFIXES.some((prefix) =>
        prefix === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(prefix),
      )
    ) {
      setMode('website');
    } else if (BOOKINGS_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      setMode('bookings');
    }
  }, [pathname]);

  const handleSetMode = (newMode: DashboardMode) => {
    setMode(newMode);
    if (newMode === 'publisher') router.push('/dashboard/control-tower');
    if (newMode === 'bookings') router.push('/dashboard/booking-crm/cta');
    if (newMode === 'website') router.push('/dashboard');
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
