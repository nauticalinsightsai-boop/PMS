'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ENROLLMENT_STATUS, isEnrollmentOpen } from '@/lib/certification-enrollment';
import { useRegion } from '@/contexts/RegionContext';

export function PathwayEnrollmentBadge({
  certId,
  className,
}: {
  certId: string;
  className?: string;
}) {
  const { regionId } = useRegion();
  const open = isEnrollmentOpen(certId, regionId);

  return (
    <Badge
      className={cn(
        'border-none text-[10px] font-bold uppercase tracking-widest px-3 py-1',
        open
          ? 'bg-brand-orange text-white'
          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
        className,
      )}
    >
      {open ? ENROLLMENT_STATUS.open : ENROLLMENT_STATUS.nextCohort}
    </Badge>
  );
}
