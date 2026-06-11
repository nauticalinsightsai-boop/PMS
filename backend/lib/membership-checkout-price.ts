import type { RegionId } from '@/lib/regional-catalogue';
import { getOfferingById } from '@/lib/regional-catalogue';
import {
  formatAmountLikeTemplate,
  toStripeCurrency,
  toStripeMinorUnits,
} from '@/lib/regional-checkout-price';

const PRICING = {
  professional: { monthlyUsd: 19, yearlyUsd: 199 },
  mastery: { monthlyUsd: 49, yearlyUsd: 499 },
} as const;

const FX_PER_USD: Record<string, number> = {
  AED: 3.6725,
  SAR: 3.75,
  QAR: 3.64,
  BHD: 0.376,
  KWD: 0.307,
  OMR: 0.385,
  PKR: 278,
  INR: 83,
  EUR: 0.92,
  GBP: 0.79,
};

export type MembershipTierId = keyof typeof PRICING;
export type MembershipBilling = 'monthly' | 'yearly';

function floorToCharm99(amount: number, useDecimal: boolean): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  if (useDecimal) {
    const whole = Math.floor(amount);
    if (whole < 1) return Math.floor(amount * 100) / 100;
    const candidate = whole - 0.01;
    return candidate <= amount ? candidate : Math.max(0, whole - 1) + 0.99;
  }
  const floored = Math.floor(amount);
  if (floored < 99) return floored;
  const block = Math.floor(floored / 100);
  let candidate = block * 100 + 99;
  if (candidate > floored) candidate = (block - 1) * 100 + 99;
  return Math.max(0, candidate);
}

function currencyCodeFromDisplay(display: string): string | null {
  const trimmed = display.trim();
  if (trimmed.startsWith('₹')) return 'INR';
  if (trimmed.startsWith('$')) return 'USD';
  if (trimmed.startsWith('€')) return 'EUR';
  if (trimmed.startsWith('£')) return 'GBP';
  return trimmed.match(/^([A-Z]{3})\b/)?.[1] ?? null;
}

function gccDisplayForCountry(
  gccPrice: { display?: string | null; perCountry?: Record<string, string> },
  countryCode: string | null | undefined,
): string | null {
  if (countryCode && gccPrice.perCountry?.[countryCode]) {
    return gccPrice.perCountry[countryCode];
  }
  return gccPrice.display ?? null;
}

function getMembershipPriceTemplate(regionId: RegionId, gccCountry?: string | null): string {
  const offering = getOfferingById('pmp-preparation-professional');
  if (!offering) return '$0';

  if (regionId === 'gcc') {
    const gcc = offering.prices.gcc;
    return gccDisplayForCountry(gcc, gccCountry) ?? gcc.display ?? '$0';
  }

  return offering.prices[regionId]?.display ?? offering.prices.global.display ?? '$0';
}

function shouldUseDecimalCharm(templateDisplay: string, regionId: RegionId): boolean {
  if (regionId === 'global') return true;
  const code = currencyCodeFromDisplay(templateDisplay);
  if (code === 'USD' || code === 'EUR' || code === 'GBP') return true;
  const trimmed = templateDisplay.trim();
  if (/^[$€£]/.test(trimmed)) {
    const m = trimmed.match(/([\d][\d,]*(?:\.\d{1,2})?)/);
    return Boolean(m?.[1]?.includes('.'));
  }
  return Boolean(trimmed.match(/([\d][\d,]*\.?\d{1,2})?/)?.[1]?.includes('.'));
}

function fxPerUsdForDisplay(display: string, regionId: RegionId): number | null {
  const code = currencyCodeFromDisplay(display);
  if (code && FX_PER_USD[code] != null) return FX_PER_USD[code];
  if (regionId === 'europe') return FX_PER_USD.EUR;
  if (regionId === 'uk') return FX_PER_USD.GBP;
  return null;
}

function formatMembershipDisplay(
  templateDisplay: string,
  amount: number,
  useDecimalCurrency: boolean,
): string {
  if (!useDecimalCurrency) {
    return formatAmountLikeTemplate(templateDisplay, amount);
  }
  const trimmed = templateDisplay.trim();
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (trimmed.startsWith('$')) return `$${formatted}`;
  if (trimmed.startsWith('€')) return `€${formatted}`;
  if (trimmed.startsWith('£')) return `£${formatted}`;
  return formatAmountLikeTemplate(templateDisplay, amount);
}

function convertMembershipUsdToRegional(
  usdAmount: number,
  regionId: RegionId,
  gccCountry?: string | null,
): { numeric: number; display: string } {
  const template = getMembershipPriceTemplate(regionId, gccCountry);
  const useDecimals = shouldUseDecimalCharm(template, regionId);

  if (usdAmount <= 0) {
    return { numeric: 0, display: formatMembershipDisplay(template, 0, useDecimals) };
  }

  if (regionId === 'global') {
    const numeric = floorToCharm99(usdAmount, useDecimals);
    return { numeric, display: formatMembershipDisplay(template, numeric, useDecimals) };
  }

  const fx = fxPerUsdForDisplay(template, regionId);
  if (fx == null) {
    const numeric = floorToCharm99(usdAmount, useDecimals);
    return { numeric, display: formatMembershipDisplay(template, numeric, useDecimals) };
  }

  const raw = usdAmount * fx;
  const numeric = floorToCharm99(raw, useDecimals);
  return { numeric, display: formatMembershipDisplay(template, numeric, useDecimals) };
}

export function resolveMembershipCheckoutPrice(
  tier: MembershipTierId,
  billing: MembershipBilling,
  regionId: RegionId,
  gccCountry?: string | null,
): { currency: string; unitAmount: number; display: string; usdReference: number } | null {
  const row = PRICING[tier];
  const usdAmount = billing === 'monthly' ? row.monthlyUsd : row.yearlyUsd;
  if (usdAmount <= 0) return null;

  const regional = convertMembershipUsdToRegional(usdAmount, regionId, gccCountry);
  const template = getMembershipPriceTemplate(regionId, gccCountry);
  const code = currencyCodeFromDisplay(template) ?? 'USD';
  const currency = toStripeCurrency(code);
  const unitAmount = toStripeMinorUnits(regional.numeric, currency);
  const period = billing === 'monthly' ? '/mo' : '/yr';

  return {
    currency,
    unitAmount,
    display: `${regional.display.replace(/\/(mo|yr)$/, '')}`.replace(/\s+$/, '') + period,
    usdReference: usdAmount * 100,
  };
}
