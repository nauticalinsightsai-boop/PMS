'use client';

import { RegionProvider } from '@/contexts/RegionContext';
import { RegionSelectorModal } from '@/components/RegionSelectorModal';

export function PortalRegionShell({ children }: { children: React.ReactNode }) {
  return (
    <RegionProvider portalDefaults>
      <RegionSelectorModal />
      {children}
    </RegionProvider>
  );
}
