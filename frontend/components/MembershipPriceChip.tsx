'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { REGION_COPY } from '@/lib/brand-voice';

/** Grace period when the pointer leaves before collapsing (ms). */
const HINT_HIDE_DELAY_MS = 650;

const CHIP_SHELL =
  'group/member-chip relative flex min-h-[5rem] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-transparent px-2 py-2 text-center transition-all duration-300 sm:px-2.5 bg-slate-50 dark:bg-slate-800 hover:border-brand-purple/25 hover:bg-brand-purple/5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40';

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

  const showHint = hintOpen;

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
        showHint &&
          'z-30 min-h-[8.25rem] border-brand-purple/40 bg-brand-purple/10 shadow-md ring-1 ring-brand-purple/20 dark:bg-brand-purple/15',
        className,
      )}
      title={`${REGION_COPY.membershipDiscountNote} View membership plans.`}
      aria-label={`${REGION_COPY.membershipChipLabel}: ${displayPrice}. ${REGION_COPY.membershipDiscountNote} View membership plans.`}
      aria-expanded={showHint}
      onMouseEnter={openHint}
      onMouseLeave={scheduleCloseHint}
      onFocus={openHint}
      onBlur={scheduleCloseHint}
    >
      <span className="flex w-full items-center justify-center gap-1 text-[10px] font-bold leading-none tracking-wide text-brand-purple normal-case">
        <Crown className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
        <span>{REGION_COPY.membershipChipLabel}</span>
      </span>
      <p
        className={cn(
          'text-sm font-extrabold leading-tight tracking-tight text-brand-purple transition-all duration-300',
          showHint && 'text-xs',
        )}
      >
        {displayPrice}
      </p>

      <div
        id="membership-chip-hint"
        role="tooltip"
        className={cn(
          'w-full overflow-hidden transition-all duration-300 ease-out',
          showHint ? 'max-h-28 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0 pointer-events-none',
        )}
      >
        <p className="text-[11px] font-semibold leading-snug text-slate-700 dark:text-slate-200">
          {REGION_COPY.membershipDiscountNote}
        </p>
        <p className="mt-1.5 text-[10px] font-bold text-brand-orange">View membership plans →</p>
      </div>

      {!showHint ? (
        <span className="sr-only">Hover or tap for membership discount details</span>
      ) : null}
    </Link>
  );
}
