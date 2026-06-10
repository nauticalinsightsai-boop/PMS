'use client';

import { RegionSelectorModal } from '@/components/RegionSelectorModal';

/**
 * Renders public page content immediately for crawlers and first paint.
 * Region selection runs via RegionSelectorModal + RegionContext without blocking the page body.
 */
export function RegionGate({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RegionSelectorModal />
      {children}
    </>
  );
}
