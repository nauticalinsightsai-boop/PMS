import catalogueJson from '@/data/regional-catalogue.json';
import type {
  CourseOffering,
  OfferingStatus,
  RegionId,
  RegionalCatalogue,
  RegionalOfferingRule,
  RegionalPrice,
} from '@/types/regional-catalogue';
import { MATRIX_COURSE_TO_SITE_ID, siteIdForMatrixCourse } from '@/lib/course-slug-map';
import { canCheckout, isOfferingVisible } from '@/lib/status-normalize';
import { gccDisplayForCountry, showsOriginalVsScholarship } from '@/lib/price-parser';
import {
  applyMembershipDiscountDisplay,
  regionalPriceLabel,
  type FullRegionalPriceDisplay,
} from '@/lib/regional-price-display';

export const catalogue = catalogueJson as RegionalCatalogue;

export function getCatalogue(): RegionalCatalogue {
  return catalogue;
}

export function getAllOfferings(): CourseOffering[] {
  return catalogue.offerings;
}

export function getOfferingById(offeringId: string): CourseOffering | undefined {
  return catalogue.offerings.find((o) => o.offeringId === offeringId);
}

export function matrixCoursesForSiteId(siteId: string): string[] {
  return Object.entries(MATRIX_COURSE_TO_SITE_ID)
    .filter(([, id]) => id === siteId)
    .map(([course]) => course);
}

export function getOfferingsForSiteCert(siteId: string): CourseOffering[] {
  const courses = matrixCoursesForSiteId(siteId);
  if (!courses.length) return [];
  return catalogue.offerings.filter((o) => courses.includes(o.courseName) && isOfferingVisible(o.regional.global.status));
}

export function getOfferingsForFamily(familyId: string): CourseOffering[] {
  return catalogue.offerings.filter(
    (o) => o.familyId === familyId && isOfferingVisible(o.regional.global.status)
  );
}

export function getVisibleOfferingsForFamily(familyId: string, regionId: RegionId): CourseOffering[] {
  return getOfferingsForFamily(familyId).filter((o) => isOfferingVisible(o.regional[regionId].status));
}

export function resolveRegionalRule(
  offering: CourseOffering,
  regionId: RegionId
): RegionalOfferingRule {
  return offering.regional[regionId];
}

export function resolveActivePrice(
  offering: CourseOffering,
  regionId: RegionId,
  gccCountry?: string | null
): RegionalPrice {
  const price = offering.prices[regionId];
  if (regionId === 'gcc' && gccCountry) {
    const display = gccDisplayForCountry(price, gccCountry);
    return { ...price, display: display ?? price.display };
  }
  return price;
}

export function resolveCheckoutUsdCents(
  offering: CourseOffering,
  regionId: RegionId
): number | null {
  const globalCents = offering.prices.global.usdCents ?? null;
  const regional = offering.prices[regionId];
  if (regionId === 'gcc') return globalCents;
  return regional.usdCents ?? globalCents;
}

export function resolveDisplayPair(
  offering: CourseOffering,
  regionId: RegionId,
  gccCountry?: string | null
): {
  original: string | null;
  active: string | null;
  showScholarshipLabels: boolean;
  footnote: string | null;
} {
  const full = resolveFullPriceDisplay(offering, regionId, gccCountry);
  return {
    original: full.original,
    active: full.active,
    showScholarshipLabels: full.showScholarshipLabels,
    footnote: full.footnote,
  };
}

