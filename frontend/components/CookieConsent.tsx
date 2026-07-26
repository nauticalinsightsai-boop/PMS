'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { acceptAllConsent, rejectNonEssentialConsent, readStoredConsent } from '@/lib/legal/consent';
import { trackEvent } from '@/lib/analytics/gtag';
import { BRAND } from '@/lib/brand-voice';
import { cn } from '@/lib/utils';
import { usePortalRegionTheme } from '@/contexts/PortalRegionThemeContext';
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes';
import { resolveGoPortalChannelId } from '@/lib/calendly/embed-url';
import { resolvePortalTheme } from '@/lib/channel-landing-pages/resolvePortalTheme';
import {
  defaultPortalColorMode,
  portalThemeStorageKey,
  type PortalColorMode,
} from '@/lib/channel-landing-pages/platformThemeModes';

/** Defer banner until after the LCP window so consent copy is not the largest paint. */
const CONSENT_SHOW_DELAY_MS = 4500;

const COOKIE_POLICY_LINK_CLASS =
  'font-bold text-brand-orange underline decoration-brand-orange/50 hover:text-brand-hover';

function portalBannerStyle(theme: PlatformPortalTheme): React.CSSProperties {
  return {
    backgroundColor: theme.cardBg || theme.surface,
    borderColor: theme.cardBorder,
    color: theme.text,
  };
}

/** E3c: if context is still null on /go/*, resolve from pathname so first paint is not brand-orange. */
function resolvePortalThemeFallback(): PlatformPortalTheme | null {
  if (typeof window === 'undefined') return null;
  const channelId = resolveGoPortalChannelId(window.location.pathname);
  if (!channelId) return null;
  try {
    let mode: PortalColorMode = defaultPortalColorMode(channelId);
    const stored = window.localStorage?.getItem(portalThemeStorageKey(channelId));
    if (stored === 'light' || stored === 'dark') mode = stored;
    return resolvePortalTheme(channelId, mode);
  } catch {
    return null;
  }
}

