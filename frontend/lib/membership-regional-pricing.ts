import type { GccCountryCode, RegionId } from '@/types/regional-catalogue';
import {
  formatAmountLikeTemplate,
  gccDisplayForCountry,
  parseDisplayAmount,
} from '@/lib/price-parser';
import { currencyCodeFromDisplay, fxPerUsdForDisplay } from '@/lib/regional-fx-rates';
import { pickListingTierOffering } from '@/lib/regional-catalogue';

/** Largest price ≤ `amount` ending in .99 (never rounds up). */
export function floorToCharm99(amount: number, useDecimalCurrency: boolean): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;

  if (useDecimalCurrency) {
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

function shouldUseDecimalCharm(templateDisplay: string, regionId: RegionId): boolean {
  if (regionId === 'global') return true;
  const code = currencyCodeFromDisplay(templateDisplay);
  if (code === 'USD' || code === 'EUR' || code === 'GBP') return true;
  const trimmed = templateDisplay.trim();
  if (/^[$€£]/.test(trimmed)) {
    const amount = parseDisplayAmount(trimmed);
    return amount != null && !Number.isInteger(amount);
  }
  const num = trimmed.match(/([\d][\d,]*(?:\.\d{1,2})?)/)?.[1];
  return Boolean(num?.includes('.'));
}

/** Sample matrix display string for formatting membership prices in the active region. */
export function getMembershipPriceTemplate(
  regionId: RegionId,
  gccCountry: GccCountryCode | null,
): string {
  const offering = pickListingTierOffering('pmp');
  if (!offering) return '$0';

  if (regionId === 'gcc') {
    const gcc = offering.prices.gcc;
    return gccDisplayForCountry(gcc, gccCountry) ?? gcc.display ?? '$0';
  }

  return offering.prices[regionId]?.display ?? offering.prices.global.display ?? '$0';
}

export function convertMembershipUsdToRegional(
  usdAmount: number,
  regionId: RegionId,
  gccCountry: GccCountryCode | null,
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

export interface RegionalMembershipAmounts {
  monthly: string;
  yearly: string;
  monthlyNumeric: number;
  yearlyNumeric: number;
}

export function getRegionalMembershipAmounts(
  monthlyUsd: number,
  yearlyUsd: number,
  regionId: RegionId,
  gccCountry: GccCountryCode | null,
): RegionalMembershipAmounts {
  const monthly = convertMembershipUsdToRegional(monthlyUsd, regionId, gccCountry);
  const yearly = convertMembershipUsdToRegional(yearlyUsd, regionId, gccCountry);
  return {
    monthly: monthly.display,
    yearly: yearly.display,
    monthlyNumeric: monthly.numeric,
    yearlyNumeric: yearly.numeric,
  };
}
