'use client';

import { RegionProvider } from '@/contexts/RegionContext';
import { PortalRegionThemeProvider } from '@/contexts/PortalRegionThemeContext';

export function PortalRegionShell({ children }: { children: React.ReactNode }) {
  return (
    <PortalRegionThemeProvider>
      <RegionProvider portalDefaults>
        {children}
      </RegionProvider>
    </PortalRegionThemeProvider>
  );
}
