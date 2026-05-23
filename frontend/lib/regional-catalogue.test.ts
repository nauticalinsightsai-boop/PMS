import { describe, expect, it } from 'vitest';
import {
  getAllOfferings,
  getCertDurationLabel,
  getListingPriceForCert,
  getOfferingById,
  getOfferingsForSiteCert,
  pickListingTierOffering,
  resolveCheckoutUsdCents,
  resolveFullPriceDisplay,
  resolveRegionalRule,
} from './regional-catalogue';
import { routeOfferingCtas } from './cta-router';

describe('regional-catalogue', () => {
  it('has exactly 55 offerings', () => {
    expect(getAllOfferings()).toHaveLength(55);
  });

  it('PMP has foundation, professional, mastery', () => {
    const tiers = getOfferingsForSiteCert('pmp').map((o) => o.tierId);
    expect(tiers).toContain('foundation');
    expect(tiers).toContain('professional');
    expect(tiers).toContain('mastery');
  });

  it('CAPM has professional only', () => {
    const tiers = getOfferingsForSiteCert('capm').map((o) => o.tierId);
    expect(tiers).toEqual(['professional']);
  });

  it('listing card price and duration use the same lowest tier', () => {
    const pmpListing = pickListingTierOffering('pmp');
    expect(pmpListing?.tierId).toBe('foundation');
    expect(getCertDurationLabel('pmp')).toBe('2 weeks');
    const gccFoundation = resolveFullPriceDisplay(pmpListing!, 'gcc');
    expect(getListingPriceForCert('pmp', 'gcc').active).toBe(gccFoundation.active);

    const capmListing = pickListingTierOffering('capm');
    expect(capmListing?.tierId).toBe('professional');
    expect(getCertDurationLabel('capm')).toBe(capmListing?.length);
  });

  it('India PMP mastery is scholarship_unavailable', () => {
    const mastery = getOfferingById('pmp-preparation-mastery');
    expect(mastery).toBeDefined();
    expect(resolveRegionalRule(mastery!, 'india').status).toBe('scholarship_unavailable');
  });

  it('GCC checkout uses global usdCents', () => {
    const pro = getOfferingById('pmp-preparation-professional');
    expect(pro).toBeDefined();
    const global = pro!.prices.global.usdCents;
    expect(resolveCheckoutUsdCents(pro!, 'gcc')).toBe(global);
  });

  it('catalogue uses matrix status enums (legend-supported)', () => {
    const statuses = new Set(
      getAllOfferings().flatMap((o) => Object.values(o.regional).map((r) => r.status))
    );
    expect(statuses.has('direct_checkout')).toBe(true);
    expect(statuses.has('scholarship_verify')).toBe(true);
    expect(statuses.has('scholarship_unavailable')).toBe(true);
    expect(statuses.has('consultation_required')).toBe(true);
    for (const s of statuses) {
      expect([
        'direct_checkout',
        'scholarship_verify',
        'scholarship_unavailable',
        'consultation_required',
        'global_only',
        'waitlist',
        'hidden',
      ]).toContain(s);
    }
  });

  it('resolveFullPriceDisplay includes membership in regional currency', () => {
    const pro = getOfferingById('pmp-preparation-professional');
    expect(pro).toBeDefined();
    const india = resolveFullPriceDisplay(pro!, 'india');
    expect(india.active).toBeTruthy();
    expect(india.membership).toBeTruthy();
    expect(india.membership).not.toMatch(/^\$/);
  });

  it('resolveFullPriceDisplay uses same-currency global reference for GCC scholarship', () => {
    const foundation = getOfferingById('pmp-preparation-foundation');
    expect(foundation).toBeDefined();
    const gcc = resolveFullPriceDisplay(foundation!, 'gcc', 'AE');
    expect(gcc.active).toBe('AED 900');
    expect(gcc.original).toMatch(/^AED /);
    expect(gcc.original).not.toMatch(/\$/);
    expect(gcc.showScholarshipLabels).toBe(true);
  });

  it('routes scholarship_unavailable CTAs', () => {
    const mastery = getOfferingById('pmp-preparation-mastery');
    const rule = resolveRegionalRule(mastery!, 'india');
    const ctas = routeOfferingCtas(rule.status, rule.primaryCta, rule.secondaryCta);
    expect(ctas.primary).not.toBe('hidden');
    expect(ctas.secondary).not.toBe('hidden');
  });
});
