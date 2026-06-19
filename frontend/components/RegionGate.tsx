'use client';

import dynamic from 'next/dynamic';

const RegionSelectorModal = dynamic(
  () =>
    import('@/components/RegionSelectorModal').then((mod) => ({
      default: mod.RegionSelectorModal,
    })),
  { ssr: false },
);

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
