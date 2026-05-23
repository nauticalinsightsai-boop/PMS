'use client';

import * as React from 'react';
import { useRegion } from '@/contexts/RegionContext';
import { RegionSelectorModal } from '@/components/RegionSelectorModal';

export function RegionGate({ children }: { children: React.ReactNode }) {
  const { isReady } = useRegion();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isReady) {
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