export function CookieConsent() {
  const portalThemeFromContext = usePortalRegionTheme();
  const [pathnameFallback, setPathnameFallback] = React.useState<PlatformPortalTheme | null>(null);
  const [visible, setVisible] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const bannerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setPathnameFallback(resolvePortalThemeFallback());
  }, []);

  React.useEffect(() => {
    if (readStoredConsent()) return;

    let cancelled = false;
    const show = () => {
      if (!cancelled) {
        // Refresh fallback at show time in case storage/theme toggled during delay
        setPathnameFallback(resolvePortalThemeFallback());
        setVisible(true);
      }
    };

    const delayId = window.setTimeout(show, CONSENT_SHOW_DELAY_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(delayId);
    };
  }, []);

  React.useEffect(() => {
    window.dispatchEvent(new CustomEvent('cookie-consent-visible', { detail: { visible } }));
  }, [visible]);

  React.useEffect(() => {
    if (!visible || !bannerRef.current) {
      document.documentElement.style.setProperty('--cookie-consent-height', '0px');
      document.documentElement.style.scrollPaddingBottom = '';
      document.body.style.paddingBottom = '';
      return;
    }
    const banner = bannerRef.current;
    const reserve = () => {
      const height = Math.ceil(banner.getBoundingClientRect().height);
      // Keep FABs and in-flow page content (forms/CTAs) clear of the fixed banner.
      const pad = `${height + 16}px`;
      document.documentElement.style.setProperty('--cookie-consent-height', pad);
      document.documentElement.style.scrollPaddingBottom = pad;
      document.body.style.paddingBottom = pad;
    };
    reserve();
    const observer = new ResizeObserver(reserve);
    observer.observe(banner);
    return () => {
      observer.disconnect();
      document.documentElement.style.setProperty('--cookie-consent-height', '0px');
      document.documentElement.style.scrollPaddingBottom = '';
      document.body.style.paddingBottom = '';
    };
  }, [expanded, visible]);

  const acceptAll = () => {
    acceptAllConsent();
    trackEvent('cookie_consent_accept', { consent_choice: 'all' });
    setVisible(false);
  };

  const rejectNonEssential = () => {
    rejectNonEssentialConsent();
    trackEvent('cookie_consent_reject', { consent_choice: 'necessary_only' });
    setVisible(false);
  };

  if (!visible) return null;

  const portalTheme = portalThemeFromContext ?? pathnameFallback;
  const themed = Boolean(portalTheme);
  const linkClass = themed
    ? 'font-bold underline decoration-current/40 hover:opacity-90'
    : COOKIE_POLICY_LINK_CLASS;
  const linkStyle = themed && portalTheme ? { color: portalTheme.linkColor || portalTheme.primary } : undefined;

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className={cn(
        'fixed bottom-[calc(max(1rem,env(safe-area-inset-bottom))+var(--portal-sticky-cta-height,0px))] left-3 right-3 z-[90] mx-auto overflow-visible rounded-2xl border shadow-2xl sm:left-4 sm:right-4',
        expanded
          ? 'max-w-lg space-y-3 p-4'
          : 'flex max-w-[min(40rem,calc(100vw-1.5rem))] flex-col gap-2 p-2.5 md:max-w-[min(72rem,calc(100vw-3rem))] md:flex-row md:items-center md:gap-3 md:p-3',
        !themed &&
          'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
      )}
      style={themed && portalTheme ? portalBannerStyle(portalTheme) : undefined}
    >
      <div className={cn('flex min-w-0 items-center justify-between gap-2', expanded ? 'w-full' : 'md:shrink-0')}>
        <p
          id="cookie-consent-title"
          className={cn(
            'min-w-0 font-bold',
            expanded ? 'text-sm' : 'truncate text-xs sm:text-sm',
            !themed && 'text-slate-900 dark:text-white',
          )}
          style={themed && portalTheme ? { color: portalTheme.text } : undefined}
        >
          Cookies on {BRAND.name}
        </p>
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          aria-controls="cookie-consent-details"
          className={cn(
            'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold whitespace-nowrap',
            !themed &&
              'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
          )}
          style={
            themed && portalTheme
              ? { color: portalTheme.textMuted || portalTheme.text }
              : undefined
          }
        >
          {expanded ? 'Less' : 'Learn more'}
          <ChevronDown
            className={cn('h-3.5 w-3.5 transition-transform duration-200', expanded && 'rotate-180')}
            aria-hidden
          />
        </button>
      </div>

      <p
        id="cookie-consent-desc"
        className={cn(
          'text-xs font-medium leading-snug',
          expanded ? 'w-full' : 'min-w-0 md:max-w-xs md:flex-1',
          !themed && 'text-slate-600 dark:text-slate-400',
        )}
        style={
          themed && portalTheme ? { color: portalTheme.textMuted || portalTheme.text } : undefined
        }
      >
        {expanded
          ? 'We use cookies and local storage for region preference, theme, checkout, and consent records.'
          : 'Necessary cookies for region, theme, and checkout.'}
      </p>

      <div
        id="cookie-consent-details"
        className={cn(
          'grid w-full transition-[grid-template-rows,opacity,margin] duration-200 ease-out',
          expanded ? 'grid-rows-[1fr] opacity-100' : 'hidden grid-rows-[0fr] opacity-0',
        )}
        aria-hidden={!expanded}
      >
        <div className="min-h-0 overflow-hidden">
          <p
            className={cn(
              'text-xs font-medium leading-relaxed',
              !themed && 'text-slate-600 dark:text-slate-400',
            )}
            style={
              themed && portalTheme ? { color: portalTheme.textMuted || portalTheme.text } : undefined
            }
          >
            With your permission, we use Google Analytics and Meta measurement tools to understand
            site usage and advertising results. They stay off when you reject optional cookies. See our{' '}
            <Link href="/legal/cookies" className={linkClass} style={linkStyle}>
              Cookie Policy
            </Link>{' '}
            for categories, retention, and how to change your choice.
          </p>
        </div>
      </div>

      <div
        className={cn(
          'grid w-full grid-cols-3 gap-1.5',
          expanded ? 'sm:flex sm:flex-row' : 'md:ml-auto md:flex md:w-auto md:shrink-0 md:gap-2',
        )}
      >
        <Button
          type="button"
          variant={themed ? 'default' : 'brand'}
          size="sm"
          className="min-w-0 whitespace-nowrap px-2 text-[11px] font-bold sm:text-xs md:px-3 md:text-sm"
          onClick={acceptAll}
          style={
            themed && portalTheme
              ? {
                  backgroundColor: portalTheme.primary,
                  color: portalTheme.primaryForeground,
                  borderColor: portalTheme.primary,
                }
              : undefined
          }
        >
          Accept all
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-w-0 whitespace-nowrap px-2 text-[11px] font-bold sm:text-xs md:px-3 md:text-sm"
          onClick={rejectNonEssential}
          aria-label="Reject non-essential cookies"
          style={
            themed && portalTheme
              ? {
                  backgroundColor: 'transparent',
                  color: portalTheme.text,
                  borderColor: portalTheme.cardBorder,
                }
              : undefined
          }
        >
          <span className="md:hidden">Reject</span>
          <span className="hidden md:inline">Reject non-essential</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="min-w-0 whitespace-nowrap px-2 text-[11px] font-bold sm:text-xs md:px-3 md:text-sm"
          asChild
          style={
            themed && portalTheme
              ? { color: portalTheme.linkColor || portalTheme.primary }
              : undefined
          }
        >
          <Link href="/legal/cookies">Manage</Link>
        </Button>
      </div>
    </div>
  );
}
