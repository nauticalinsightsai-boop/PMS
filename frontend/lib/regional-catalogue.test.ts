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

  it('PMI-RMP has foundation and professional only (no mastery pathway)', () => {
    const tiers = getOfferingsForSiteCert('pmi-rmp').map((o) => o.tierId);
    expect(tiers).toEqual(['foundation', 'professional']);
    expect(tiers).not.toContain('mastery');
  });

  it('listing card price and duration prefer Professional over Foundation', () => {
    const pmpListing = pickListingTierOffering('pmp');
    expect(pmpListing?.tierId).toBe('professional');
    expect(getCertDurationLabel('pmp')).toBe(pmpListing?.length);
    const gccPro = resolveFullPriceDisplay(pmpListing!, 'gcc');
    expect(getListingPriceForCert('pmp', 'gcc').active).toBe(gccPro.active);

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

  it('foundation never shows membership discount', () => {
    const foundation = getOfferingById('pmp-preparation-foundation');
    expect(foundation).toBeDefined();
    const global = resolveFullPriceDisplay(foundation!, 'global');
    const india = resolveFullPriceDisplay(foundation!, 'india');
    expect(global.active).toBe('$99');
    expect(global.membership).toBeNull();
    expect(india.membership).toBeNull();
  });

  it('PMP professional has mentor and self-paced price books', () => {
    const pro = getOfferingById('pmp-preparation-professional');
    expect(pro?.prices.global.display).toBe('$899');
    expect(pro?.prices.india.display).toBe('₹52,999');
    expect(pro?.pricesSelfPaced?.global.display).toBe('$449');
    expect(pro?.pricesSelfPaced?.india.display).toBe('₹26,999');
    expect(pro?.prices.gcc.perCountry?.AE).toBe('AED 2,649');
  });

  it('resolveFullPriceDisplay uses same-currency global reference for GCC scholarship', () => {
    const pro = getOfferingById('pmp-preparation-professional');
    expect(pro).toBeDefined();
    const gcc = resolveFullPriceDisplay(pro!, 'gcc', 'AE');
    expect(gcc.active).toBe('AED 2,649');
    expect(gcc.original).toMatch(/^AED /);
    expect(gcc.original).not.toMatch(/\$/);
  });

  it('routes scholarship_unavailable CTAs', () => {
    const mastery = getOfferingById('pmp-preparation-mastery');
    const rule = resolveRegionalRule(mastery!, 'india');
    const ctas = routeOfferingCtas(rule.status, rule.primaryCta, rule.secondaryCta);
    expect(ctas.primary).not.toBe('hidden');
    expect(ctas.secondary).not.toBe('hidden');
  });
});
