import { describe, expect, it } from 'vitest';
import { resolvePricingPresentation } from '@/lib/regional-price-display';

describe('resolvePricingPresentation', () => {
  it('scholarship when regional differs from global', () => {
    const p = resolvePricingPresentation({
      original: '$899',
      active: '₹44,999',
      membership: '₹35,999',
      showScholarshipLabels: true,
      footnote: null,
      regionalLabel: 'Regional Scholarship price',
    });
    expect(p.kind).toBe('scholarship');
    expect(p.showGlobalReference).toBe(true);
  });

  it('single when only one authoritative price', () => {
    const p = resolvePricingPresentation({
      original: '$899',
      active: '$899',
      membership: null,
      showScholarshipLabels: false,
      footnote: null,
      regionalLabel: 'Regional price',
    });
    expect(p.kind).toBe('single');
    expect(p.showGlobalReference).toBe(false);
  });
});
