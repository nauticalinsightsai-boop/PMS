'use client';

import * as React from 'react';
import { useLeadRecoveryOptional } from '@/components/conversion-recovery/LeadRecoveryProvider';
import { enrollReturnVariant, tierIdFromPathwayTier } from '@/lib/conversion-recovery/copy';
import {
  consumeEnrollStarted,
  findPendingEnrollReturn,
} from '@/lib/conversion-recovery/session-state';

/** On mount, show tier-specific enroll-return recovery when user bounced from checkout. */
export function useEnrollReturnRecovery(siteCertId: string, certName?: string): void {
  const recovery = useLeadRecoveryOptional();

  React.useEffect(() => {
    const pending = findPendingEnrollReturn();
    if (!pending || pending.siteCertId !== siteCertId) return;
    recovery?.requestRecovery(
      {
        variant: enrollReturnVariant(pending.tierId),
        siteCertId: pending.siteCertId,
        certName,
        tierId: tierIdFromPathwayTier(pending.tierId),
        offeringId: pending.offeringId,
        parentSurface: 'enroll',
      },
      { requireIntent: true },
    );
    consumeEnrollStarted(pending.offeringId);
  }, [certName, recovery, siteCertId]);
}
