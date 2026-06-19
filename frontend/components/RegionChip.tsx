'use client';

import * as React from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { useRegion } from '@/contexts/RegionContext';
import { cn } from '@/lib/utils';

export function RegionChip({ className, iconOnly }: { className?: string; iconOnly?: boolean }) {
  const { regionId, regionLabel, isDetectingRegion, refreshRegionDetection } = useRegion();
  const [locationError, setLocationError] = React.useState(false);

  const suffix =
    regionId === 'india' || regionId === 'pakistan' ? ' · Regional Scholarship' : '';

  const handleClick = async () => {
    setLocationError(false);
    const ok = await refreshRegionDetection();
    if (!ok) setLocationError(true);
  };

  const ariaLabel = isDetectingRegion
    ? 'Detecting your location…'
    : locationError
      ? `Region: ${regionLabel}. Location access denied: enable location in your browser to update pricing.`
      : `Region: ${regionLabel}. Share your location to update pricing for your area.`;

  const title = locationError
    ? 'Location access was denied. Enable it in browser settings to update your region.'
    : 'Share your location to update pricing for your area';

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={isDetectingRegion}
      aria-label={ariaLabel}
      title={title}
      className={cn(
        'flex min-h-11 items-center rounded-full border border-border bg-card/80 text-xs font-semibold text-muted-foreground cursor-pointer hover:border-border hover:text-muted-foreground',
        iconOnly ? 'min-w-11 justify-center gap-0 px-0' : 'gap-2 px-3 py-1.5',
        isDetectingRegion && 'opacity-70',
        className,
      )}
    >
      {isDetectingRegion ? (
        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden />
      ) : (
        <MapPin className={cn('shrink-0', iconOnly ? 'h-4 w-4' : 'h-3.5 w-3.5')} aria-hidden />
      )}
      {!iconOnly ? (
        <span className="max-w-[140px] truncate sm:max-w-none">
          {regionLabel}
          {suffix}
        </span>
      ) : null}
    </button>
  );
}