/** Regional tuition + membership (20% off active regional display) in regional currency. */
export function resolveFullPriceDisplay(
  offering: CourseOffering,
  regionId: RegionId,
  gccCountry?: string | null
): FullRegionalPriceDisplay {
  const rule = resolveRegionalRule(offering, regionId);
  const globalDisplay = offering.prices.global.display ?? null;
  const activePrice = resolveActivePrice(offering, regionId, gccCountry);
  const activeDisplay = activePrice.display ?? null;
  const showScholarshipLabels = showsOriginalVsScholarship(
    regionId,
    rule.status,
    globalDisplay,
    activeDisplay
  );
  const membership = applyMembershipDiscountDisplay(activeDisplay);
  return {
    original: globalDisplay,
    active: activeDisplay,
    membership,
    showScholarshipLabels,
    footnote: rule.regionMessage ?? null,
    regionalLabel: regionalPriceLabel(regionId, showScholarshipLabels),
  };
}

export function membershipPriceUsdCents(usdCents: number | null): number | null {
  if (usdCents == null) return null;
  return Math.round(usdCents * (1 - 0.2));
}

export function tierPathwayLevel(tierId: string): 'Foundation' | 'Professional' | 'Elite' {
  if (tierId === 'foundation') return 'Foundation';
  if (tierId === 'professional') return 'Professional';
  return 'Elite';
}

export function tierDisplayLabel(tierId: string, tier: string): string {
  if (tierId === 'mastery_corporate') return 'Mastery (Corporate)';
  if (tierId === 'mastery_advisory') return 'Mastery (Advisory)';
  if (tierId === 'mastery') return 'Mastery';
  return tier;
}

/** Lowest pathway tier shown on listing cards (starting price + duration from same row). */
const LISTING_TIER_ORDER = [
  'foundation',
  'professional',
  'mastery',
  'mastery_corporate',
  'mastery_advisory',
] as const;

export function pickListingTierOffering(siteId: string): CourseOffering | undefined {
  const offerings = getOfferingsForSiteCert(siteId);
  if (!offerings.length) return undefined;
  for (const tierId of LISTING_TIER_ORDER) {
    const match = offerings.find((o) => o.tierId === tierId);
    if (match) return match;
  }
  return offerings[0];
}

/** Duration for the same tier as `getListingPriceForCert` (lowest available pathway tier). */
export function getCertDurationLabel(siteId: string): string | null {
  return pickListingTierOffering(siteId)?.length ?? null;
}

/** Matrix tier id used for listing-card starting price (e.g. foundation vs professional only). */
export function getListingTierId(siteId: string): string | null {
  return pickListingTierOffering(siteId)?.tierId ?? null;
}

const MASTERY_TIER_IDS = ['mastery', 'mastery_corporate', 'mastery_advisory'] as const;

/** Single matrix row for a pathway tier (compare matrix, detail tables). */
export function getOfferingForTier(
  siteId: string,
  tier: 'foundation' | 'professional' | 'mastery'
): CourseOffering | undefined {
  const offerings = getOfferingsForSiteCert(siteId);
  if (tier === 'mastery') {
    return offerings.find((o) =>
      (MASTERY_TIER_IDS as readonly string[]).includes(o.tierId)
    );
  }
  return offerings.find((o) => o.tierId === tier);
}

export function getTierPriceDisplay(
  siteId: string,
  tierId: string,
  regionId: RegionId,
  gccCountry?: string | null
): string | null {
  const offering = getOfferingsForSiteCert(siteId).find((o) => o.tierId === tierId);
  if (!offering) return null;
  return resolveDisplayPair(offering, regionId, gccCountry).active;
}

export function getListingPriceForCert(
  siteId: string,
  regionId: RegionId,
  gccCountry?: string | null
): FullRegionalPriceDisplay & { showScholarship: boolean } {
  const listing = pickListingTierOffering(siteId);
  if (!listing) {
    return {
      active: null,
      original: null,
      membership: null,
      showScholarshipLabels: false,
      showScholarship: false,
      footnote: null,
      regionalLabel: 'Regional price',
    };
  }
  const full = resolveFullPriceDisplay(listing, regionId, gccCountry);
  return { ...full, showScholarship: full.showScholarshipLabels };
}

export { siteIdForMatrixCourse, canCheckout, isOfferingVisible };
export type { RegionId, OfferingStatus, CourseOffering };
