'use client';

import { Suspense, useEffect } from 'react';
import { CookieConsent } from '@/components/CookieConsent';
import { RegionProvider } from '@/contexts/RegionContext';
import { PortalRegionThemeProvider } from '@/contexts/PortalRegionThemeContext';
import { initAttributionCapture } from '@/lib/analytics/funnel';

export function PortalRegionShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAttributionCapture();
  }, []);

  return (
    <PortalRegionThemeProvider>
      <RegionProvider portalDefaults>
        {children}
        <Suspense fallback={null}>
          <CookieConsent />
        </Suspense>
      </RegionProvider>
    </PortalRegionThemeProvider>
  );
}
