import type { RegionId } from '@/types/regional-catalogue';
import { getScheduledCohortDate } from '@/lib/cohort-intake-schedule';
import { getOfferingsForSiteCert } from '@/lib/regional-catalogue';

/** @deprecated Use matrix status via isEnrollmentOpen(certId, regionId) */
export const OPEN_ENROLLMENT_CERT_IDS = new Set<string>(['pmp']);

export const PATHWAY_FAMILY_TABS = ['PMI', 'PRINCE2', 'SixSigma'] as const;
export type PathwayFamilyTab = (typeof PATHWAY_FAMILY_TABS)[number];

export const LISTABLE_PATHWAY_FAMILIES: PathwayFamilyTab[] = [...PATHWAY_FAMILY_TABS];

/** Flagship pathways — always shown as the 3-up card row per family tab. */
export const FAMILY_FEATURED_CERT_IDS: Record<PathwayFamilyTab, readonly string[]> = {
  PMI: ['pmp', 'pmi-rmp', 'capm'],
  PRINCE2: ['prince2', 'prince2-practitioner', 'prince2-agile'],
  SixSigma: ['lss-green', 'lss-yellow', 'lss-black'],
};

const TOP_TIER_CERT_IDS = new Set(
  PATHWAY_FAMILY_TABS.flatMap((familyId) => FAMILY_FEATURED_CERT_IDS[familyId]),
);

const FEATURED_ROW_LIMIT = 3;

export function isTopTierPathwayCert(certId: string): boolean {
  return TOP_TIER_CERT_IDS.has(certId);
}

/** Flagship row: fixed order per family (PMI: PMP → RMP → CAPM), includes open and next-cohort pathways. */
export function pickFeaturedPathwayCerts<T extends { id: string }>(
  certsInFamily: T[],
  familyId: PathwayFamilyTab,
  limit = FEATURED_ROW_LIMIT,
): T[] {
  const preferred = FAMILY_FEATURED_CERT_IDS[familyId];
  const picked: T[] = [];

  for (const id of preferred) {
    const cert = certsInFamily.find((c) => c.id === id);
    if (cert) picked.push(cert);
    if (picked.length >= limit) return picked;
  }

  for (const cert of certsInFamily) {
    if (picked.some((p) => p.id === cert.id)) continue;
    picked.push(cert);
    if (picked.length >= limit) break;
  }

  return picked;
}

export function isEnrollmentOpen(certId: string, regionId: RegionId = 'global'): boolean {
  const offerings = getOfferingsForSiteCert(certId);
  if (!offerings.length) return OPEN_ENROLLMENT_CERT_IDS.has(certId);
  return offerings.some((o) => {
    const status = o.regional[regionId].status;
    return status === 'direct_checkout' || status === 'scholarship_verify';
  });
}

/** Badge prefix when showing the next intake (not “Open now” while a cohort is running). */
export const ENROLLMENT_STATUS = {
  nextIntake: 'Next',
} as const;

/**
 * Next intake for a pathway — staggered by certification (see cohort-intake-schedule).
 * Baseline is next calendar month; flagship PM certs add +1 month (e.g. PMP in Jul when viewed in May).
 */
export function getNextCohortDate(certId?: string): Date {
  if (!certId) {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }
  return getScheduledCohortDate(certId);
}

export function formatCohortMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export type CohortEnrollmentDisplay = {
  isOpen: boolean;
  nextCohortDate: Date;
  nextCohortLabel: string;
  badgeText: string;
  note: string;
};

export function getCohortEnrollmentDisplay(
  certId: string,
  regionId: RegionId = 'global',
): CohortEnrollmentDisplay {
  const isOpen = isEnrollmentOpen(certId, regionId);
  const nextCohortDate = getNextCohortDate(certId);
  const nextCohortLabel = formatCohortMonthYear(nextCohortDate);

  const badgeText = `${ENROLLMENT_STATUS.nextIntake} · ${nextCohortLabel}`;

  return {
    isOpen,
    nextCohortDate,
    nextCohortLabel,
    badgeText,
    note: `Next intake · ${nextCohortLabel}`,
  };
}
