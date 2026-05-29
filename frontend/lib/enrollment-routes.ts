import type { CourseOffering } from '@/types/regional-catalogue';
import { siteIdForMatrixCourse } from '@/lib/course-slug-map';
import { getOfferingById, getOfferingsForSiteCert } from '@/lib/regional-catalogue';

/** URL segment for a pathway tier (e.g. `mastery-corporate`). */
export function enrollTierSlugFromTierId(tierId: string): string {
  if (tierId === 'mastery_corporate') return 'mastery-corporate';
  if (tierId === 'mastery_advisory') return 'mastery-advisory';
  return tierId;
}

/** Resolve matrix tier ids from a public enroll URL slug. */
export function tierIdsForEnrollSlug(tierSlug: string): string[] {
  const map: Record<string, string[]> = {
    foundation: ['foundation'],
    professional: ['professional'],
    mastery: ['mastery', 'mastery_corporate', 'mastery_advisory'],
    'mastery-corporate': ['mastery_corporate'],
    'mastery-advisory': ['mastery_advisory'],
  };
  return map[tierSlug] ?? [tierSlug.replace(/-/g, '_')];
}

export function enrollPath(siteCertId: string, tierSlug: string): string {
  return `/certifications/${siteCertId}/${tierSlug}/enroll`;
}

export function enrollSuccessPath(siteCertId: string, tierSlug: string): string {
  return `/certifications/${siteCertId}/${tierSlug}/enroll/success`;
}

export function resolveOfferingForEnrollment(
  siteCertId: string,
  tierSlug: string,
): CourseOffering | undefined {
  const tierIds = tierIdsForEnrollSlug(tierSlug);
  const offerings = getOfferingsForSiteCert(siteCertId);
  for (const tierId of tierIds) {
    const found = offerings.find((o) => o.tierId === tierId);
    if (found) return found;
  }
  return undefined;
}

export function enrollmentPathForOffering(offeringId: string): string | null {
  const offering = getOfferingById(offeringId);
  if (!offering) return null;
  const siteCertId = siteIdForMatrixCourse(offering.courseName);
  if (!siteCertId) return null;
  return enrollPath(siteCertId, enrollTierSlugFromTierId(offering.tierId));
}

export function enrollmentSuccessPathForOffering(offeringId: string): string | null {
  const offering = getOfferingById(offeringId);
  if (!offering) return null;
  const siteCertId = siteIdForMatrixCourse(offering.courseName);
  if (!siteCertId) return null;
  return enrollSuccessPath(siteCertId, enrollTierSlugFromTierId(offering.tierId));
}
