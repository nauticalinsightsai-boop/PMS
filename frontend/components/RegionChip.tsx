'use client';

import * as React from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { useRegion } from '@/contexts/RegionContext';
import { cn } from '@/lib/utils';

export function RegionChip({ className }: { className?: string }) {
  const {
    regionId,
    regionLabel,
    canChangeRegion,
    isDetectingRegion,
    openRegionModal,
    shareLocationForRegion,
  } = useRegion();
  const [locationError, setLocationError] = React.useState(false);

  const suffix =
    regionId === 'india' || regionId === 'pakistan' ? ' · Regional Scholarship' : '';

  const handleClick = async () => {
    setLocationError(false);
    if (canChangeRegion) {
      openRegionModal();
      return;
    }
    const ok = await shareLocationForRegion();
    if (!ok) setLocationError(true);
  };

  const ariaLabel = canChangeRegion
    ? `Region: ${regionLabel}. Click to change region.`
    : isDetectingRegion
      ? 'Detecting your location…'
      : locationError
        ? `Region: ${regionLabel}. Location access denied: enable location in your browser to change region.`
        : `Region: ${regionLabel}. Share your location to change region.`;

  const title = canChangeRegion
    ? 'Change pricing region'
    : locationError
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
        'flex min-h-11 items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground',
        canChangeRegion
          ? 'hover:border-brand-orange hover:text-brand-orange'
          : 'cursor-pointer hover:border-border hover:text-muted-foreground',
        isDetectingRegion && 'opacity-70',
        className,
      )}
    >
      {isDetectingRegion ? (
        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden />
      ) : (
        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
      )}
      <span className="max-w-[140px] truncate sm:max-w-none">
        {regionLabel}
        {suffix}
      </span>
    </button>
  );
}