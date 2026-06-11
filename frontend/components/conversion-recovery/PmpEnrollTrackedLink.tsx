'use client';

import { TrackedConversionLink } from '@/components/analytics/TrackedConversionLink';
import type { ConversionEventName } from '@/lib/analytics/conversion-events';
import { markIntent } from '@/lib/conversion-recovery/engagement-score';
import { resolveOfferingForEnrollment } from '@/lib/enrollment-routes';
import { setEnrollStarted } from '@/lib/conversion-recovery/session-state';
import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof TrackedConversionLink> & {
  event: ConversionEventName;
  tierSlug: string;
  siteCertId?: string;
};

export function PmpEnrollTrackedLink({
  tierSlug,
  siteCertId = 'pmp',
  event,
  onClick,
  ...props
}: Props) {
  return (
    <TrackedConversionLink
      {...props}
      event={event}
      onClick={(e) => {
        const offering = resolveOfferingForEnrollment(siteCertId, tierSlug);
        if (offering) {
          setEnrollStarted(offering.id, offering.tierId, siteCertId);
        }
        markIntent();
        onClick?.(e);
      }}
    />
  );
}
