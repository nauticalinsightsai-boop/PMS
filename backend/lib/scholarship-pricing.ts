import { countries } from 'country-flag-icons';
import { getCatalogue, getOfferingById, type CourseOffering } from '@/lib/regional-catalogue';
import {
  evaluateScholarshipCountry,
  exactScholarshipUnitAmount,
  formatScholarshipAmount,
  isScholarshipPathwayTierAllowed,
  scholarshipLevelForTierId,
  siteIdForScholarshipCourse,
  toExactMinorUnits,
  type ScholarshipLevel,
  type ScholarshipMarket,
} from '@/lib/scholarship-core';

const KNOWN_COUNTRY_CODES = new Set(countries.map((code) => code.toUpperCase()));

export type ScholarshipPrice = {
  currency: string;
  baseUnitAmount: number;
  finalUnitAmount: number;
  baseDisplay: string;
  finalDisplay: string;
  baseUsdCents: number;
  finalUsdCents: number;
};

export type ScholarshipRouteIdentity = {
  offering: CourseOffering;
  siteCertId: string;
  level: ScholarshipLevel;
  tierSlug: ScholarshipLevel;
  market: ScholarshipMarket;
};

function parseDisplay(display: string): { currency: string; majorAmount: number } | null {
  const numberMatch = display.match(/([\d][\d,]*(?:\.\d{1,3})?)/);
  if (!numberMatch) return null;
  const majorAmount = Number(numberMatch[1].replace(/,/g, ''));
  if (!Number.isFinite(majorAmount) || majorAmount <= 0) return null;
  const trimmed = display.trim();
  const currency = trimmed.startsWith('$')
    ? 'USD'
    : trimmed.startsWith('€')
      ? 'EUR'
      : trimmed.startsWith('£')
        ? 'GBP'
        : trimmed.match(/^([A-Z]{3})\b/)?.[1];
  return currency ? { currency, majorAmount } : null;
}

export function resolveScholarshipRouteIdentity(input: {
  offeringId: string;
  siteCertId: string;
  tierSlug: string;
  market: ScholarshipMarket;
}): ScholarshipRouteIdentity | null {
  const offering = getOfferingById(input.offeringId);
  if (!offering) return null;
  const siteCertId = input.siteCertId.trim().toLowerCase();
  const level = scholarshipLevelForTierId(offering.tierId);
  if (!level || input.tierSlug.trim().toLowerCase() !== level) return null;
  if (siteIdForScholarshipCourse(offering.courseName) !== siteCertId) return null;
  if (!isScholarshipPathwayTierAllowed(siteCertId, offering.tierId)) return null;
  const canonical = getCatalogue().offerings.find((candidate) =>
    siteIdForScholarshipCourse(candidate.courseName) === siteCertId &&
    isScholarshipPathwayTierAllowed(siteCertId, candidate.tierId) &&
    scholarshipLevelForTierId(candidate.tierId) === level,
  );
  if (canonical?.offeringId !== offering.offeringId) return null;
  return { offering, siteCertId, level, tierSlug: level, market: input.market };
}

export function resolveScholarshipPrice(
  offering: CourseOffering,
  market: ScholarshipMarket,
  countryCode: string,
): ScholarshipPrice | null {
  const baseUsdCents = offering.prices.global.usdCents;
  if (!Number.isSafeInteger(baseUsdCents) || !baseUsdCents || baseUsdCents <= 0) return null;

  const display =
    market === 'gcc'
      ? offering.prices.gcc?.perCountry?.[countryCode.toUpperCase()] ?? null
      : offering.prices.global.display ?? null;
  if (!display) return null;
  const parsed = parseDisplay(display);
  if (!parsed) return null;

  try {
    const baseUnitAmount = toExactMinorUnits(parsed.majorAmount, parsed.currency);
    const finalUnitAmount = exactScholarshipUnitAmount(baseUnitAmount);
    const finalUsdCents = exactScholarshipUnitAmount(baseUsdCents);
    return {
      currency: parsed.currency.toLowerCase(),
      baseUnitAmount,
      finalUnitAmount,
      baseDisplay: formatScholarshipAmount(parsed.currency, baseUnitAmount),
      finalDisplay: formatScholarshipAmount(parsed.currency, finalUnitAmount),
      baseUsdCents,
      finalUsdCents,
    };
  } catch {
    return null;
  }
}

export function scholarshipCountryDecision(
  market: ScholarshipMarket,
  residenceCountry: string,
  billingCountry: string,
) {
  return evaluateScholarshipCountry(
    market,
    residenceCountry,
    billingCountry,
    KNOWN_COUNTRY_CODES,
  );
}
