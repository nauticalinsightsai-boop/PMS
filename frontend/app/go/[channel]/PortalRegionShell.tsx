'use client';

import { RegionProvider } from '@/contexts/RegionContext';
import { PortalRegionThemeProvider } from '@/contexts/PortalRegionThemeContext';
import { RegionSelectorModal } from '@/components/RegionSelectorModal';

export function PortalRegionShell({ children }: { children: React.ReactNode }) {
  return (
    <PortalRegionThemeProvider>
      <RegionProvider portalDefaults>
        <RegionSelectorModal />
        {children}
      </RegionProvider>
    </PortalRegionThemeProvider>
  );
}
