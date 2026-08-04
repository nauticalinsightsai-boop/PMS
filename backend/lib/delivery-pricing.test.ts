import { describe, expect, it } from 'vitest';
import {
  isDeliveryFullChargeMode,
  parseEnrollmentPaymentMode,
} from '@/lib/enrollment-pricing';
import { getOfferingById } from '@/lib/regional-catalogue';
import { resolveRegionalCheckoutPrice } from '@/lib/regional-checkout-price';

describe('enrollment delivery payment modes', () => {
  it('forces foundation to self_paced', () => {
    expect(parseEnrollmentPaymentMode('mentor_led', 'foundation')).toBe('self_paced');
    expect(parseEnrollmentPaymentMode('seat_deposit', 'foundation')).toBe('self_paced');
  });

  it('defaults professional to mentor_led', () => {
    expect(parseEnrollmentPaymentMode(undefined, 'professional')).toBe('mentor_led');
    expect(parseEnrollmentPaymentMode('self_paced', 'professional')).toBe('self_paced');
  });

  it('keeps mastery deposit mode', () => {
    expect(parseEnrollmentPaymentMode(undefined, 'mastery')).toBe('seat_deposit');
    expect(parseEnrollmentPaymentMode('full_tuition', 'mastery')).toBe('full_tuition');
  });

  it('treats delivery modes as full charge', () => {
    expect(isDeliveryFullChargeMode('mentor_led')).toBe(true);
    expect(isDeliveryFullChargeMode('self_paced')).toBe(true);
    expect(isDeliveryFullChargeMode('seat_deposit')).toBe(false);
  });

  it('resolves PMP mentor vs self-paced checkout amounts', () => {
    const pro = getOfferingById('pmp-preparation-professional');
    expect(pro).toBeTruthy();
    const mentor = resolveRegionalCheckoutPrice(pro!, 'global');
    const selfPaced = resolveRegionalCheckoutPrice(pro!, 'global', null, {
      priceBook: 'self_paced',
    });
    const indiaMentor = resolveRegionalCheckoutPrice(pro!, 'india');
    const indiaSelf = resolveRegionalCheckoutPrice(pro!, 'india', null, {
      priceBook: 'self_paced',
    });
    expect(mentor?.display).toBe('$899');
    expect(selfPaced?.display).toBe('$449');
    expect(indiaMentor?.display).toBe('₹54,999');
    expect(indiaSelf?.display).toBe('₹27,999');
    expect(selfPaced?.usdCents).toBe(44900);
  });
});
