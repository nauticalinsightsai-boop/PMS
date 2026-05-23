/** Parse display price strings from the regional matrix. */

import type { CourseOffering, RegionId } from '@/types/regional-catalogue';
import { fxPerUsdForDisplay } from '@/lib/regional-fx-rates';

export function parseDisplayAmount(display: string | null | undefined): number | null {
  if (!display) return null;
  const m = String(display).match(/([\d][\d,]*(?:\.\d{1,2})?)/);
  if (!m) return null;
  const value = parseFloat(m[1].replace(/,/g, ''));
  return Number.isNaN(value) ? null : value;
}

/** Format a numeric amount using the prefix/suffix pattern from a matrix display string. */
export function formatAmountLikeTemplate(templateDisplay: string, amount: number): string {
  const match = templateDisplay.match(/^(.*?)([\d][\d,]*(?:\.\d{1,2})?)(.*)$/);
  if (!match) return String(Math.round(amount));
  const [, prefix, numStr, suffix] = match;
  const hasDecimals = numStr.includes('.');
  const formatted = hasDecimals
    ? amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.round(amount).toLocaleString('en-US');
  return `${prefix}${formatted}${suffix}`.trim();
}

/**
 * Express global USD list price in the same currency/format as active regional tuition
 * via direct USD → local conversion (display-only; checkout uses matrix usdCents).
 */
export function resolveComparableGlobalReference(
  offering: CourseOffering,
  regionId: RegionId,
  activeDisplay: string | null,
  _gccCountry?: string | null
): string | null {
  const globalDisplay = offering.prices.global.display;
  if (!globalDisplay || !activeDisplay) return null;

  const globalUsd = parseDisplayAmount(globalDisplay);
  if (globalUsd == null) return null;

  if (regionId === 'global') return globalDisplay;

  const fx = fxPerUsdForDisplay(activeDisplay, regionId);
  if (fx == null) return null;

  const converted = Math.round(globalUsd * fx);
  return formatAmountLikeTemplate(activeDisplay, converted);
}

export function parseUsdCentsFromDisplay(display: string | null | undefined): number | null {
  if (!display) return null;
  const m = String(display).match(/\$\s*([\d,]+(?:\.\d{2})?)/);
  if (!m) return null;
  return Math.round(parseFloat(m[1].replace(/,/g, '')) * 100);
}

export function gccDisplayForCountry(
  gccPrice: { display?: string | null; perCountry?: Record<string, string> },
  countryCode: string | null | undefined
): string | null {
  if (countryCode && gccPrice.perCountry?.[countryCode]) {
    return gccPrice.perCountry[countryCode];
  }
  return gccPrice.display ?? null;
}

export function showsOriginalVsScholarship(
  regionId: string,
  status: string,
  globalDisplay: string | null,
  activeDisplay: string | null
): boolean {
  if (!globalDisplay || !activeDisplay) return false;
  if (globalDisplay.trim() === activeDisplay.trim()) return false;
  if (regionId === 'india' || regionId === 'pakistan') {
    return (
      status === 'scholarship_verify' ||
      status === 'scholarship_unavailable' ||
      globalDisplay !== activeDisplay
    );
  }
  if (regionId === 'gcc') return true;
  if (regionId === 'europe' || regionId === 'uk') return true;
  return globalDisplay !== activeDisplay;
}
