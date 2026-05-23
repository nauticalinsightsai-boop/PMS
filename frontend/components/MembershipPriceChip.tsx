'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { REGION_COPY } from '@/lib/brand-voice';

/** Delay before hiding the hover hint so users can move the cursor onto it. */
const HINT_HIDE_DELAY_MS = 320;

const CHIP_SHELL =
  'group/member-chip relative flex min-h-[5rem] min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-2 text-center transition-all sm:px-2.5 bg-slate-50 dark:bg-slate-800 hover:border-brand-purple/25 hover:bg-brand-purple/5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40';

export function MembershipPriceChip({
  price,
  className,
}: {
  price: string | null | undefined;
  className?: string;
}) {
  const displayPrice = price?.trim() || '—';
  const [hintOpen, setHintOpen] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openHint = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setHintOpen(true);
  }, []);

  const scheduleCloseHint = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setHintOpen(false);
      hideTimerRef.current = null;
    }, HINT_HIDE_DELAY_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <Link
      href="/membership"
      className={cn(
        CHIP_SHELL,
        hintOpen &&
          'z-30 border-brand-purple/40 bg-brand-purple/10 shadow-md ring-1 ring-brand-purple/20 dark:bg-brand-purple/15',
        className,
      )}
      title={`${REGION_COPY.membershipDiscountNote} View membership plans.`}
      aria-label={`${REGION_COPY.membershipChipLabel}: ${displayPrice}. ${REGION_COPY.membershipDiscountNote} View membership plans.`}
      aria-describedby={hintOpen ? 'membership-chip-hint' : undefined}
      onMouseEnter={openHint}
      onMouseLeave={scheduleCloseHint}
      onFocus={openHint}
      onBlur={scheduleCloseHint}
    >
      <span className="flex w-full items-center justify-center gap-1 text-[10px] font-bold leading-none tracking-wide text-brand-purple normal-case">
        <Crown className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
        <span>{REGION_COPY.membershipChipLabel}</span>
      </span>
      <p className="text-sm font-extrabold leading-tight tracking-tight text-brand-purple">
        {displayPrice}
      </p>

      <span
        id="membership-chip-hint"
        role="tooltip"
        className={cn(
          'pointer-events-none absolute left-1/2 z-40 w-[min(16rem,calc(100vw-2rem))] -translate-x-1/2',
          /* Overlap chip top — avoids a dead hover gap from margin */
          'bottom-[calc(100%-6px)]',
          'rounded-xl border-2 border-brand-purple/30 bg-white px-3.5 py-3 text-left shadow-xl ring-1 ring-brand-purple/15 dark:border-brand-purple/40 dark:bg-slate-900 dark:ring-brand-purple/25',
          'opacity-0 translate-y-2 scale-[0.98] transition-all duration-200 ease-out',
          hintOpen && 'opacity-100 translate-y-0 scale-100',
          /* Invisible bridge into the chip so pointer path stays inside the link */
          'after:absolute after:left-1/2 after:top-full after:h-3 after:w-[80%] after:-translate-x-1/2 after:content-[""]',
        )}
      >
        <p className="text-xs font-semibold leading-snug text-slate-700 dark:text-slate-200">
          {REGION_COPY.membershipDiscountNote}
        </p>
        <p className="mt-2 text-[11px] font-bold text-brand-orange">
          View membership plans →
        </p>
      </span>
    </Link>
  );
}
