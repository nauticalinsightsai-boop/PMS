/** Invite scholarship checkout: mentor-led 15% off regional mentor catalogue price. */

export const SCHOLARSHIP_DISCOUNT = 0.15;
export const SCHOLARSHIP_PAY_FRACTION = 1 - SCHOLARSHIP_DISCOUNT;
export const SCHOLARSHIP_OFFER_TYPE = 'scholarship_invite' as const;
export const SCHOLARSHIP_ALLOWED_REGIONS = ['global', 'gcc'] as const;

export function isScholarshipOfferType(raw: unknown): boolean {
  return raw === SCHOLARSHIP_OFFER_TYPE;
}

export function isScholarshipAllowedRegion(regionId: string | null | undefined): boolean {
  return regionId === 'global' || regionId === 'gcc';
}

export function isScholarshipTierId(tierId: string | null | undefined): boolean {
  if (!tierId) return false;
  return (
    tierId === 'professional' ||
    tierId === 'mastery' ||
    tierId === 'mastery_corporate' ||
    tierId === 'mastery_advisory'
  );
}

export function applyScholarshipDiscountMinor(unitAmount: number, floor = 1): number {
  if (!Number.isFinite(unitAmount) || unitAmount <= 0) return floor;
  return Math.max(floor, Math.round(unitAmount * SCHOLARSHIP_PAY_FRACTION));
}

export function scholarshipOfferError(
  tierId: string | null | undefined,
  regionId: string | null | undefined,
): string | null {
  if (!isScholarshipTierId(tierId)) {
    return 'Scholarship checkout is only available for Professional and Mastery pathways.';
  }
  if (!isScholarshipAllowedRegion(regionId)) {
    return 'Scholarship checkout is only available for Global and GCC regions.';
  }
  return null;
}
