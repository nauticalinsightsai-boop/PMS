'use client';

import * as React from 'react';
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes';

type PortalRegionThemeContextValue = {
  theme: PlatformPortalTheme | null;
  setTheme: (theme: PlatformPortalTheme | null) => void;
};

const PortalRegionThemeContext = React.createContext<PortalRegionThemeContextValue | null>(null);

export function PortalRegionThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<PlatformPortalTheme | null>(null);
  const value = React.useMemo(() => ({ theme, setTheme }), [theme]);
  return (
    <PortalRegionThemeContext.Provider value={value}>{children}</PortalRegionThemeContext.Provider>
  );
}

export function usePortalRegionTheme() {
  return React.useContext(PortalRegionThemeContext)?.theme ?? null;
}

export function useSetPortalRegionTheme() {
  const ctx = React.useContext(PortalRegionThemeContext);
  if (!ctx) {
    return (_theme: PlatformPortalTheme | null) => {};
  }
  return ctx.setTheme;
}
