import catalogueJson from '../../frontend/data/regional-catalogue.json';

export type RegionId = 'global' | 'europe' | 'uk' | 'gcc' | 'india' | 'pakistan';
export type OfferingStatus =
  | 'direct_checkout'
  | 'scholarship_verify'
  | 'consultation_required'
  | 'scholarship_unavailable'
  | 'global_only'
  | 'waitlist'
  | 'hidden';

export interface CourseOffering {
  offeringId: string;
  courseName: string;
  tierId: string;
  regional: Record<RegionId, { status: OfferingStatus }>;
  prices: Record<RegionId, { usdCents?: number | null; display?: string | null }>;
}

type CatalogueRoot = {
  offerings: CourseOffering[];
  regions: unknown[];
  regionIds: string[];
  websiteCopy: Record<string, string>;
  meta?: unknown;
};

const catalogue = catalogueJson as CatalogueRoot;

export function getOfferingById(id: string) {
  return catalogue.offerings.find((o) => o.offeringId === id);
}

export function getCatalogue(): CatalogueRoot {
  return catalogue;
}

export function resolveCheckoutUsdCents(offering: CourseOffering, regionId: RegionId): number | null {
  const globalCents = offering.prices.global.usdCents ?? null;
  if (regionId === 'gcc') return globalCents;
  return offering.prices[regionId]?.usdCents ?? globalCents;
}

export function canCheckoutStatus(status: OfferingStatus): boolean {
  return status === 'direct_checkout' || status === 'scholarship_verify';
}
