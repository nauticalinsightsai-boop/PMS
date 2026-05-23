import type { RegionId } from '@/types/regional-catalogue';
import { getOfferingsForSiteCert } from '@/lib/regional-catalogue';

/** @deprecated Use matrix status via isEnrollmentOpen(certId, regionId) */
export const OPEN_ENROLLMENT_CERT_IDS = new Set<string>(['pmp']);

export const PATHWAY_FAMILY_TABS = ['PMI', 'PRINCE2', 'SixSigma'] as const;
export type PathwayFamilyTab = (typeof PATHWAY_FAMILY_TABS)[number];

export const LISTABLE_PATHWAY_FAMILIES: PathwayFamilyTab[] = [...PATHWAY_FAMILY_TABS];

export function isEnrollmentOpen(certId: string, regionId: RegionId = 'global'): boolean {
  const offerings = getOfferingsForSiteCert(certId);
  if (!offerings.length) return OPEN_ENROLLMENT_CERT_IDS.has(certId);
  return offerings.some((o) => {
    const status = o.regional[regionId].status;
    return status === 'direct_checkout' || status === 'scholarship_verify';
  });
}

export const ENROLLMENT_STATUS = {
  open: 'Open now',
  nextCohort: 'Next cohort',
} as const;
