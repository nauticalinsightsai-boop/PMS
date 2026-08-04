import { describe, expect, it } from 'vitest';
import {
  applyScholarshipDiscountMinor,
  isScholarshipAllowedRegion,
  isScholarshipTierId,
  resolveEliteScholarshipPrice,
  scholarshipDiscountPct,
  scholarshipOfferError,
  SCHOLARSHIP_OFFER_TYPE,
} from './scholarship-offer';
import { DELIVERY_FX_PER_USD } from '@/lib/delivery-pricing';
import { getOfferingById } from '@/lib/regional-catalogue';
import { resolveRegionalCheckoutPrice } from '@/lib/regional-checkout-price';

describe('backend scholarship-offer', () => {
  it('computes Global 85% USD and GCC 65% in local FX', () => {
    expect(applyScholarshipDiscountMinor(20000, 'global')).toBe(17000);
    expect(scholarshipDiscountPct('global')).toBe(15);
    expect(scholarshipDiscountPct('gcc')).toBe(35);

    const ae = resolveEliteScholarshipPrice({
      globalUsdMajor: 1000,
      regionId: 'gcc',
      gccCountry: 'AE',
    });
    expect(ae?.currency).toBe('aed');
    expect(ae?.majorAmount).toBe(Math.round(1000 * DELIVERY_FX_PER_USD.AED * 0.65));
    expect(ae?.unitAmount).toBe(ae!.majorAmount * 100);
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
    const globalElite = resolveEliteScholarshipPrice({
      globalUsdMajor: full!.majorAmount,
      regionId: 'global',
    });
    expect(globalElite?.unitAmount).toBe(Math.round(full!.unitAmount * 0.85));
    const gccElite = resolveEliteScholarshipPrice({
      globalUsdMajor: full!.majorAmount,
      regionId: 'gcc',
      gccCountry: 'AE',
    });
    expect(gccElite?.currencyCode).toBe('AED');
    expect(SCHOLARSHIP_OFFER_TYPE).toBe('scholarship_invite');
  });
});
