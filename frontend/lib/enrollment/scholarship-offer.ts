import { parseDisplayAmount } from '@/lib/price-parser';
import type { RegionId } from '@/types/regional-catalogue';

export const SCHOLARSHIP_DISCOUNT = 0.15;
export const SCHOLARSHIP_PAY_FRACTION = 1 - SCHOLARSHIP_DISCOUNT;
export const SCHOLARSHIP_SESSION_MS = 15 * 60 * 1000;
export const SCHOLARSHIP_COOLDOWN_MS = 30 * 60 * 1000;
export const SCHOLARSHIP_OFFER_TYPE = 'scholarship_invite' as const;

export const SCHOLARSHIP_ALLOWED_REGIONS: readonly RegionId[] = ['global', 'gcc'];

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

export function applyScholarshipDiscountMinor(unitAmount: number, floor = 1): number {
  if (!Number.isFinite(unitAmount) || unitAmount <= 0) return floor;
  return Math.max(floor, Math.round(unitAmount * SCHOLARSHIP_PAY_FRACTION));
}

export function applyScholarshipDiscountDisplay(
  templateDisplay: string | null | undefined,
): string | null {
  if (!templateDisplay?.trim()) return null;
  const major = parseDisplayAmount(templateDisplay);
  if (major == null) return null;
  // Match server: discount minor units (cents), then format — avoids $764 UI vs $764.15 Stripe.
  const minor = Math.round(major * 100);
  const discountedMinor = applyScholarshipDiscountMinor(minor);
  const discountedMajor = discountedMinor / 100;
  const match = templateDisplay.match(/^(.*?)([\d][\d,]*(?:\.\d{1,2})?)(.*)$/);
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
