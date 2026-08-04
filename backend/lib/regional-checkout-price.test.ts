import { describe, expect, it } from 'vitest';
import { getOfferingById } from '@/lib/regional-catalogue';
import {
  formatRegionalDepositDisplay,
  resolveRegionalCheckoutPrice,
  resolveRegionalDepositPrice,
} from '@/lib/regional-checkout-price';

describe('regional-checkout-price', () => {
  const pro = getOfferingById('pmp-preparation-professional');

  it('charges Pakistan tuition in PKR from matrix display', () => {
    expect(pro).toBeTruthy();
    const price = resolveRegionalCheckoutPrice(pro!, 'pakistan');
    expect(price?.currency).toBe('pkr');
    expect(price?.unitAmount).toBe(18299900);
    expect(price?.display).toBe('PKR 182,999');
  });

  it('derives 25% deposit in PKR minor units', () => {
    expect(pro).toBeTruthy();
    const full = resolveRegionalCheckoutPrice(pro!, 'pakistan')!;
    const deposit = resolveRegionalDepositPrice(full);
    expect(deposit.unitAmount).toBe(4574975);
    expect(formatRegionalDepositDisplay(full.display)).toBe('PKR 45,749.75');
  });

  it('resolves self-paced price book for Pakistan', () => {
    expect(pro).toBeTruthy();
    const price = resolveRegionalCheckoutPrice(pro!, 'pakistan', null, {
      priceBook: 'self_paced',
    });
    expect(price?.display).toBe('PKR 91,999');
    expect(price?.unitAmount).toBe(9199900);
  });

  it('charges global tuition in USD', () => {
    expect(pro).toBeTruthy();
    const price = resolveRegionalCheckoutPrice(pro!, 'global');
    expect(price?.currency).toBe('usd');
    expect(price?.unitAmount).toBe(89900);
  });
});
