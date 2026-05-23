'use client';

import { useRegion } from '@/contexts/RegionContext';
import { RegionSelectorModal } from '@/components/RegionSelectorModal';

export function RegionGate({ children }: { children: React.ReactNode }) {
  const { isReady } = useRegion();

  if (!isReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
        Loading…
      </div>
    );
  }

  return (
    <>
      <RegionSelectorModal />
      {children}
    </>
  );
}
