'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getCohortEnrollmentDisplay } from '@/lib/certification-enrollment';
import { useRegion } from '@/contexts/RegionContext';

export function PathwayEnrollmentBadge({
  certId,
  className,
}: {
  certId: string;
  className?: string;
}) {
  const { regionId } = useRegion();
  const { isOpen, badgeText } = getCohortEnrollmentDisplay(certId, regionId);

  return (
    <Badge
      className={cn(
        'border-none text-[10px] font-bold uppercase tracking-widest px-3 py-1',
        isOpen
          ? 'bg-brand-orange text-white'
          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
        className,
      )}
    >
      {badgeText}
    </Badge>
  );
}
