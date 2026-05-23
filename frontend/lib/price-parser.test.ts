import { describe, expect, it } from 'vitest';
import { getOfferingById } from '@/lib/regional-catalogue';
import { GLOBAL_REFERENCE_FX_PER_USD } from '@/lib/regional-fx-rates';
import {
  formatAmountLikeTemplate,
  parseDisplayAmount,
  resolveComparableGlobalReference,
} from '@/lib/price-parser';

describe('price-parser', () => {
  it('parseDisplayAmount reads USD and AED strings', () => {
    expect(parseDisplayAmount('$299')).toBe(299);
    expect(parseDisplayAmount('AED 2,650')).toBe(2650);
    expect(parseDisplayAmount('₹9,999')).toBe(9999);
  });

  it('formatAmountLikeTemplate keeps currency prefix', () => {
    expect(formatAmountLikeTemplate('AED 900', 1098)).toBe('AED 1,098');
  });

  it('global reference is direct USD conversion in local currency (PKR)', () => {
    const pro = getOfferingById('pmp-preparation-professional');
    expect(pro).toBeDefined();
    const ref = resolveComparableGlobalReference(pro!, 'pakistan', 'PKR 219,999');
    expect(ref).toMatch(/^PKR /);
    expect(ref).not.toMatch(/\$/);
    const refNum = parseDisplayAmount(ref!);
    const expected = Math.round(899 * GLOBAL_REFERENCE_FX_PER_USD.PKR);
    expect(refNum).toBe(expected);
    expect(refNum).not.toBe(Math.round(899 * (219_999 / 749)));
  });

  it('scholarship GCC global reference is direct USD to AED', () => {
    const foundation = getOfferingById('pmp-preparation-foundation');
    expect(foundation).toBeDefined();
    const ref = resolveComparableGlobalReference(foundation!, 'gcc', 'AED 900', 'AE');
    expect(ref).toMatch(/^AED /);
    const refNum = parseDisplayAmount(ref!);
    expect(refNum).toBe(Math.round(299 * GLOBAL_REFERENCE_FX_PER_USD.AED));
  });

  it('scholarship India global reference is direct USD to INR', () => {
    const foundation = getOfferingById('pmp-preparation-foundation');
    const ref = resolveComparableGlobalReference(foundation!, 'india', '₹9,999');
    expect(ref).toMatch(/^₹/);
    expect(parseDisplayAmount(ref!)).toBe(Math.round(299 * GLOBAL_REFERENCE_FX_PER_USD.INR));
  });
});
