'use client';

import { cn } from '@/lib/utils';
import { useMembershipRegionalPricing } from '@/hooks/useMembershipRegionalPricing';
import { formatMembershipSavingsPercent } from '@/lib/membership-plans';

/** Monthly (primary) and yearly price with % savings — side by side, in the active region currency. */
export function MembershipDualPrice({
  monthlyUsd,
  yearlyUsd,
  variant = 'light',
  className,
}: {
  monthlyUsd: number;
  yearlyUsd: number;
  variant?: 'light' | 'dark';
  className?: string;
}) {
  const amounts = useMembershipRegionalPricing(monthlyUsd, yearlyUsd);

  if (monthlyUsd === 0 && yearlyUsd === 0) {
    return (
      <div className={cn('flex items-baseline gap-2', className)}>
        <span
          className={cn(
            'text-5xl font-bold tracking-tight',
            variant === 'dark' ? 'text-white' : 'text-slate-900 dark:text-white',
          )}
        >
          {amounts.monthly}
        </span>
      </div>
    );
  }

  const savingsLabel = formatMembershipSavingsPercent(
    amounts.monthlyNumeric,
    amounts.yearlyNumeric,
  );
  const muted = variant === 'dark' ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400';
  const primary = variant === 'dark' ? 'text-white' : 'text-slate-900 dark:text-white';
  const divider = variant === 'dark' ? 'text-slate-600' : 'text-slate-300 dark:text-slate-600';

  return (
    <div className={cn('flex flex-wrap items-end gap-x-4 gap-y-2', className)}>
      <div className="flex items-baseline gap-2">
        <span className={cn('text-5xl font-bold tracking-tight', primary)}>{amounts.monthly}</span>
        <span className={cn('font-bold text-lg', muted)}>/ month</span>
      </div>

      <span className={cn('hidden sm:inline pb-2 text-2xl font-light', divider)} aria-hidden>
        |
      </span>

      <div className="flex flex-wrap items-baseline gap-2">
        <span className={cn('text-2xl font-bold tracking-tight', primary)}>{amounts.yearly}</span>
        <span className={cn('text-sm font-bold uppercase tracking-widest', muted)}>/ year</span>
        {savingsLabel ? (
          <span className="rounded-full bg-brand-purple/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-brand-purple dark:bg-brand-purple/25 dark:text-brand-purple">
            {savingsLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
