'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RegisterModal } from '@/components/RegisterModal';
import { TrackedConversionLink } from '@/components/analytics/TrackedConversionLink';
import { BRAND, CTAS } from '@/lib/brand-voice';
import { CONVERSION_EVENTS } from '@/lib/analytics/conversion-events';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'pms-bottom-cta-dismissed';
const SHOW_DELAY_MS = 5000;

const EXCLUDED_PREFIXES = ['/checkout', '/admin', '/go'];

function isExcludedPath(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function BottomCtaPopup() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (isExcludedPath(pathname)) {
      setOpen(false);
      return;
    }
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* private mode */
    }
    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const dismiss = React.useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setOpen(false);
  }, []);

  if (!open || isExcludedPath(pathname)) return null;

  return (
    <div
      role="complementary"
      aria-label="Get started with exam prep"
      className="fixed inset-x-0 bottom-0 z-[85] pointer-events-none px-3 sm:px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div
        className={cn(
          'relative pointer-events-auto mx-auto max-w-xl',
          'rounded-2xl border border-slate-200/90 bg-white/95 p-4 sm:p-5 shadow-2xl backdrop-blur-md',
          'dark:border-slate-700 dark:bg-slate-900/95',
          'animate-in slide-in-from-bottom-4 fade-in duration-300',
        )}
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-white pr-8 mb-1">
          Plan your PMP 2026 pathway
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Take the readiness diagnostic or book a consultation with {BRAND.name}. Independent exam prep —
          not official PMI registration.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <TrackedConversionLink
            href="/pmp-readiness-diagnostic"
            event={CONVERSION_EVENTS.CLICK_PMP_DIAGNOSTIC}
            className="flex-1"
            onClick={dismiss}
          >
            <Button variant="brand" className="w-full font-bold">
              {CTAS.readinessCheck}
            </Button>
          </TrackedConversionLink>
          <RegisterModal
            trigger={
              <Button variant="outline" className="w-full font-bold flex-1" onClick={dismiss}>
                {CTAS.navConsultation}
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
