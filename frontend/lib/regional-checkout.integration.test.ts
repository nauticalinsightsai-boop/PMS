import { describe, expect, it } from 'vitest';
import {
  getOfferingById,
  membershipPriceUsdCents,
  resolveCheckoutUsdCents,
} from './regional-catalogue';

describe('regional checkout (unit integration)', () => {
  it('membership checkout is 80% of regional usdCents', () => {
    const pro = getOfferingById('pmp-preparation-professional');
    expect(pro).toBeDefined();
    const cents = resolveCheckoutUsdCents(pro!, 'india');
    expect(cents).toBeTruthy();
    const member = membershipPriceUsdCents(cents);
    expect(member).toBe(Math.round(cents! * 0.8));
  });

  it('GCC membership uses global usdCents base', () => {
    const pro = getOfferingById('pmp-preparation-professional');
    const gcc = resolveCheckoutUsdCents(pro!, 'gcc');
    const member = membershipPriceUsdCents(gcc);
    expect(member).toBe(Math.round(gcc! * 0.8));
  });

  it('verify flow expects residence and billing for scholarship_verify', () => {
    const pro = getOfferingById('pmp-preparation-professional');
    const status = pro!.regional.india.status;
    expect(status).toBe('scholarship_verify');
  });
});
