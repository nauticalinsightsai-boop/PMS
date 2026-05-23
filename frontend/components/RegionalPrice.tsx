'use client';

import { cn } from '@/lib/utils';
import { REGION_COPY } from '@/lib/brand-voice';
import {
  resolvePricingPresentation,
  type FullRegionalPriceDisplay,
} from '@/lib/regional-price-display';

export type RegionalPriceVariant = 'hero' | 'tier' | 'compare' | 'full';

export interface RegionalPriceProps {
  original: string | null;
  active: string | null;
  membership?: string | null;
  showScholarshipLabels: boolean;
  regionalLabel?: string;
  footnote?: string | null;
  className?: string;
  /** @deprecated Use `variant` instead */
  compact?: boolean;
  variant?: RegionalPriceVariant;
}

function presentationFromProps(props: RegionalPriceProps) {
  return resolvePricingPresentation({
    original: props.original,
    active: props.active,
    membership: props.membership ?? null,
    showScholarshipLabels: props.showScholarshipLabels,
    footnote: props.footnote ?? null,
    regionalLabel: props.regionalLabel ?? REGION_COPY.regionalPriceLabel,
  });
}

/** Browse cards — one hero tuition + optional muted global reference. */
function RegionalPriceHero({
  active,
  presentation,
  globalReference,
}: {
  active: string;
  presentation: ReturnType<typeof resolvePricingPresentation>;
  globalReference: string | null;
}) {
  return (
    <div className="space-y-1">
      <p
        className={cn(
          'font-bold leading-tight',
          presentation.kind === 'scholarship' ? 'text-brand-orange text-lg' : 'text-slate-900 dark:text-white text-lg',
        )}
      >
        {active}
      </p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {presentation.activeLabel}
      </p>
      {presentation.showGlobalReference && globalReference && (
        <p className="text-[10px] text-slate-400 dark:text-slate-500">
          {presentation.globalReferenceLabel}{' '}
          <span className="line-through decoration-slate-300">{globalReference}</span>
        </p>
      )}
    </div>
  );
}

/** Pathway tier cards — tuition + optional one-line membership hint. */
function RegionalPriceTier({
  active,
  presentation,
  globalReference,
  membership,
}: {
  active: string;
  presentation: ReturnType<typeof resolvePricingPresentation>;
  globalReference: string | null;
  membership: string | null;
}) {
  return (
    <div className="space-y-1.5">
      {presentation.showGlobalReference && globalReference && (
        <p className="text-[10px] text-slate-400 dark:text-slate-500">
          {presentation.globalReferenceLabel}{' '}
          <span className="line-through decoration-slate-300">{globalReference}</span>
        </p>
      )}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span
          className={cn(
            'text-[10px] font-bold uppercase tracking-widest',
            presentation.kind === 'scholarship' ? 'text-brand-orange' : 'text-slate-500 dark:text-slate-400',
          )}
        >
          {presentation.activeLabel}
        </span>
        <span
          className={cn(
            'font-bold text-lg',
            presentation.kind === 'scholarship' ? 'text-brand-orange' : 'text-slate-900 dark:text-white',
          )}
        >
          {active}
        </span>
      </div>
      {membership && (
        <p className="text-[10px] font-semibold text-brand-purple">
          {REGION_COPY.membershipPriceLabel}: {membership}
        </p>
      )}
    </div>
  );
}

/** Compare matrix — tuition column + optional member line. */
function RegionalPriceCompare({
  active,
  globalReference,
  membership,
  presentation,
}: {
  active: string;
  globalReference: string | null;
  membership: string | null;
  presentation: ReturnType<typeof resolvePricingPresentation>;
}) {
  return (
    <div className="space-y-1 text-sm">
      {presentation.showGlobalReference && globalReference && (
        <div className="text-slate-400 line-through text-xs">{globalReference}</div>
      )}
      <div className="font-bold text-slate-800 dark:text-slate-200">{active}</div>
      {membership && (
        <div className="text-brand-purple text-xs font-semibold">
          {REGION_COPY.membershipPriceLabel}: {membership}
        </div>
      )}
    </div>
  );
}

