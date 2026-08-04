import { parseDisplayAmount } from '@/lib/price-parser';
import type { RegionId } from '@/types/regional-catalogue';

/** Elite scholarship vs Global mentor catalogue: Global visitors. */
export const SCHOLARSHIP_GLOBAL_DISCOUNT = 0.15;
/** Elite scholarship vs Global mentor catalogue: GCC visitors (regional ~20% + invite 15%). */
export const SCHOLARSHIP_GCC_VS_GLOBAL_DISCOUNT = 0.35;

export const SCHOLARSHIP_DISCOUNT = SCHOLARSHIP_GLOBAL_DISCOUNT;
export const SCHOLARSHIP_PAY_FRACTION = 1 - SCHOLARSHIP_GLOBAL_DISCOUNT;
export const SCHOLARSHIP_GCC_PAY_FRACTION = 1 - SCHOLARSHIP_GCC_VS_GLOBAL_DISCOUNT;

export const SCHOLARSHIP_SESSION_MS = 20 * 60 * 1000;
export const SCHOLARSHIP_COOLDOWN_MS = 30 * 60 * 1000;
export const SCHOLARSHIP_OFFER_TYPE = 'scholarship_invite' as const;

export const SCHOLARSHIP_ALLOWED_REGIONS: readonly RegionId[] = ['global', 'gcc'];

export const ELITE_SCHOLARSHIP_HEADING =
  "Congratulations, you're eligible for the Elite scholarship";

export type ScholarshipSessionRecord = {
  openedAt: number;
  expiresAt: number;
};

export type ScholarshipSessionState =
  | { status: 'active'; record: ScholarshipSessionRecord; remainingMs: number }
  | { status: 'cooldown'; record: ScholarshipSessionRecord; remainingMs: number }
  | { status: 'ready' };

export function isScholarshipAllowedRegion(regionId: string | null | undefined): boolean {
  return regionId === 'global' || regionId === 'gcc';
}

/** Professional + mastery (incl. advisory/corporate URL slugs). Foundation excluded. */
export function isScholarshipTier(tierSlug: string | null | undefined): boolean {
  if (!tierSlug) return false;
  return (
    tierSlug === 'professional' ||
    tierSlug === 'mastery' ||
    tierSlug === 'mastery-corporate' ||
    tierSlug === 'mastery-advisory'
  );
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

export function scholarshipStorageKey(offeringId: string): string {
  return `pms-scholarship-session:${offeringId}`;
}

/** Pay fraction of Global mentor catalogue (Global 85%, GCC 65%). */
export function scholarshipPayFraction(regionId: string | null | undefined): number {
  return regionId === 'gcc' ? SCHOLARSHIP_GCC_PAY_FRACTION : SCHOLARSHIP_PAY_FRACTION;
}

/** Discount % vs Global mentor catalogue for copy/metadata. */
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

/**
 * Format Elite price from the Global mentor catalogue display.
 * Global → 15% off; GCC → 35% off (vs Global).
 */
export function applyScholarshipDiscountDisplay(
  globalTemplateDisplay: string | null | undefined,
  regionId: string | null | undefined = 'global',
): string | null {
  if (!globalTemplateDisplay?.trim()) return null;
  const major = parseDisplayAmount(globalTemplateDisplay);
  if (major == null) return null;
  const minor = Math.round(major * 100);
  const discountedMinor = applyScholarshipDiscountMinor(minor, regionId);
  const discountedMajor = discountedMinor / 100;
  const match = globalTemplateDisplay.match(/^(.*?)([\d][\d,]*(?:\.\d{1,2})?)(.*)$/);
  if (!match) return String(discountedMajor);
  const [, prefix, , suffix] = match;
  const formatted = Number.isInteger(discountedMajor)
    ? discountedMajor.toLocaleString('en-US')
    : discountedMajor.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  return `${prefix}${formatted}${suffix}`.trim();
}

export function eliteScholarshipBanner(regionId: string | null | undefined): string {
  const pct = scholarshipDiscountPct(regionId);
  if (regionId === 'gcc') {
    return `Elite scholarship · ${pct}% off Global mentor-led (GCC)`;
  }
  return `Elite scholarship · ${pct}% off Global mentor-led`;
}

export function eliteScholarshipDescription(regionId: string | null | undefined): string {
  const pct = scholarshipDiscountPct(regionId);
  if (regionId === 'gcc') {
    return `Your Elite invite is ${pct}% off the Global mentor-led catalogue price (GCC regional savings plus this invite). Complete checkout within 20 minutes.`;
  }
  return `Your Elite invite is ${pct}% off the Global mentor-led catalogue price. Complete checkout within 20 minutes.`;
}

export function enrollScholarshipPath(siteCertId: string, tierSlug: string): string {
  return `/certifications/${siteCertId}/${tierSlug}/enroll/scholarship`;
}

export function evaluateScholarshipSession(
  record: ScholarshipSessionRecord | null,
  now = Date.now(),
): ScholarshipSessionState {
  if (!record || !Number.isFinite(record.openedAt) || !Number.isFinite(record.expiresAt)) {
    return { status: 'ready' };
  }
  if (now < record.expiresAt) {
    return {
      status: 'active',
      record,
      remainingMs: Math.max(0, record.expiresAt - now),
    };
  }
  const cooldownEndsAt = record.openedAt + SCHOLARSHIP_COOLDOWN_MS;
  if (now < cooldownEndsAt) {
    return {
      status: 'cooldown',
      record,
      remainingMs: Math.max(0, cooldownEndsAt - now),
    };
  }
  return { status: 'ready' };
}

export function startScholarshipSession(now = Date.now()): ScholarshipSessionRecord {
  return {
    openedAt: now,
    expiresAt: now + SCHOLARSHIP_SESSION_MS,
  };
}

export function parseScholarshipSessionRecord(raw: string | null): ScholarshipSessionRecord | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ScholarshipSessionRecord;
    if (
      typeof parsed?.openedAt !== 'number' ||
      typeof parsed?.expiresAt !== 'number' ||
      !Number.isFinite(parsed.openedAt) ||
      !Number.isFinite(parsed.expiresAt)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
