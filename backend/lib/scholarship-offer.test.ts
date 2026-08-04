import { describe, expect, it } from 'vitest';
import {
  applyScholarshipDiscountMinor,
  isScholarshipAllowedRegion,
  isScholarshipTierId,
  scholarshipDiscountPct,
  scholarshipOfferError,
  SCHOLARSHIP_OFFER_TYPE,
} from './scholarship-offer';
import { getOfferingById } from '@/lib/regional-catalogue';
import { resolveRegionalCheckoutPrice } from '@/lib/regional-checkout-price';

describe('backend scholarship-offer', () => {
  it('computes Global 85% and GCC 65% of Global mentor unit amount', () => {
    expect(applyScholarshipDiscountMinor(20000, 'global')).toBe(17000);
    expect(applyScholarshipDiscountMinor(20000, 'gcc')).toBe(13000);
    expect(scholarshipDiscountPct('global')).toBe(15);
    expect(scholarshipDiscountPct('gcc')).toBe(35);
  });

  it('gates regions and tiers', () => {
    expect(isScholarshipAllowedRegion('gcc')).toBe(true);
    expect(isScholarshipAllowedRegion('india')).toBe(false);
    expect(isScholarshipTierId('professional')).toBe(true);
    expect(isScholarshipTierId('foundation')).toBe(false);
    expect(scholarshipOfferError('foundation', 'global')).toMatch(/Professional and Mastery/i);
    expect(scholarshipOfferError('professional', 'india')).toMatch(/Global and GCC/i);
    expect(scholarshipOfferError('professional', 'global')).toBeNull();
  });

  it('matches Elite discounts on PMP professional Global mentor amount', () => {
    const offering = getOfferingById('pmp-preparation-professional');
    expect(offering).toBeTruthy();
    const full = resolveRegionalCheckoutPrice(offering!, 'global', null, { priceBook: 'mentor' });
    expect(full).toBeTruthy();
    expect(applyScholarshipDiscountMinor(full!.unitAmount, 'global')).toBe(
      Math.round(full!.unitAmount * 0.85),
    );
    expect(applyScholarshipDiscountMinor(full!.unitAmount, 'gcc')).toBe(
      Math.round(full!.unitAmount * 0.65),
    );
    expect(SCHOLARSHIP_OFFER_TYPE).toBe('scholarship_invite');
  });
});
