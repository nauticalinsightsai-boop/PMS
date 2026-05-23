'use client';

import * as React from 'react';
import { useRegion } from '@/contexts/RegionContext';
import { RegionSelectorModal } from '@/components/RegionSelectorModal';

export function RegionGate({ children }: { children: React.ReactNode }) {
  const { isReady } = useRegion();
  const [mounted, setMounted] = React.useState(false);
  const [timedOut, setTimedOut] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const t = window.setTimeout(() => setTimedOut(true), 4000);
    return () => window.clearTimeout(t);
  }, []);

  const showContent = mounted && (isReady || timedOut);

  return (
    <>
      <RegionSelectorModal />
      {!showContent ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-6" aria-busy="true">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading your regional experience…</p>
        </div>
      ) : (
        children
      )}
    </>
  );
}
