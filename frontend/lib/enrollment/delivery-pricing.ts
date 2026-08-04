/**
 * Delivery-mode pricing: Foundation self-paced + Professional mentor/self-paced.
 * Regional amounts derive from Global USD via FX + charm rules.
 */

import {
  regionalPayFraction,
  statedRegionalOff,
} from '@/lib/enrollment/enrollment-pricing-policy';
import { GLOBAL_REFERENCE_FX_PER_USD } from '@/lib/regional-fx-rates';
import type { RegionId, RegionalPrice, TierId } from '@/types/regional-catalogue';
import gccOwnerOverrides from '../../../packages/regional-catalogue/gcc-owner-overrides.json';

export type EnrollmentDeliveryMode = 'mentor_led' | 'self_paced';

export const FOUNDATION_PRICE_FRACTION = 0.3;
export const SELF_PACED_GLOBAL_FRACTION = 0.5;

const GCC_COUNTRIES = ['AE', 'SA', 'QA', 'BH', 'KW', 'OM'] as const;
type GccCode = (typeof GCC_COUNTRIES)[number];

const GCC_CURRENCY: Record<GccCode, string> = {
  AE: 'AED',
  SA: 'SAR',
  QA: 'QAR',
  BH: 'BHD',
  KW: 'KWD',
  OM: 'OMR',
};

/** Nearest amount on the …49 / …99 ladder (n ≡ 49 mod 50). */
export function nearestCharm50(n: number): number {
  if (!Number.isFinite(n) || n <= 49) return 49;
  const k = Math.round((n - 49) / 50);
  return Math.max(49, k * 50 + 49);
}

/** Round up to the next …49 / …99 (used for EU/UK FX conversion). */
export function ceilCharm50(n: number): number {
  if (!Number.isFinite(n) || n <= 49) return 49;
  const k = Math.ceil((n - 49) / 50);
  return Math.max(49, k * 50 + 49);
}

/** Existing fallback for GCC values not explicitly locked by the owner table. */
export function ceilCharm99(n: number): number {
  if (!Number.isFinite(n) || n <= 99) return 99;
  return Math.ceil((n + 1) / 100) * 100 - 1;
}

/** Smallest amount ending in 999 that is >= n (INR / PKR). */
export function charm999(n: number): number {
  if (!Number.isFinite(n) || n <= 999) return 999;
  return Math.ceil((n + 1) / 1000) * 1000 - 1;
}

export function deriveFoundationUsd(currentGlobalUsd: number): number {
  return nearestCharm50(currentGlobalUsd * FOUNDATION_PRICE_FRACTION);
}

export function deriveSelfPacedUsd(mentorGlobalUsd: number): number {
  return nearestCharm50(mentorGlobalUsd * SELF_PACED_GLOBAL_FRACTION);
}

/** Stated regional off (for labels). Money uses payFractionForRegion (fee-adjusted). */
export function regionalDiscountOffFraction(
  tierId: TierId | string,
  regionId: RegionId,
): number {
  return statedRegionalOff(tierId, regionId);
}

export function payFractionForRegion(tierId: TierId | string, regionId: RegionId): number {
  return regionalPayFraction(tierId, regionId);
}

function fxForCurrency(code: string): number {
  if (code === 'USD') return 1;
  const fx = GLOBAL_REFERENCE_FX_PER_USD[code];
  if (fx == null) throw new Error(`Missing FX for ${code}`);
  return fx;
}

function formatMajor(amount: number, currencyCode: string): string {
  const rounded = Math.round(amount);
  const formatted = rounded.toLocaleString('en-US');
  switch (currencyCode) {
    case 'USD':
      return `$${formatted}`;
    case 'EUR':
      return `€${formatted}`;
    case 'GBP':
      return `£${formatted}`;
    case 'INR':
      return `₹${formatted}`;
    default:
      return `${currencyCode} ${formatted}`;
  }
}

