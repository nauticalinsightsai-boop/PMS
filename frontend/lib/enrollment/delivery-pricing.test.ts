import { describe, expect, it } from 'vitest';
import {
  buildRegionalPriceFromUsd,
  ceilCharm99,
  charm999,
  deriveFoundationUsd,
  deriveSelfPacedUsd,
  nearestCharm50,
  regionalizeUsd,
} from '@/lib/enrollment/delivery-pricing';

describe('nearestCharm50', () => {
  it('lands on 49/99 ladder', () => {
    expect(nearestCharm50(14.7)).toBe(49);
    expect(nearestCharm50(74.7)).toBe(99);
    expect(nearestCharm50(89.7)).toBe(99);
    expect(nearestCharm50(149.5)).toBe(149);
    expect(nearestCharm50(249.5)).toBe(249);
    expect(nearestCharm50(274.5)).toBe(299);
    expect(nearestCharm50(349.5)).toBe(349);
    expect(nearestCharm50(374.5)).toBe(399);
    expect(nearestCharm50(449.5)).toBe(449);
    expect(nearestCharm50(599.5)).toBe(599);
  });
});

describe('ceilCharm99 fallback', () => {
  it('preserves unlisted GCC catalogue behavior', () => {
    expect(ceilCharm99(50)).toBe(99);
    expect(ceilCharm99(2700)).toBe(2799);
  });
});

describe('charm999', () => {
  it('ceils to next …999', () => {
    expect(charm999(500)).toBe(999);
    expect(charm999(8217)).toBe(8999);
    expect(charm999(52171.9)).toBe(52999);
    expect(charm999(26086.9)).toBe(26999);
  });
});

describe('deriveFoundationUsd / deriveSelfPacedUsd', () => {
  it('applies foundation 30% and self-paced 50% ladders', () => {
    expect(deriveFoundationUsd(299)).toBe(99);
    expect(deriveFoundationUsd(249)).toBe(99);
    expect(deriveFoundationUsd(149)).toBe(49);
    expect(deriveFoundationUsd(49)).toBe(49);

    expect(deriveSelfPacedUsd(299)).toBe(149);
    expect(deriveSelfPacedUsd(399)).toBe(199);
    expect(deriveSelfPacedUsd(499)).toBe(249);
    expect(deriveSelfPacedUsd(549)).toBe(299);
    expect(deriveSelfPacedUsd(599)).toBe(299);
    expect(deriveSelfPacedUsd(699)).toBe(349);
    expect(deriveSelfPacedUsd(749)).toBe(399);
    expect(deriveSelfPacedUsd(799)).toBe(399);
    expect(deriveSelfPacedUsd(899)).toBe(449);
    expect(deriveSelfPacedUsd(999)).toBe(499);
    expect(deriveSelfPacedUsd(1199)).toBe(599);
    expect(deriveSelfPacedUsd(1299)).toBe(649);
    expect(deriveSelfPacedUsd(1499)).toBe(749);
  });
});

describe('regionalizeUsd professional discounts', () => {
  it('matches PMP mentor $899 plan checks with fee-adjusted pay fractions', () => {
    expect(regionalizeUsd(899, 'india', 'professional').display).toBe('₹54,999');
    expect(regionalizeUsd(899, 'pakistan', 'professional').display).toBe('PKR 182,999');
    // Owner lock for professional:899:AE
    expect(regionalizeUsd(899, 'gcc', 'professional', 'AE').display).toBe('AED 2,649');
    expect(regionalizeUsd(899, 'europe', 'professional').display).toBe('€849');
    expect(regionalizeUsd(899, 'uk', 'professional').display).toBe('£749');
  });

  it('matches PMP self-paced $449 plan checks', () => {
    expect(regionalizeUsd(449, 'india', 'professional').display).toBe('₹27,999');
    expect(regionalizeUsd(449, 'pakistan', 'professional').display).toBe('PKR 91,999');
    // Owner locks for professional:449:AE / QA
    expect(regionalizeUsd(449, 'gcc', 'professional', 'AE').display).toBe('AED 1,349');
    expect(regionalizeUsd(449, 'gcc', 'professional', 'QA').display).toBe('QAR 1,299');
  });

  it('uses supplied AED lookup values without changing an unlisted fallback row', () => {
    expect(regionalizeUsd(399, 'gcc', 'professional', 'AE').display).toBe('AED 1,149');
    // Owner lock for professional:199:AE
    expect(regionalizeUsd(199, 'gcc', 'professional', 'AE').display).toBe('AED 599');
    // Derived fallback (no SA:299 lock) uses fee-adjusted pay fraction
    expect(regionalizeUsd(299, 'gcc', 'professional', 'SA').display).toBe('SAR 999');
  });

  it('foundation has no regional scholarship cut', () => {
    expect(regionalizeUsd(99, 'india', 'foundation').display).toBe('₹8,999');
    expect(regionalizeUsd(99, 'pakistan', 'foundation').display).toBe('PKR 27,999');
    expect(regionalizeUsd(49, 'india', 'foundation').display).toBe('₹4,999');
    const gcc = buildRegionalPriceFromUsd(99, 'gcc', 'foundation');
    expect(gcc.isScholarship).toBe(false);
    expect(gcc.perCountry?.AE).toBe('AED 399');
  });
});
