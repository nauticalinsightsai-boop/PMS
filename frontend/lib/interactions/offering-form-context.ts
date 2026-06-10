import type { WebsiteFormContextInput } from '@pms/booking-crm/form-submissions';
import { getOfferingById, siteIdForMatrixCourse } from '@/lib/regional-catalogue';

export function offeringFormContext(
  formId: string,
  formLabel: string,
  offeringId?: string,
  regionId?: string,
): WebsiteFormContextInput {
  const offering = offeringId ? getOfferingById(offeringId) : undefined;
  const siteCertId = offering
    ? siteIdForMatrixCourse(offering.courseSlug)
    : undefined;

  return {
    formId,
    formLabel,
    pagePath: typeof window !== 'undefined' ? window.location.pathname : undefined,
    offeringId,
    siteCertId: siteCertId ?? undefined,
    certName: offering?.courseName,
    tierLabel: offering?.tier,
    regionId,
  };
}
