'use client';

import React, { createContext, useContext } from 'react';
import { WEBSITE_CMS_PATHS } from '@/constants/websiteCmsPaths';

export type DashboardMode = 'website';

interface DashboardModeContextType {
  mode: DashboardMode;
  setMode: (mode: DashboardMode) => void;
}

const DashboardModeContext = createContext<DashboardModeContextType | undefined>(undefined);

/** Newsletter-only admin — single mode, no CRM/social switcher. */
export const DashboardModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value: DashboardModeContextType = {
    mode: 'website',
    setMode: () => {
      /* newsletter-only */
    },
  };

  return <DashboardModeContext.Provider value={value}>{children}</DashboardModeContext.Provider>;
};

export const useDashboardMode = () => {
  const context = useContext(DashboardModeContext);
  if (!context) {
    throw new Error('useDashboardMode must be used within a DashboardModeProvider');
  }
  return context;
};

export const DEFAULT_DASHBOARD_LANDING = WEBSITE_CMS_PATHS.newsletter;
