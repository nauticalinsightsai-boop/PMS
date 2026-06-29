'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { acceptAllConsent, rejectNonEssentialConsent, readStoredConsent } from '@/lib/legal/consent';
import { trackEvent } from '@/lib/analytics/gtag';
import { BRAND } from '@/lib/brand-voice';
import { cn } from '@/lib/utils';

/** Defer banner until after the LCP window so consent copy is not the largest paint. */
const CONSENT_SHOW_DELAY_MS = 4500;

const COOKIE_POLICY_LINK_CLASS =
  'font-bold text-brand-orange underline decoration-brand-orange/50 hover:text-brand-hover';

export function CookieConsent() {
  const [visible, setVisible] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    if (readStoredConsent()) return;

    let cancelled = false;
    const show = () => {
      if (!cancelled) setVisible(true);
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

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-4 z-[90] mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900 md:left-auto md:right-[max(1.5rem,env(safe-area-inset-right))]"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <p id="cookie-consent-title" className="text-sm font-bold text-slate-900 dark:text-white">
          Cookies on {BRAND.name}
        </p>
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          aria-controls="cookie-consent-details"
          className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
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
        className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-3"
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
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            We also use Google Analytics to measure site usage, including when you reject optional
            cookies. See our{' '}
            <Link href="/legal/cookies" className={COOKIE_POLICY_LINK_CLASS}>
              Cookie Policy
            </Link>{' '}
            for categories, retention, and how to change your choice.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button type="button" variant="brand" size="sm" className="font-bold flex-1" onClick={acceptAll}>
          Accept all
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="font-bold flex-1"
          onClick={rejectNonEssential}
        >
          Reject non-essential
        </Button>
        <Link href="/legal/cookies" className="sm:contents">
          <Button type="button" variant="ghost" size="sm" className="font-bold w-full sm:w-auto">
            Manage
          </Button>
        </Link>
      </div>
    </div>
  );
}
