'use client';

import Link from 'next/link';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { REGION_COPY } from '@/lib/brand-voice';

const CHIP_SHELL =
  'group/member-chip relative flex min-h-[4.5rem] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-transparent px-2 py-1.5 text-center transition-all duration-300 sm:px-2.5 bg-slate-50 dark:bg-slate-800 sm:min-h-[6.75rem] sm:border-brand-purple/40 sm:bg-brand-purple/10 sm:shadow-md sm:ring-1 sm:ring-brand-purple/20 dark:sm:bg-brand-purple/15 hover:border-brand-purple/25 hover:bg-brand-purple/5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40';

export function MembershipPriceChip({
  price,
  className,
}: {
  price: string | null | undefined;
  className?: string;
}) {
  const trimmed = price?.trim() ?? '';
  const displayPrice = trimmed;

  if (!trimmed) return null;
  return (
    <Link
      href="/membership"
      className={cn(CHIP_SHELL, className)}
      title={`${REGION_COPY.membershipDiscountNote} View membership plans.`}
      aria-label={`${REGION_COPY.membershipChipLabel}: ${displayPrice}. ${REGION_COPY.membershipDiscountNote} View membership plans.`}
    >
      <span className="flex w-full items-center justify-center gap-0.5 text-[9px] font-bold leading-none tracking-wide text-brand-purple normal-case sm:gap-1 sm:text-[10px]">
        <Crown className="h-2.5 w-2.5 shrink-0 opacity-80 sm:h-3 sm:w-3" aria-hidden />
        <span className="sm:hidden">Member</span>
        <span className="hidden sm:inline">{REGION_COPY.membershipChipLabel}</span>
      </span>
      <p className="text-xs font-extrabold leading-tight tracking-tight text-brand-purple sm:text-xs">
        {displayPrice}
      </p>

      <div className="mt-1.5 w-full">
        <p className="text-[11px] font-semibold leading-snug text-slate-700 dark:text-slate-200">
          {REGION_COPY.membershipDiscountNote}
        </p>
        <p className="mt-1.5 text-[10px] font-bold text-brand-orange">View membership plans →</p>
      </div>
    </Link>
  );
}
