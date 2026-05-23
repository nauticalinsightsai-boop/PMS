import * as siteData from '@/data/siteData';
import type { CertificationSummary, FamilyId } from '@/types/site';
import { getOfferingsForSiteCert } from '@/lib/regional-catalogue';

export const MAX_COMPARE_CERTS = 3;

export const DEFAULT_COMPARE_CERT_IDS = ['pmp', 'capm', 'pmi-acp'] as const;

/** Certifications that have at least one visible matrix pathway tier. */
export function getCompareableCertifications(): CertificationSummary[] {
  return siteData.certifications
    .filter((c) => getOfferingsForSiteCert(c.id).length > 0)
    .sort((a, b) => {
      if (a.familyId !== b.familyId) return a.familyId.localeCompare(b.familyId);
      return a.name.localeCompare(b.name);
    });
}

export function parseCompareCertIds(
  param: string | null,
  allowedIds: Set<string>
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
  opts: { familyId?: FamilyId | 'all'; query: string }
): CertificationSummary[] {
  const q = opts.query.trim().toLowerCase();
  return certs.filter((c) => {
    if (opts.familyId && opts.familyId !== 'all' && c.familyId !== opts.familyId) return false;
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q) ||
      c.familyId.toLowerCase().includes(q)
    );
  });
}

export function toggleCompareSelection(
  selected: string[],
  certId: string
): { next: string[]; atMax: boolean } {
  if (selected.includes(certId)) {
    return { next: selected.filter((id) => id !== certId), atMax: false };
  }
  if (selected.length >= MAX_COMPARE_CERTS) {
    return { next: selected, atMax: true };
  }
  return { next: [...selected, certId], atMax: false };
}
