import { describe, expect, it } from 'vitest';
import {
  applyScholarshipDiscountMinor,
  isScholarshipAllowedRegion,
  isScholarshipTierId,
  scholarshipOfferError,
  SCHOLARSHIP_OFFER_TYPE,
} from './scholarship-offer';
import { getOfferingById } from '@/lib/regional-catalogue';
import { resolveRegionalCheckoutPrice } from '@/lib/regional-checkout-price';

describe('backend scholarship-offer', () => {
  it('computes 85% of mentor regional unit amount', () => {
    expect(applyScholarshipDiscountMinor(20000)).toBe(17000);
    expect(applyScholarshipDiscountMinor(99)).toBe(84);
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

  it('matches ~85% of PMP professional mentor global checkout amount', () => {
    const offering = getOfferingById('pmp-preparation-professional');
    expect(offering).toBeTruthy();
    const full = resolveRegionalCheckoutPrice(offering!, 'global', null, { priceBook: 'mentor' });
    expect(full).toBeTruthy();
    const discounted = applyScholarshipDiscountMinor(full!.unitAmount);
    expect(discounted).toBe(Math.round(full!.unitAmount * 0.85));
    expect(SCHOLARSHIP_OFFER_TYPE).toBe('scholarship_invite');
  });
});