/** Checkout / membership samples — full breakdown. */
function RegionalPriceFull({
  active,
  presentation,
  globalReference,
  membership,
  footnote,
  useScholarshipLabels,
  regionalLabel,
}: {
  active: string;
  presentation: ReturnType<typeof resolvePricingPresentation>;
  globalReference: string | null;
  membership: string | null;
  footnote: string | null;
  useScholarshipLabels: boolean;
  regionalLabel?: string;
}) {
  const referenceLabel =
    presentation.kind === 'scholarship'
      ? REGION_COPY.originalPriceLabel
      : presentation.globalReferenceLabel;

  return (
    <div className="space-y-2">
      {useScholarshipLabels ? (
        <>
          {globalReference && presentation.showGlobalReference && (
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
              <span className="text-slate-500 dark:text-slate-400">{referenceLabel}</span>
              <span className="font-medium text-slate-600 dark:text-slate-300 line-through decoration-slate-300">
                {globalReference}
              </span>
            </div>
          )}
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">
              {REGION_COPY.scholarshipPriceLabel}
            </span>
            <span className="font-bold text-2xl text-brand-orange">{active}</span>
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
          <span className="font-bold text-2xl text-slate-900 dark:text-white">{active}</span>
        </div>
      )}

      {membership && (
        <div className="space-y-1 border-t border-slate-100 dark:border-slate-800 pt-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-purple">
              {REGION_COPY.membershipPriceLabel}
            </span>
            <span className="font-bold text-xl text-brand-purple">{membership}</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
            {REGION_COPY.membershipDiscountNote}
          </p>
        </div>
      )}
    </div>
  );
}

export function RegionalPrice({
  original,
  active,
  membership = null,
  showScholarshipLabels,
  regionalLabel,
  footnote = null,
  className,
  compact,
  variant,
}: RegionalPriceProps) {
  if (!active) return null;

  const resolvedVariant: RegionalPriceVariant =
    variant ?? (compact ? 'tier' : 'full');
  const presentation = presentationFromProps({
    original,
    active,
    membership,
    showScholarshipLabels,
    regionalLabel,
    footnote,
  });

  const body = (() => {
    switch (resolvedVariant) {
      case 'hero':
        return (
          <RegionalPriceHero
            active={active}
            presentation={presentation}
            globalReference={original}
          />
        );
      case 'tier':
        return (
          <RegionalPriceTier
            active={active}
            presentation={presentation}
            globalReference={original}
            membership={membership}
          />
        );
      case 'compare':
        return (
          <RegionalPriceCompare
            active={active}
            globalReference={original}
            membership={membership}
            presentation={presentation}
          />
        );
      case 'full':
      default:
        return (
          <RegionalPriceFull
            active={active}
            presentation={presentation}
            globalReference={original}
            membership={membership}
            footnote={footnote}
            useScholarshipLabels={showScholarshipLabels}
            regionalLabel={regionalLabel}
          />
        );
    }
  })();

  return <div className={cn(className)}>{body}</div>;
}

/** Convenience wrapper when you already have `resolveFullPriceDisplay` output. */
export function RegionalPriceFromDisplay({
  display,
  variant,
  membership,
  footnote,
  className,
}: {
  display: FullRegionalPriceDisplay;
  variant: RegionalPriceVariant;
  membership?: string | null;
  footnote?: string | null;
  className?: string;
}) {
  return (
    <RegionalPrice
      original={display.original}
      active={display.active}
      membership={membership !== undefined ? membership : display.membership}
      showScholarshipLabels={display.showScholarshipLabels}
      regionalLabel={display.regionalLabel}
      footnote={footnote !== undefined ? footnote : display.footnote}
      variant={variant}
      className={className}
    />
  );
}
