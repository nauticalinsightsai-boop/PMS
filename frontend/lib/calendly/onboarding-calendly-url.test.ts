import { describe, expect, it } from 'vitest';
import { getOfferingById } from '@/lib/regional-catalogue';
import {
  buildOnboardingCalendlyUrl,
  normalizeOnboardingTierId,
  resolveOnboardingCalendlyBaseUrl,
  resolveOnboardingCalendlyBaseUrlFromPathway,
} from '@/lib/calendly/onboarding-calendly-url';

const lookupOffering = (id: string) => {
  const offering = getOfferingById(id);
  return offering ? { familyId: offering.familyId, tierId: offering.tierId } : undefined;
};

describe('onboarding-calendly-url', () => {
  it('normalizes mastery variant tier ids', () => {
    expect(normalizeOnboardingTierId('mastery_corporate')).toBe('mastery');
    expect(normalizeOnboardingTierId('mastery_advisory')).toBe('mastery');
  });

  it('maps PMI professional offerings', () => {
    expect(
      resolveOnboardingCalendlyBaseUrl('pmp-preparation-professional', lookupOffering),
    ).toBe('https://calendly.com/pm-structure/go-pmi-professional');
  });

  it('maps PRINCE2 mastery offerings', () => {
    expect(
      resolveOnboardingCalendlyBaseUrl(
        'prince2-7-practitioner-preparation-mastery',
        lookupOffering,
      ),
    ).toBe('https://calendly.com/pm-structure/prince2-mastery-pathway');
  });

  it('maps Six Sigma mastery_corporate to go-lss-master', () => {
    expect(
      resolveOnboardingCalendlyBaseUrl('six-sigma-champion-mastery_corporate', lookupOffering),
    ).toBe('https://calendly.com/pm-structure/go-lss-master');
  });

  it('maps membership tiers to PMI onboarding links', () => {
    expect(resolveOnboardingCalendlyBaseUrl('membership_professional', lookupOffering)).toBe(
      'https://calendly.com/pm-structure/go-pmi-professional',
    );
    expect(resolveOnboardingCalendlyBaseUrl('membership_mastery', lookupOffering)).toBe(
      'https://calendly.com/pm-structure/go-pmi-mastery',
    );
  });

  it('falls back when offering is missing', () => {
    const fallback = 'https://calendly.com/pm-structure/talk-to-mentor';
    expect(resolveOnboardingCalendlyBaseUrl(null, lookupOffering, fallback)).toBe(fallback);
    expect(resolveOnboardingCalendlyBaseUrl('unknown-offering', lookupOffering, fallback)).toBe(
      fallback,
    );
  });

  it('has no PRINCE2 foundation onboarding link', () => {
    expect(resolveOnboardingCalendlyBaseUrlFromPathway('PRINCE2', 'foundation')).toBeNull();
  });

  it('appends UTM params', () => {
    const url = buildOnboardingCalendlyUrl(
      'pmp-preparation-professional',
      lookupOffering,
      { utmSource: 'success_page', utmMedium: 'enrollment' },
    );
    expect(url).toContain('go-pmi-professional');
    expect(url).toContain('utm_source=success_page');
    expect(url).toContain('utm_medium=enrollment');
    expect(url).toContain('utm_content=pmp-preparation-professional');
  });
});
