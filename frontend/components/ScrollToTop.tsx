'use client';

import * as React from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FLOATING_CORNER_BOTTOM_CLASS } from '@/lib/floating-corner';
import { useFloatingCornerScrollVisible } from '@/lib/use-floating-corner-scroll';

export function ScrollToTop() {
  const visible = useFloatingCornerScrollVisible();
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReduceMotion(mq.matches);
    syncMotion();
    mq.addEventListener('change', syncMotion);

    return () => {
      mq.removeEventListener('change', syncMotion);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        'fixed z-[90] flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-white shadow-lg shadow-brand-orange/30',
        FLOATING_CORNER_BOTTOM_CLASS,
        'right-[max(1.5rem,env(safe-area-inset-right))]',
        'hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        reduceMotion ? 'transition-none' : 'transition-all duration-300 ease-out',
        visible
          ? 'translate-y-0 scale-100 opacity-100 pointer-events-auto'
          : 'translate-y-4 scale-90 opacity-0 pointer-events-none',
      )}
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2.5} aria-hidden />
    </button>
  );
}
