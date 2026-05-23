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
import {
  resolveTierPathwayCta,
  tierDeliveryLine,
  tierPathwaySummary,
} from '@/lib/pathway-tier-cta';
import {
  resolvePathwayTierOutcomes,
  type PathwayOutcomesByTier,
} from '@/lib/pathway-tier-outcomes';

const TIER_ORDER = ['foundation', 'professional', 'mastery', 'mastery_corporate', 'mastery_advisory'];

export function buildPathwayTiersForCert(
  siteCertId: string,
  certName: string,
  regionId: RegionId,
  gccCountry: GccCountryCode | null,
  pathwayOutcomes?: PathwayOutcomesByTier,
  legacyOutcomes: string[] = [],
): PathwayTier[] {
  const offerings = getOfferingsForSiteCert(siteCertId)
    .filter((o) => isOfferingVisible(o.regional[regionId].status))
    .sort((a, b) => TIER_ORDER.indexOf(a.tierId) - TIER_ORDER.indexOf(b.tierId));

  return offerings.map((o) => {
    const rule = resolveRegionalRule(o, regionId);
    const prices = resolveFullPriceDisplay(o, regionId, gccCountry);
    const ctas: CtaRoute = routeOfferingCtas(rule.status, rule.primaryCta, rule.secondaryCta);
    const pathwayCta = resolveTierPathwayCta(
      o.tierId,
      o.offeringId,
      siteCertId,
      rule.status,
      rule.primaryCta,
    );
    const deliveryLine = tierDeliveryLine(o.deliveryMode);

    return {
      level: tierPathwayLevel(o.tierId),
      title: `${certName} ${tierDisplayLabel(o.tierId, o.tier)}`,
      duration: o.length ?? '',
      details: tierPathwaySummary(o.tierId),
      tierDelivery: deliveryLine,
      price: prices.active ?? '',
      membershipPrice: prices.membership ?? '',
      regionalLabel: prices.regionalLabel,
      priceFootnote: prices.footnote,
      deliveryMode: deliveryLine,
      outcomes: resolvePathwayTierOutcomes(
        siteCertId,
        o.tierId,
        pathwayOutcomes,
        legacyOutcomes,
      ),
      ctaText: pathwayCta.label,
      ctas,
      pathwayCta,
      isPopular: o.tierId === 'professional' && offerings.length > 1,
      offeringId: o.offeringId,
      originalPrice: prices.original ?? undefined,
      showScholarshipLabels: prices.showScholarshipLabels,
      primaryHref: pathwayCta.proceedHref,
      secondaryHref: hrefForCtaAction(ctas.secondary, o.offeringId, siteCertId),
      secondaryCtaLabel: ctas.secondaryLabel,
      regionMessage: rule.regionMessage,
      status: rule.status,
    };
  });
}
