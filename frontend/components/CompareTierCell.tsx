'use client';

import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRegion } from '@/contexts/RegionContext';
import {
  getOfferingForTier,
  resolveFullPriceDisplay,
  resolveRegionalRule,
  tierDisplayLabel,
} from '@/lib/regional-catalogue';
import type { OfferingStatus } from '@/types/regional-catalogue';
import { RegionalPriceFromDisplay } from '@/components/RegionalPrice';

const STATUS_LABEL: Partial<Record<OfferingStatus, string>> = {
  direct_checkout: 'Open enrolment',
  scholarship_verify: 'Scholarship — verify',
  consultation_required: 'Consultation',
  scholarship_unavailable: 'Global pricing',
  global_only: 'Global only',
  waitlist: 'Waitlist',
};

export function CompareTierCell({
  siteId,
  tier,
}: {
  siteId: string;
  tier: 'foundation' | 'professional' | 'mastery';
}) {
  const { regionId, gccCountry } = useRegion();
  const offering = getOfferingForTier(siteId, tier);

  if (!offering) {
    return <span className="text-slate-400 font-medium">Not offered</span>;
  }

  const full = resolveFullPriceDisplay(offering, regionId, gccCountry);
  const rule = resolveRegionalRule(offering, regionId);
  const statusLabel = STATUS_LABEL[rule.status];
  const tierName = tierDisplayLabel(offering.tierId, offering.tier);

  return (
    <div className="space-y-3 text-left max-w-xs mx-auto">
      <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-orange">
        <Clock className="h-3.5 w-3.5 shrink-0" />
        <span>{offering.length ?? 'Flexible'}</span>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">
        {tierName}
      </p>
      {full.active ? (
        <RegionalPriceFromDisplay display={full} variant="compare" membership={full.membership} />
      ) : (
        <span className="block text-center text-slate-500 font-medium">Pricing on request</span>
      )}
      {offering.deliveryMode && (
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed line-clamp-2">
          {offering.deliveryMode}
        </p>
      )}
      {statusLabel && rule.status !== 'direct_checkout' && (
        <p
          className={cn(
            'text-[10px] font-bold uppercase tracking-tight text-center',
            rule.status === 'scholarship_verify' ? 'text-brand-orange' : 'text-slate-500',
          )}
        >
          {statusLabel}
        </p>
      )}
    </div>
  );
}
