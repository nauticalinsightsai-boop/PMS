/** Elite invite scholarship: mentor-led vs Global catalogue (Global −15%, GCC −35%). */

export const SCHOLARSHIP_GLOBAL_DISCOUNT = 0.15;
export const SCHOLARSHIP_GCC_VS_GLOBAL_DISCOUNT = 0.35;
export const SCHOLARSHIP_DISCOUNT = SCHOLARSHIP_GLOBAL_DISCOUNT;
export const SCHOLARSHIP_PAY_FRACTION = 1 - SCHOLARSHIP_GLOBAL_DISCOUNT;
export const SCHOLARSHIP_GCC_PAY_FRACTION = 1 - SCHOLARSHIP_GCC_VS_GLOBAL_DISCOUNT;
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

export function scholarshipPayFraction(regionId: string | null | undefined): number {
  return regionId === 'gcc' ? SCHOLARSHIP_GCC_PAY_FRACTION : SCHOLARSHIP_PAY_FRACTION;
}

export function scholarshipDiscountPct(regionId: string | null | undefined): number {
  return regionId === 'gcc'
    ? Math.round(SCHOLARSHIP_GCC_VS_GLOBAL_DISCOUNT * 100)
    : Math.round(SCHOLARSHIP_GLOBAL_DISCOUNT * 100);
}

export function applyScholarshipDiscountMinor(
  globalUnitAmount: number,
  regionId: string | null | undefined = 'global',
  floor = 1,
): number {
  if (!Number.isFinite(globalUnitAmount) || globalUnitAmount <= 0) return floor;
  return Math.max(floor, Math.round(globalUnitAmount * scholarshipPayFraction(regionId)));
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
