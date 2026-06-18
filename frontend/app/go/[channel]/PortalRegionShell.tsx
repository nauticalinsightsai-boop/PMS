'use client';

import { Suspense } from 'react';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { CookieConsent } from '@/components/CookieConsent';
import { RegionProvider } from '@/contexts/RegionContext';
import { PortalRegionThemeProvider } from '@/contexts/PortalRegionThemeContext';

export function PortalRegionShell({ children }: { children: React.ReactNode }) {
  return (
    <PortalRegionThemeProvider>
      <RegionProvider portalDefaults>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        {children}
        <CookieConsent />
      </RegionProvider>
    </PortalRegionThemeProvider>
  );
}
