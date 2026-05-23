'use client';

import { MapPin } from 'lucide-react';
import { useRegion } from '@/contexts/RegionContext';
export function RegionChip() {
  const { regionId, regionLabel, openRegionModal } = useRegion();
  const suffix =
    regionId === 'india' || regionId === 'pakistan' ? ' · Regional Scholarship' : '';

  return (
    <button
      type="button"
      onClick={openRegionModal}
      className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-brand-orange hover:text-brand-orange dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300"
    >
      <MapPin className="h-3.5 w-3.5 shrink-0" />
      <span>
        {regionLabel}
        {suffix}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">Change</span>
    </button>
  );
}
