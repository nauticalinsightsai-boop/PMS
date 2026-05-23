'use client';

import { REGION_COPY } from '@/lib/brand-voice';
import { useRegion } from '@/contexts/RegionContext';
import { cn } from '@/lib/utils';

export function PricingComplianceNote({ className }: { className?: string }) {
  const { regionId } = useRegion();
  const showSouthAsia = regionId === 'india' || regionId === 'pakistan';
  const showScholarshipFootnote =
    showSouthAsia || regionId === 'gcc';

  return (
    <div className={cn('space-y-2 text-xs text-slate-500 dark:text-slate-400', className)}>
      <p>{REGION_COPY.pricingSelector}</p>
      {showSouthAsia && <p>{REGION_COPY.southAsiaNote}</p>}
      {showScholarshipFootnote && <p>{REGION_COPY.scholarshipFootnote}</p>}
      <p>{REGION_COPY.compliance}</p>
    </div>
  );
}
