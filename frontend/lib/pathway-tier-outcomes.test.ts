import { describe, expect, it } from 'vitest';
import { resolvePathwayTierOutcomes } from '@/lib/pathway-tier-outcomes';

describe('pathway-tier-outcomes', () => {
  it('returns different bullets per tier for PMP', () => {
    const foundation = resolvePathwayTierOutcomes('pmp', 'foundation');
    const professional = resolvePathwayTierOutcomes('pmp', 'professional');
    const mastery = resolvePathwayTierOutcomes('pmp', 'mastery');

    expect(foundation[0]).toMatch(/conceptual|vocabulary|pathway/i);
    expect(professional[0]).toMatch(/ECO|mocks|exam/i);
    expect(mastery[0]).toMatch(/Translate|mentor|implementation/i);
    expect(foundation).not.toEqual(professional);
  });

  it('uses cert-specific pathwayOutcomes when provided', () => {
    const custom = {
      foundation: ['Custom foundation outcome'],
    };
    const out = resolvePathwayTierOutcomes('capm', 'foundation', custom);
    expect(out).toEqual(['Custom foundation outcome']);
  });
});
