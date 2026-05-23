'use client';

import { cn } from '@/lib/utils';
import { REGION_COPY } from '@/lib/brand-voice';

interface RegionalPriceProps {
  original: string | null;
  active: string | null;
  membership?: string | null;
  showScholarshipLabels: boolean;
  regionalLabel?: string;
  footnote?: string | null;
  className?: string;
  compact?: boolean;
}

export function RegionalPrice({
  original,
  active,
  membership,
  showScholarshipLabels,
  regionalLabel,
  footnote,
  className,
  compact,
}: RegionalPriceProps) {
  if (!active) return null;

  const activeSize = compact ? 'text-lg' : 'text-2xl';
  const membershipSize = compact ? 'text-base' : 'text-xl';

  return (
    <div className={cn('space-y-2', className)}>
      {showScholarshipLabels ? (
        <>
          {original && (
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
              <span className="text-slate-500 dark:text-slate-400">{REGION_COPY.originalPriceLabel}</span>
              <span className="font-medium text-slate-600 dark:text-slate-300 line-through decoration-slate-300">
                {original}
              </span>
            </div>
          )}
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">
              {REGION_COPY.scholarshipPriceLabel}
            </span>
            <span className={cn('font-bold text-brand-orange', activeSize)}>{active}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            {footnote ?? REGION_COPY.scholarshipFootnote}
          </p>
        </>
      ) : (
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {regionalLabel ?? REGION_COPY.regionalPriceLabel}
          </span>
          <span className={cn('font-bold text-slate-900 dark:text-white', activeSize)}>{active}</span>
        </div>
      )}

      {membership && (
        <div className="space-y-1 border-t border-slate-100 dark:border-slate-800 pt-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-purple">
              {REGION_COPY.membershipPriceLabel}
            </span>
            <span className={cn('font-bold text-brand-purple', membershipSize)}>{membership}</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
            {REGION_COPY.membershipDiscountNote}
          </p>
        </div>
      )}
    </div>
  );
}
