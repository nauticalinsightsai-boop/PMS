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
      className={cn(
        'fixed inset-x-0 bottom-0 z-[85] pointer-events-auto',
        'border-t border-white/40 dark:border-white/10',
        'bg-white/55 dark:bg-slate-950/55',
        'backdrop-blur-2xl backdrop-saturate-150',
        'shadow-[0_-12px_40px_rgba(15,23,42,0.12)] dark:shadow-[0_-12px_40px_rgba(0,0,0,0.45)]',
        'pb-[max(0.75rem,env(safe-area-inset-bottom))]',
        'animate-in slide-in-from-bottom-4 fade-in duration-300',
      )}
    >
      <div className="container relative mx-auto px-4 py-4 sm:px-6 sm:py-5">
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 sm:top-4 sm:right-6 rounded-md p-1.5 text-slate-500 hover:bg-white/40 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8 pr-10">
          <div className="min-w-0 max-w-3xl">
            <p className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
              Plan your PMP 2026 pathway
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300/90 leading-relaxed">
              Take the readiness diagnostic or book a consultation with {BRAND.name}. Independent exam prep —
              not official PMI registration.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:shrink-0 lg:w-auto lg:min-w-[22rem]">
            <TrackedConversionLink
              href="/pmp-readiness-diagnostic"
              event={CONVERSION_EVENTS.CLICK_PMP_DIAGNOSTIC}
              className="flex-1 sm:min-w-[11rem]"
              onClick={dismiss}
            >
              <Button variant="brand" className="w-full font-bold shadow-md shadow-brand-orange/20">
                {CTAS.readinessCheck}
              </Button>
            </TrackedConversionLink>
            <RegisterModal
              trigger={
                <Button
                  variant="outline"
                  className="w-full flex-1 font-bold border-slate-300/80 bg-white/50 dark:border-slate-600 dark:bg-slate-900/40 sm:min-w-[11rem]"
                  onClick={dismiss}
                >
                  {CTAS.navConsultation}
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
