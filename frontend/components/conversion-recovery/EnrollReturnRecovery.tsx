'use client';

import { useEnrollReturnRecovery } from '@/components/conversion-recovery/useEnrollReturnRecovery';

export function EnrollReturnRecovery({
  siteCertId,
  certName,
}: {
  siteCertId: string;
  certName?: string;
}) {
  useEnrollReturnRecovery(siteCertId, certName);
  return null;
}
