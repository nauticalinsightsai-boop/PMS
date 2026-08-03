'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RegionProvider } from '@/contexts/RegionContext';
import { RegionGate } from '@/components/RegionGate';
const CookieConsent = dynamic(
  () => import('@/components/CookieConsent').then((m) => ({ default: m.CookieConsent })),
  { ssr: false },
);
import { LeadRecoveryProvider } from '@/components/conversion-recovery/LeadRecoveryProvider';
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd';
import { syncBrandFavicon } from '@/lib/brand/site-logo';
import { initAttributionCapture } from '@/lib/analytics/funnel';

const ScrollToTop = dynamic(
  () => import('@/components/ScrollToTop').then((m) => ({ default: m.ScrollToTop })),
  { ssr: false },
);
const BottomCtaRotator = dynamic(
  () =>
    import('@/components/conversion-recovery/BottomCtaRotator').then((m) => ({
      default: m.BottomCtaRotator,
    })),
  { ssr: false },
);
const SupportChatWidget = dynamic(
  () => import('@/components/SupportChatWidget').then((m) => ({ default: m.SupportChatWidget })),
  { ssr: false },
);
const LeadRecoveryDialog = dynamic(
  () =>
    import('@/components/conversion-recovery/LeadRecoveryDialog').then((m) => ({
      default: m.LeadRecoveryDialog,
    })),
  { ssr: false },
);
const KeywordLeadPopup = dynamic(
  () =>
    import('@/components/seo/KeywordLeadPopup').then((m) => ({
      default: m.KeywordLeadPopup,
    })),
  { ssr: false },
);

/** Matches Navbar inner `h-16`: keep main padding and fixed subnav offset in sync */
export const PUBLIC_NAVBAR_HEIGHT_CLASS = 'pt-16';
export const PUBLIC_NAVBAR_OFFSET_CLASS = '-mt-16';
export const PUBLIC_NAVBAR_TOP_CLASS = 'top-16';
/** Certification detail / newsletter subnav row (py-3 + one line) */
export const PUBLIC_SUBNAV_SPACER_CLASS = 'h-14';

export const MAIN_CONTENT_ID = 'main-content';
/** Fixed Navbar `h-16` (64px): keep skip-scroll and main scroll-margin aligned. */
export const MAIN_CONTENT_SCROLL_MARGIN_CLASS = 'scroll-mt-16';
export const MAIN_CONTENT_HEADER_OFFSET_PX = 64;

/** Offscreen until focused; z-[110] stacks above Navbar z-[100]; hit target >=44px. */
const SKIP_TO_MAIN_CLASS =
  'absolute left-4 top-0 z-[110] inline-flex min-h-11 min-w-11 -translate-y-[160%] items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground shadow-md outline-none transition-transform focus:translate-y-4 focus:ring-2 focus:ring-ring';

function focusMainContent(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  const main = document.getElementById(MAIN_CONTENT_ID);
  if (!(main instanceof HTMLElement)) return;
  main.focus({ preventScroll: true });
  const top =
    main.getBoundingClientRect().top + window.scrollY - MAIN_CONTENT_HEADER_OFFSET_PX;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [deferWidgets, setDeferWidgets] = useState(false);

  useEffect(() => {
    initAttributionCapture();
  }, []);

  useEffect(() => {
    const run = () => setDeferWidgets(true);
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(run, { timeout: 4500 });
    } else {
      setTimeout(run, 4500);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark =
      stored === 'dark' ||
      (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
    syncBrandFavicon(!prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    syncBrandFavicon(!isDarkMode);
  }, [isDarkMode]);

  return (
    <RegionProvider>
      <OrganizationJsonLd />
      <RegionGate>
        <LeadRecoveryProvider>
          <div className="min-h-screen flex flex-col bg-gradient-to-b from-[var(--shell-gradient-from)] via-[var(--shell-gradient-via)] to-[var(--shell-gradient-to)] dark:from-[var(--shell-gradient-dark-from)] dark:via-[var(--shell-gradient-dark-via)] dark:to-[var(--shell-gradient-dark-to)] text-foreground">
            <a
              href={`#${MAIN_CONTENT_ID}`}
              className={SKIP_TO_MAIN_CLASS}
              onClick={focusMainContent}
            >
              Skip to main content
            </a>
            <Navbar toggleTheme={() => setIsDarkMode((v) => !v)} isDarkMode={isDarkMode} />
            <main
              id={MAIN_CONTENT_ID}
              tabIndex={-1}
              className={cn(
                'flex-1 overflow-x-clip outline-none',
                PUBLIC_NAVBAR_HEIGHT_CLASS,
                MAIN_CONTENT_SCROLL_MARGIN_CLASS,
              )}
            >
              {children}
            </main>
            <Footer />
            <ScrollToTop />
            <CookieConsent />
            <Suspense fallback={null}>
              <KeywordLeadPopup />
            </Suspense>
            {deferWidgets ? (
              <>
                <BottomCtaRotator />
                <SupportChatWidget />
                <LeadRecoveryDialog />
              </>
            ) : null}
          </div>
        </LeadRecoveryProvider>
      </RegionGate>
    </RegionProvider>
  );
}
