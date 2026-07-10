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
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className={cn(
        'fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-4 z-[90] mx-auto max-w-lg rounded-2xl border p-5 shadow-2xl md:left-auto md:right-[max(1.5rem,env(safe-area-inset-right))]',
        !themed &&
          'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
      )}
      style={themed && portalTheme ? portalBannerStyle(portalTheme) : undefined}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <p
          id="cookie-consent-title"
          className={cn('text-sm font-bold', !themed && 'text-slate-900 dark:text-white')}
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
            'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold',
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
          'mb-3 text-xs font-medium leading-relaxed',
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
          'grid transition-[grid-template-rows,opacity,margin] duration-200 ease-out',
          expanded ? 'mb-4 grid-rows-[1fr] opacity-100' : 'mb-0 grid-rows-[0fr] opacity-0',
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
            We also use Google Analytics to measure site usage, including when you reject optional
            cookies. See our{' '}
            <Link href="/legal/cookies" className={linkClass} style={linkStyle}>
              Cookie Policy
            </Link>{' '}
            for categories, retention, and how to change your choice.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant={themed ? 'default' : 'brand'}
          size="sm"
          className="flex-1 font-bold"
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
          className="flex-1 font-bold"
          onClick={rejectNonEssential}
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
          Reject non-essential
        </Button>
        <Link href="/legal/cookies" className="sm:contents">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full font-bold sm:w-auto"
            style={
              themed && portalTheme
                ? { color: portalTheme.linkColor || portalTheme.primary }
                : undefined
            }
          >
            Manage
          </Button>
        </Link>
      </div>
    </div>
  );
}
