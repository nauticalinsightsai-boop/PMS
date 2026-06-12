/**
 * Post-checkout onboarding Calendly URLs by certification family × pathway tier.
 * Membership and unknown offerings fall back to the default mentor link.
 */

export const ONBOARDING_CALENDLY_DEFAULT_URL =
  'https://calendly.com/pm-structure/talk-to-mentor';

type OnboardingFamily = 'PMI' | 'PRINCE2' | 'SixSigma';
type OnboardingTier = 'foundation' | 'professional' | 'mastery';

const ONBOARDING_CALENDLY_URL_BY_FAMILY_TIER: Record<
  OnboardingFamily,
  Partial<Record<OnboardingTier, string>>
> = {
  PMI: {
    foundation: 'https://calendly.com/pm-structure/go-pmi-foundation',
    professional: 'https://calendly.com/pm-structure/go-pmi-professional',
    mastery: 'https://calendly.com/pm-structure/go-pmi-mastery',
  },
  PRINCE2: {
    professional: 'https://calendly.com/pm-structure/go-prince2-professional',
    mastery: 'https://calendly.com/pm-structure/prince2-mastery-pathway',
  },
  SixSigma: {
    foundation: 'https://calendly.com/pm-structure/go-lss-foundation',
    professional: 'https://calendly.com/pm-structure/six-sigma-professional-pathway',
    mastery: 'https://calendly.com/pm-structure/go-lss-master',
  },
};

export function normalizeOnboardingTierId(tierId: string): OnboardingTier | null {
  if (tierId === 'foundation') return 'foundation';
  if (tierId === 'professional') return 'professional';
  if (tierId === 'mastery' || tierId === 'mastery_corporate' || tierId === 'mastery_advisory') {
    return 'mastery';
  }
  return null;
}

function isOnboardingFamily(familyId: string): familyId is OnboardingFamily {
  return familyId === 'PMI' || familyId === 'PRINCE2' || familyId === 'SixSigma';
}

export function resolveOnboardingCalendlyBaseUrlFromPathway(
  familyId: string,
  tierId: string,
): string | null {
  if (!isOnboardingFamily(familyId)) return null;
  const tier = normalizeOnboardingTierId(tierId);
  if (!tier) return null;
  return ONBOARDING_CALENDLY_URL_BY_FAMILY_TIER[familyId][tier] ?? null;
}

export type OnboardingOfferingLookup = {
  familyId: string;
  tierId: string;
};

function resolveMembershipOnboardingBaseUrl(offeringId: string): string | null {
  if (offeringId === 'membership_professional') {
    return ONBOARDING_CALENDLY_URL_BY_FAMILY_TIER.PMI.professional ?? null;
  }
  if (offeringId === 'membership_mastery') {
    return ONBOARDING_CALENDLY_URL_BY_FAMILY_TIER.PMI.mastery ?? null;
  }
  return null;
}

export function resolveOnboardingCalendlyBaseUrl(
  offeringId: string | null | undefined,
  lookupOffering?: (id: string) => OnboardingOfferingLookup | undefined,
  fallbackUrl: string = ONBOARDING_CALENDLY_DEFAULT_URL,
): string {
  const id = offeringId?.trim();
  if (!id) return fallbackUrl;

  const membershipUrl = resolveMembershipOnboardingBaseUrl(id);
  if (membershipUrl) return membershipUrl;

  const offering = lookupOffering?.(id);
  if (offering) {
    const mapped = resolveOnboardingCalendlyBaseUrlFromPathway(
      offering.familyId,
      offering.tierId,
    );
    if (mapped) return mapped;
  }

  return fallbackUrl;
}

export type OnboardingCalendlyUtm = {
  utmSource: string;
  utmMedium: string;
};

export function buildOnboardingCalendlyUrl(
  offeringId: string | null | undefined,
  lookupOffering: (id: string) => OnboardingOfferingLookup | undefined,
  utm: OnboardingCalendlyUtm,
  fallbackUrl: string = ONBOARDING_CALENDLY_DEFAULT_URL,
): string {
  const base = resolveOnboardingCalendlyBaseUrl(offeringId, lookupOffering, fallbackUrl);
  const url = new URL(base);
  url.searchParams.set('utm_source', utm.utmSource);
  url.searchParams.set('utm_medium', utm.utmMedium);
  if (offeringId?.trim()) {
    url.searchParams.set('utm_content', offeringId.trim());
  }
  return url.toString();
}
