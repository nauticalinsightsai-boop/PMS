'use client';

import * as React from 'react';

export type SiteColorScheme = 'light' | 'dark';

function readSiteColorScheme(): SiteColorScheme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/** Tracks `html.dark` toggled by PublicShell theme control. */
export function useSiteColorScheme(): SiteColorScheme {
  const [scheme, setScheme] = React.useState<SiteColorScheme>('light');

  React.useEffect(() => {
    setScheme(readSiteColorScheme());
    const observer = new MutationObserver(() => setScheme(readSiteColorScheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return scheme;
}
