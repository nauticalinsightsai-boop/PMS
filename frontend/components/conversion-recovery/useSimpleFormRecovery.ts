'use client';

import * as React from 'react';
import { useLeadRecoveryOptional } from '@/components/conversion-recovery/LeadRecoveryProvider';
import { useFormPartialRecovery } from '@/components/conversion-recovery/useFormPartialRecovery';
import type { LeadRecoveryContext, LeadRecoveryVariant } from '@/lib/conversion-recovery/types';

/** Wire partial-fill lead recovery for simple contact-style forms. */
export function useSimpleFormRecovery(opts: {
  variant: LeadRecoveryVariant;
  isDone: boolean;
  hasPartialData: boolean;
  parentSurface?: LeadRecoveryContext['parentSurface'];
  siteCertId?: string;
  offeringId?: string;
  channelId?: string;
}) {
  const recovery = useLeadRecoveryOptional();
  const { markTouched } = useFormPartialRecovery({
    variant: opts.variant,
    isSubmitted: opts.isDone,
    hasPartialData: opts.hasPartialData,
    extraContext: {
      siteCertId: opts.siteCertId,
      offeringId: opts.offeringId,
      channelId: opts.channelId,
      parentSurface: opts.parentSurface,
    },
    onRequestRecovery: (ctx) => recovery?.requestRecovery(ctx, { requireIntent: true }),
  });

  const touch = React.useCallback(() => {
    recovery?.markFormTouched();
    markTouched();
  }, [markTouched, recovery]);

  const onSuccess = React.useCallback(() => {
    recovery?.notifyConverted();
  }, [recovery]);

  return { touch, onSuccess };
}
