import type { GccCountryCode, RegionId } from '@/types/regional-catalogue';
import type { PathwayTier } from '@/types/site';
import type { CtaRoute } from '@/lib/cta-router';
import {
  getOfferingsForSiteCert,
  resolveFullPriceDisplay,
  resolveRegionalRule,
  tierDisplayLabel,
  tierPathwayLevel,
} from '@/lib/regional-catalogue';
import { routeOfferingCtas, hrefForCtaAction } from '@/lib/cta-router';
import { isOfferingVisible } from '@/lib/status-normalize';

const TIER_ORDER = ['foundation', 'professional', 'mastery', 'mastery_corporate', 'mastery_advisory'];

export function buildPathwayTiersForCert(
  siteCertId: string,
  certName: string,
  regionId: RegionId,
  gccCountry: GccCountryCode | null,
  learningOutcomes: string[] = []
): PathwayTier[] {
  const offerings = getOfferingsForSiteCert(siteCertId)
    .filter((o) => isOfferingVisible(o.regional[regionId].status))
    .sort((a, b) => TIER_ORDER.indexOf(a.tierId) - TIER_ORDER.indexOf(b.tierId));

  return offerings.map((o) => {
    const rule = resolveRegionalRule(o, regionId);
    const prices = resolveFullPriceDisplay(o, regionId, gccCountry);
    const ctas: CtaRoute = routeOfferingCtas(rule.status, rule.primaryCta, rule.secondaryCta);

    return {
      level: tierPathwayLevel(o.tierId),
      title: `${certName} ${tierDisplayLabel(o.tierId, o.tier)}`,
      duration: o.length ?? '',
      details: o.deliveryMode ?? '',
      tierDelivery: o.deliveryMode ?? '',
      price: prices.active ?? '',
      membershipPrice: prices.membership ?? '',
      regionalLabel: prices.regionalLabel,
      priceFootnote: prices.footnote,
      deliveryMode: o.deliveryMode?.split(';')[0]?.trim() ?? '',
      outcomes: learningOutcomes.slice(0, 4),
      ctaText: ctas.primaryLabel,
      ctas,
      isPopular: o.tierId === 'professional' && offerings.length > 1,
      offeringId: o.offeringId,
      originalPrice: prices.original ?? undefined,
      showScholarshipLabels: prices.showScholarshipLabels,
      primaryHref: hrefForCtaAction(ctas.primary, o.offeringId, siteCertId),
      secondaryHref: hrefForCtaAction(ctas.secondary, o.offeringId, siteCertId),
      secondaryCtaLabel: ctas.secondaryLabel,
      regionMessage: rule.regionMessage,
      status: rule.status,
    };
  });
}
