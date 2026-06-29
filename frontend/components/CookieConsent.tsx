'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { acceptAllConsent, rejectNonEssentialConsent, readStoredConsent } from '@/lib/legal/consent';
import { trackEvent } from '@/lib/analytics/gtag';
import { BRAND } from '@/lib/brand-voice';

/** Defer banner until after the LCP window so consent copy is not the largest paint. */
const CONSENT_SHOW_DELAY_MS = 4500;

export function CookieConsent() {
  const [visible, setVisible] = React.useState(false);

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
      <p id="cookie-consent-title" className="text-sm font-bold text-slate-900 dark:text-white mb-2">
        Cookies on {BRAND.name}
      </p>
      <p id="cookie-consent-desc" className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">
        We use necessary cookies for region preference, theme, and checkout. We also use Google
        Analytics to measure site usage (including when you reject optional cookies). See our{' '}
        <Link href="/legal/cookies" className="font-bold text-orange-800 underline decoration-orange-800/50 hover:text-orange-900 dark:text-orange-300 dark:decoration-orange-300/50">
          Cookie Policy
        </Link>
        .
      </p>
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
