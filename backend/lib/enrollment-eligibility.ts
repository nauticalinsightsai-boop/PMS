import type { CourseOffering, OfferingStatus, RegionId } from '@/lib/regional-catalogue';

/** Only truly non-purchasable matrix statuses. All other regions may pay in full. */
export function isPaymentBlockedStatus(status: OfferingStatus | undefined): boolean {
  return !status || status === 'waitlist' || status === 'hidden';
}

export function requiresConsultationApproval(status: OfferingStatus | undefined): boolean {
  return status === 'consultation_required';
}

export function assertFullTuitionEligible(
  offering: CourseOffering,
  regionId: RegionId,
): { ok: true } | { ok: false; message: string } {
  const status = offering.regional[regionId]?.status;

  if (isPaymentBlockedStatus(status)) {
    return {
      ok: false,
      message: 'Full payment is not available for this pathway in your region.',
    };
  }

  return { ok: true };
}
