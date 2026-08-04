/** Elite invite scholarship: mentor-led vs Global catalogue (stated 15% Global / 30% GCC; fee-adjusted pay). */

import { DELIVERY_FX_PER_USD } from '@/lib/delivery-pricing';
import {
  elitePayFraction,
  statedEliteOff,
  statedEliteOffPercent,
} from '@/lib/enrollment-pricing-policy';
import { toStripeCurrency, toStripeMinorUnits } from '@/lib/regional-checkout-price';

/** @deprecated Prefer statedEliteOff / elitePayFraction from enrollment-pricing-policy. */
export const SCHOLARSHIP_GLOBAL_DISCOUNT = statedEliteOff('global');
/** @deprecated Prefer statedEliteOff('gcc'): Elite GCC is stated 30%, not 35%. */
export const SCHOLARSHIP_GCC_VS_GLOBAL_DISCOUNT = statedEliteOff('gcc');
export const SCHOLARSHIP_DISCOUNT = SCHOLARSHIP_GLOBAL_DISCOUNT;
export const SCHOLARSHIP_PAY_FRACTION = elitePayFraction('global');
export const SCHOLARSHIP_GCC_PAY_FRACTION = elitePayFraction('gcc');
export const SCHOLARSHIP_OFFER_TYPE = 'scholarship_invite' as const;
export const SCHOLARSHIP_ALLOWED_REGIONS = ['global', 'gcc'] as const;

const GCC_COUNTRY_CURRENCY: Record<string, string> = {
  AE: 'AED',
  SA: 'SAR',
  QA: 'QAR',
  BH: 'BHD',
  KW: 'KWD',
  OM: 'OMR',
};

export type EliteScholarshipPrice = {
  currency: string;
  currencyCode: string;
  unitAmount: number;
  majorAmount: number;
  display: string;
  originalDisplay: string;
  discountPct: number;
  globalUsdMajor: number;
  gccCountry: string | null;
};

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
  return elitePayFraction(regionId);
}

export function scholarshipDiscountPct(regionId: string | null | undefined): number {
  return statedEliteOffPercent(regionId);
}

export function resolveGccEliteCurrencyCode(gccCountry?: string | null): string {
  const key = (gccCountry ?? 'AE').toUpperCase();
  return GCC_COUNTRY_CURRENCY[key] ?? 'AED';
}

function formatEliteUsdMajor(amount: number): string {
  if (Number.isInteger(amount)) return `$${amount.toLocaleString('en-US')}`;
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatEliteLocalMajor(amount: number, currencyCode: string): string {
  return `${currencyCode} ${Math.round(amount).toLocaleString('en-US')}`;
}

/**
 * Elite checkout price from Global mentor USD.
 * Global: USD × elitePayFraction(global). GCC: FX × elitePayFraction(gcc) in country currency.
 */
export function resolveEliteScholarshipPrice(input: {
  globalUsdMajor: number;
  regionId: string | null | undefined;
  gccCountry?: string | null;
}): EliteScholarshipPrice | null {
  const { globalUsdMajor, regionId } = input;
  if (!Number.isFinite(globalUsdMajor) || globalUsdMajor <= 0) return null;

  const discountPct = scholarshipDiscountPct(regionId);
  const pay = scholarshipPayFraction(regionId);

  if (regionId !== 'gcc') {
    const unitAmount = Math.max(1, Math.round(globalUsdMajor * 100 * pay));
    const majorAmount = unitAmount / 100;
    return {
      currency: 'usd',
      currencyCode: 'USD',
      unitAmount,
      majorAmount,
      display: formatEliteUsdMajor(majorAmount),
      originalDisplay: formatEliteUsdMajor(globalUsdMajor),
      discountPct,
      globalUsdMajor,
      gccCountry: null,
    };
  }

  const country = (input.gccCountry ?? 'AE').toUpperCase();
  const currencyCode = resolveGccEliteCurrencyCode(country);
  const fx = DELIVERY_FX_PER_USD[currencyCode];
  if (fx == null || fx <= 0) return null;

  const originalMajor = Math.round(globalUsdMajor * fx);
  const majorAmount = Math.round(globalUsdMajor * fx * pay);
  const currency = toStripeCurrency(currencyCode);
  const unitAmount = Math.max(1, toStripeMinorUnits(majorAmount, currency));

  return {
    currency,
    currencyCode,
    unitAmount,
    majorAmount,
    display: formatEliteLocalMajor(majorAmount, currencyCode),
    originalDisplay: formatEliteLocalMajor(originalMajor, currencyCode),
    discountPct,
    globalUsdMajor,
    gccCountry: country,
  };
}

/** USD-cents helper for Global-only paths / legacy tests. */
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
