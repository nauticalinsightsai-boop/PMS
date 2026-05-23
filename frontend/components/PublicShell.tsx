'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RegionProvider } from '@/contexts/RegionContext';
import { RegionGate } from '@/components/RegionGate';
import { ScrollToTop } from '@/components/ScrollToTop';
import { CookieConsent } from '@/components/CookieConsent';

/** Matches Navbar inner `h-16` — keep main padding and fixed subnav offset in sync */
export const PUBLIC_NAVBAR_HEIGHT_CLASS = 'pt-16';
export const PUBLIC_NAVBAR_OFFSET_CLASS = '-mt-16';
export const PUBLIC_NAVBAR_TOP_CLASS = 'top-16';
/** Certification detail / newsletter subnav row (py-3 + one line) */
export const PUBLIC_SUBNAV_SPACER_CLASS = 'h-14';

export function PublicShell({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark =
      stored === 'dark' ||
      (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <RegionProvider>
      <RegionGate>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[var(--shell-gradient-from)] via-[var(--shell-gradient-via)] to-[var(--shell-gradient-to)] dark:from-[var(--shell-gradient-dark-from)] dark:via-[var(--shell-gradient-dark-via)] dark:to-[var(--shell-gradient-dark-to)] text-foreground">
          <Navbar toggleTheme={() => setIsDarkMode((v) => !v)} isDarkMode={isDarkMode} />
          <main className={cn('flex-1 overflow-x-hidden', PUBLIC_NAVBAR_HEIGHT_CLASS)}>{children}</main>
          <Footer />
          <ScrollToTop />
          <CookieConsent />
        </div>
      </RegionGate>
    </RegionProvider>
  );
}
