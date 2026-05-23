import * as siteData from '@/data/siteData';
import type { CertificationSummary, FamilyId } from '@/types/site';
import { getOfferingsForSiteCert } from '@/lib/regional-catalogue';
import {
  FAMILY_FEATURED_CERT_IDS,
  PATHWAY_FAMILY_TABS,
  type PathwayFamilyTab,
} from '@/lib/certification-enrollment';

export const MAX_COMPARE_CERTS = 3;

export const DEFAULT_COMPARE_CERT_IDS = ['pmp', 'capm', 'pmi-acp'] as const;

/** Certifications that have at least one visible matrix pathway tier. */
export function getCompareableCertifications(): CertificationSummary[] {
  return sortCompareableCertifications(
    siteData.certifications.filter((c) => getOfferingsForSiteCert(c.id).length > 0),
  );
}

/** Flagship-first within each family, then alphabetical. */
export function sortCompareableCertifications(
  certs: CertificationSummary[],
): CertificationSummary[] {
  return [...certs].sort(compareCertificationPriority);
}

export function compareCertificationPriority(
  a: CertificationSummary,
  b: CertificationSummary,
): number {
  const familyA = PATHWAY_FAMILY_TABS.indexOf(a.familyId as PathwayFamilyTab);
  const familyB = PATHWAY_FAMILY_TABS.indexOf(b.familyId as PathwayFamilyTab);
  if (familyA !== familyB) {
    const orderA = familyA === -1 ? 99 : familyA;
    const orderB = familyB === -1 ? 99 : familyB;
    return orderA - orderB;
  }

  const featured = FAMILY_FEATURED_CERT_IDS[a.familyId as PathwayFamilyTab] ?? [];
  const rankA = featured.indexOf(a.id);
  const rankB = featured.indexOf(b.id);
  const priorityA = rankA === -1 ? 999 : rankA;
  const priorityB = rankB === -1 ? 999 : rankB;
  if (priorityA !== priorityB) return priorityA - priorityB;

  return a.name.localeCompare(b.name);
}

export function getDefaultCompareIdsForFamily(
  familyId: PathwayFamilyTab,
  allowedIds: Set<string>,
): string[] {
  return FAMILY_FEATURED_CERT_IDS[familyId]
    .filter((id) => allowedIds.has(id))
    .slice(0, MAX_COMPARE_CERTS);
}

export function inferCompareFamilyFromSelection(
  selectedIds: string[],
  certifications: CertificationSummary[],
): PathwayFamilyTab {
  for (const id of selectedIds) {
    const cert = certifications.find((c) => c.id === id);
    if (cert && PATHWAY_FAMILY_TABS.includes(cert.familyId as PathwayFamilyTab)) {
      return cert.familyId as PathwayFamilyTab;
    }
  }
  return 'PMI';
}

export function parseCompareCertIds(
  param: string | null,
  allowedIds: Set<string>,
): string[] {
  const fromUrl = (param ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((id) => allowedIds.has(id));
  if (fromUrl.length > 0) return fromUrl.slice(0, MAX_COMPARE_CERTS);
  return DEFAULT_COMPARE_CERT_IDS.filter((id) => allowedIds.has(id)).slice(0, MAX_COMPARE_CERTS);
}

export function compareIdsToQuery(ids: string[]): string {
  return ids.slice(0, MAX_COMPARE_CERTS).join(',');
}

export function filterCertsForPicker(
  certs: CertificationSummary[],
  opts: { familyId: FamilyId; query: string },
): CertificationSummary[] {
  const q = opts.query.trim().toLowerCase();
  const filtered = certs.filter((c) => {
    if (c.familyId !== opts.familyId) return false;
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q)
    );
  });
  return sortCompareableCertifications(filtered);
}

export function toggleCompareSelection(
  selected: string[],
  certId: string,
): { next: string[]; atMax: boolean } {
  if (selected.includes(certId)) {
    return { next: selected.filter((id) => id !== certId), atMax: false };
  }
  if (selected.length >= MAX_COMPARE_CERTS) {
    return { next: selected, atMax: true };
  }
  return { next: [...selected, certId], atMax: false };
}