export type RegionalizedAmount = {
  major: number;
  currencyCode: string;
  display: string;
};

/** Convert Global USD to a single-currency regional major + display. */
export function regionalizeUsd(
  usd: number,
  regionId: RegionId,
  tierId: TierId | string,
  gccCountry?: GccCode | null,
): RegionalizedAmount {
  const pay = payFractionForRegion(tierId, regionId);

  if (regionId === 'global') {
    const major = nearestCharm50(usd);
    return { major, currencyCode: 'USD', display: formatMajor(major, 'USD') };
  }

  if (regionId === 'europe') {
    const major = ceilCharm50(usd * fxForCurrency('EUR') * pay);
    return { major, currencyCode: 'EUR', display: formatMajor(major, 'EUR') };
  }

  if (regionId === 'uk') {
    const major = ceilCharm50(usd * fxForCurrency('GBP') * pay);
    return { major, currencyCode: 'GBP', display: formatMajor(major, 'GBP') };
  }

  if (regionId === 'india') {
    const major = charm999(usd * fxForCurrency('INR') * pay);
    return { major, currencyCode: 'INR', display: formatMajor(major, 'INR') };
  }

  if (regionId === 'pakistan') {
    const major = charm999(usd * fxForCurrency('PKR') * pay);
    return { major, currencyCode: 'PKR', display: formatMajor(major, 'PKR') };
  }

  // gcc-owner-overrides.json: explicit locks are owner-authored exceptions (unchanged by fee policy).
  // Derived fallbacks use policy pay fraction (stated regional off minus silent processing fee).
  const country = gccCountry ?? 'AE';
  const currencyCode = GCC_CURRENCY[country];
  const overrideKey = `${tierId}:${usd}:${country}` as keyof typeof gccOwnerOverrides;
  const explicit = gccOwnerOverrides[overrideKey];
  const major = typeof explicit === 'number'
    ? explicit
    : ceilCharm99(usd * fxForCurrency(currencyCode) * pay);
  return { major, currencyCode, display: formatMajor(major, currencyCode) };
}

export function buildGccPerCountry(
  usd: number,
  tierId: TierId | string,
): Record<string, string> {
  const perCountry: Record<string, string> = {};
  for (const code of GCC_COUNTRIES) {
    perCountry[code] = regionalizeUsd(usd, 'gcc', tierId, code).display;
  }
  return perCountry;
}

export function buildGccCompositeDisplay(perCountry: Record<string, string>): string {
  return GCC_COUNTRIES.map((c) => perCountry[c]).filter(Boolean).join(' / ');
}

/** Build a full RegionalPrice row for one region from Global USD. */
export function buildRegionalPriceFromUsd(
  usd: number,
  regionId: RegionId,
  tierId: TierId | string,
): RegionalPrice {
  const usdCents = Math.round(usd * 100);
  const isScholarship =
    tierId !== 'foundation' &&
    (regionId === 'india' || regionId === 'pakistan' || regionId === 'gcc');

  if (regionId === 'gcc') {
    const perCountry = buildGccPerCountry(usd, tierId);
    return {
      display: buildGccCompositeDisplay(perCountry),
      usdCents,
      currencyCode: 'GCC',
      isScholarship,
      perCountry,
    };
  }

  const { display, currencyCode } = regionalizeUsd(usd, regionId, tierId);
  return {
    display,
    usdCents,
    currencyCode,
    isScholarship,
  };
}

const REGION_IDS: RegionId[] = ['global', 'europe', 'uk', 'gcc', 'india', 'pakistan'];

export function buildAllRegionPricesFromUsd(
  usd: number,
  tierId: TierId | string,
): Record<RegionId, RegionalPrice> {
  const out = {} as Record<RegionId, RegionalPrice>;
  for (const regionId of REGION_IDS) {
    out[regionId] = buildRegionalPriceFromUsd(usd, regionId, tierId);
  }
  return out;
}
