'use client';

import { getCohortEnrollmentDisplay } from '@/lib/certification-enrollment';
import { useRegion } from '@/contexts/RegionContext';
import { cn } from '@/lib/utils';

export function PathwayCohortNote({
  certId,
  className,
}: {
  certId: string;
  className?: string;
}) {
  const { regionId } = useRegion();
  const { note } = getCohortEnrollmentDisplay(certId, regionId);

  return (
    <p className={cn('text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed', className)}>
      {note}
    </p>
  );
}
