'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { acceptAllConsent, rejectNonEssentialConsent, readStoredConsent } from '@/lib/legal/consent';
import { BRAND } from '@/lib/brand-voice';

export function CookieConsent() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!readStoredConsent()) setVisible(true);
  }, []);

  const acceptAll = () => {
    acceptAllConsent();
    setVisible(false);
  };

  const rejectNonEssential = () => {
    rejectNonEssentialConsent();
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
        We use necessary cookies for region preference, theme, and checkout. Optional analytics cookies
        are off until you accept. See our{' '}
        <Link href="/legal/cookies" className="text-brand-orange font-bold hover:underline">
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
