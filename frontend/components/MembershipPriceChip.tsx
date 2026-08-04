'use client';

import Link from 'next/link';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { REGION_COPY } from '@/lib/brand-voice';

/** Compact membership price cell: same footprint as StatChip (no expand/hover reveal). */
const CHIP_SHELL =
  'group/member-chip relative flex min-h-[5rem] min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-xl border border-brand-purple/30 bg-brand-purple/10 px-2 py-2 text-center shadow-sm ring-1 ring-brand-purple/15 transition-colors dark:bg-brand-purple/15 hover:border-brand-purple/40 hover:bg-brand-purple/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40 sm:px-2.5';

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
      <div className="flex min-h-[1.75rem] w-full flex-col items-center justify-center gap-0.5 sm:min-h-[2rem]">
        <span className="flex w-full items-center justify-center gap-0.5 text-label leading-none text-brand-purple">
          <Crown className="h-2.5 w-2.5 shrink-0 opacity-80 sm:h-3 sm:w-3" aria-hidden />
          <span className="sm:hidden">Member</span>
          <span className="hidden sm:inline">{REGION_COPY.membershipChipLabel}</span>
        </span>
        <span className="w-full text-[9px] font-semibold leading-tight text-brand-orange/90 dark:text-brand-orange">
          20% off tuition
        </span>
      </div>
      <p className="text-xs font-extrabold leading-tight tracking-tight text-brand-purple sm:text-sm">
        {displayPrice}
      </p>
    </Link>
  );
}
