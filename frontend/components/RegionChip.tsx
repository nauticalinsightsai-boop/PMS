'use client';

import { MapPin } from 'lucide-react';
import { useRegion } from '@/contexts/RegionContext';
import { cn } from '@/lib/utils';

export function RegionChip({ className }: { className?: string }) {
  const { regionId, regionLabel, openRegionModal } = useRegion();
  const suffix =
    regionId === 'india' || regionId === 'pakistan' ? ' · Regional Scholarship' : '';

  return (
    <button
      type="button"
      onClick={openRegionModal}
      aria-label={`Region: ${regionLabel}. Click to change region.`}
      className={cn(
        'flex min-h-11 items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-brand-orange hover:text-brand-orange',
        className,
      )}
    >
      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span className="max-w-[140px] truncate sm:max-w-none">
        {regionLabel}
        {suffix}
      </span>
    </button>
  );
}
