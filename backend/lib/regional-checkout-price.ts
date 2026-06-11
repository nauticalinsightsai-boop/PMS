import {
  resolveCheckoutUsdCents,
  type CourseOffering,
  type RegionId,
} from '@/lib/regional-catalogue';
import { SEAT_DEPOSIT_FRACTION } from '@/lib/enrollment-pricing';

/** Stripe uses integer minor units except for zero-decimal currencies. */
const ZERO_DECIMAL_CURRENCIES = new Set([
  'bif',
  'clp',
  'djf',
  'gnf',
  'jpy',
  'kmf',
  'krw',
  'mga',
  'pyg',
  'rwf',
  'ugx',
  'vnd',
  'vuv',
  'xaf',
  'xof',
  'xpf',
]);

export interface RegionalCheckoutPrice {
  currency: string;
  unitAmount: number;
  display: string;
  majorAmount: number;
  currencyCode: string;
  usdCents: number | null;
}

function parseDisplayAmount(display: string | null | undefined): number | null {
  if (!display) return null;
  const m = String(display).match(/([\d][\d,]*(?:\.\d{1,2})?)/);
  if (!m) return null;
  const value = parseFloat(m[1].replace(/,/g, ''));
  return Number.isNaN(value) ? null : value;
}

function currencyCodeFromDisplay(display: string): string | null {
  const trimmed = display.trim();
  if (trimmed.startsWith('₹')) return 'INR';
  if (trimmed.startsWith('$')) return 'USD';
  if (trimmed.startsWith('€')) return 'EUR';
  if (trimmed.startsWith('£')) return 'GBP';
  const codeMatch = trimmed.match(/^([A-Z]{3})\b/);
  return codeMatch?.[1] ?? null;
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

function resolveActiveDisplay(
  offering: CourseOffering,
  regionId: RegionId,
  gccCountry?: string | null,
): string | null {
  if (regionId === 'gcc') {
    return gccDisplayForCountry(offering.prices.gcc, gccCountry) ?? offering.prices.gcc.display ?? null;
  }
  return offering.prices[regionId]?.display ?? offering.prices.global.display ?? null;
}

function resolveCurrencyCode(
  display: string,
  offering: CourseOffering,
  regionId: RegionId,
): string {
  return (
    currencyCodeFromDisplay(display) ??
    offering.prices[regionId]?.currencyCode ??
    offering.prices.global.currencyCode ??
    'USD'
  );
}

export function toStripeCurrency(code: string): string {
  return code.trim().toLowerCase();
}

export function toStripeMinorUnits(majorAmount: number, currency: string): number {
  if (ZERO_DECIMAL_CURRENCIES.has(currency)) {
    return Math.round(majorAmount);
  }
  return Math.round(majorAmount * 100);
}

export function minorToMajorAmount(unitAmount: number, currency: string): number {
  if (ZERO_DECIMAL_CURRENCIES.has(currency)) return unitAmount;
  return unitAmount / 100;
}

export function resolveRegionalCheckoutPrice(
  offering: CourseOffering,
  regionId: RegionId,
  gccCountry?: string | null,
): RegionalCheckoutPrice | null {
  const display = resolveActiveDisplay(offering, regionId, gccCountry);
  if (!display) return null;

  const majorAmount = parseDisplayAmount(display);
  if (majorAmount == null || majorAmount <= 0) return null;

  const currencyCode = resolveCurrencyCode(display, offering, regionId);
  const currency = toStripeCurrency(currencyCode);
  const unitAmount = toStripeMinorUnits(majorAmount, currency);

  return {
    currency,
    unitAmount,
    display,
    majorAmount,
    currencyCode,
    usdCents: resolveCheckoutUsdCents(offering, regionId),
  };
}

export function resolveRegionalDepositPrice(full: RegionalCheckoutPrice): RegionalCheckoutPrice {
  const depositUnitAmount = Math.max(Math.round(full.unitAmount * SEAT_DEPOSIT_FRACTION), 1);
  const majorAmount = minorToMajorAmount(depositUnitAmount, full.currency);

  return {
    ...full,
    unitAmount: depositUnitAmount,
    majorAmount,
  };
}

export function formatAmountLikeTemplate(templateDisplay: string, amount: number): string {
  const match = templateDisplay.match(/^(.*?)([\d][\d,]*(?:\.\d{1,2})?)(.*)$/);
  if (!match) return String(Math.round(amount));
  const [, prefix, numStr, suffix] = match;
  const hasDecimals = numStr.includes('.') || !Number.isInteger(amount);
  const formatted = hasDecimals
    ? amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.round(amount).toLocaleString('en-US');
  return `${prefix}${formatted}${suffix}`.trim();
}

export function formatRegionalDepositDisplay(
  activeDisplay: string,
  fraction = SEAT_DEPOSIT_FRACTION,
): string {
  const major = parseDisplayAmount(activeDisplay);
  if (major == null) return activeDisplay;
  const currency = toStripeCurrency(currencyCodeFromDisplay(activeDisplay) ?? 'USD');
  const fullMinor = toStripeMinorUnits(major, currency);
  const depositMinor = Math.max(Math.round(fullMinor * fraction), 1);
  const depositMajor = minorToMajorAmount(depositMinor, currency);
  return formatAmountLikeTemplate(activeDisplay, depositMajor);
}
