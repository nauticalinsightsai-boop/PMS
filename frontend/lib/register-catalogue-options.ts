import { getAllOfferings } from '@/lib/regional-catalogue';
import { siteIdForMatrixCourse } from '@/lib/course-slug-map';
import type { RegionId } from '@/types/regional-catalogue';
import { isOfferingVisible } from '@/lib/status-normalize';

export interface RegisterCertOption {
  siteCertId: string;
  label: string;
}

export interface RegisterOfferingOption {
  offeringId: string;
  tierLabel: string;
}

export function getRegisterCertOptions(): RegisterCertOption[] {
  const seen = new Map<string, string>();
  for (const o of getAllOfferings()) {
    const siteId = siteIdForMatrixCourse(o.courseName);
    if (!siteId || seen.has(siteId)) continue;
    seen.set(siteId, o.courseName);
  }
  return [...seen.entries()]
    .map(([siteCertId, label]) => ({ siteCertId, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getRegisterOfferingsForCert(
  siteCertId: string,
  regionId: RegionId
): RegisterOfferingOption[] {
  return getAllOfferings()
    .filter((o) => siteIdForMatrixCourse(o.courseName) === siteCertId)
    .filter((o) => isOfferingVisible(o.regional[regionId].status))
    .map((o) => ({
      offeringId: o.offeringId,
      tierLabel: `${o.tier} (${o.tierId})`,
    }));
}
