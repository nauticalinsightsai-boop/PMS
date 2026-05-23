'use client';

import { useMemo } from 'react';
import { useRegion } from '@/contexts/RegionContext';
import {
  getOfferingById,
  resolveFullPriceDisplay,
  resolveRegionalRule,
  resolveCheckoutUsdCents,
  membershipPriceUsdCents,
} from '@/lib/regional-catalogue';
import { routeOfferingCtas, hrefForCtaAction } from '@/lib/cta-router';
import { siteIdForMatrixCourse } from '@/lib/course-slug-map';

export function useRegionalOffering(offeringId: string) {
  const { regionId, gccCountry } = useRegion();
  return useMemo(() => {
    const offering = getOfferingById(offeringId);
    if (!offering) return null;
    const rule = resolveRegionalRule(offering, regionId);
    const prices = resolveFullPriceDisplay(offering, regionId, gccCountry);
    const ctas = routeOfferingCtas(rule.status, rule.primaryCta, rule.secondaryCta);
    const siteCertId = siteIdForMatrixCourse(offering.courseName);
    const checkoutUsdCents = resolveCheckoutUsdCents(offering, regionId);
    return {
      offering,
      rule,
      prices,
      showScholarshipLabels: prices.showScholarshipLabels,
      ctas,
      checkoutUsdCents,
      membershipUsdCents: membershipPriceUsdCents(checkoutUsdCents),
      primaryHref: hrefForCtaAction(ctas.primary, offeringId, siteCertId),
      secondaryHref: hrefForCtaAction(ctas.secondary, offeringId, siteCertId),
      siteCertId,
    };
  }, [offeringId, regionId, gccCountry]);
}
