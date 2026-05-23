import type { RegionId } from '@/types/regional-catalogue';

export const MEMBERSHIP_DISCOUNT_RATE = 0.2;

/** Apply 20% off the numeric portion of a regional display string (keeps currency symbol/format). */
export function applyMembershipDiscountDisplay(display: string | null | undefined): string | null {
  if (!display) return null;
  const trimmed = display.trim();
  const match = trimmed.match(/^(.*?)([\d][\d,]*(?:\.\d{1,2})?)(.*)$/);
  if (!match) return null;
  const [, prefix, numStr, suffix] = match;
  const value = parseFloat(numStr.replace(/,/g, ''));
  if (Number.isNaN(value)) return null;
  const discounted = Math.round(value * (1 - MEMBERSHIP_DISCOUNT_RATE));
  return `${prefix}${discounted.toLocaleString('en-US')}${suffix}`.trim();
}

export function regionalPriceLabel(regionId: RegionId, useScholarshipWording: boolean): string {
  if (useScholarshipWording) return 'Regional Scholarship price';
  if (regionId === 'india' || regionId === 'pakistan') return 'Regional Scholarship price';
  if (regionId === 'gcc') return 'Regional Scholarship price';
  return 'Regional price';
}

export interface FullRegionalPriceDisplay {
  original: string | null;
  active: string | null;
  membership: string | null;
  showScholarshipLabels: boolean;
  footnote: string | null;
  regionalLabel: string;
}
