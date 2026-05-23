import { describe, expect, it } from 'vitest';
import { dossierTextToBullets } from '@/lib/dossier-text-bullets';

describe('dossierTextToBullets', () => {
  it('splits registration steps on arrows', () => {
    const bullets = dossierTextToBullets(
      'Check eligibility → complete application → pay/schedule exam',
    );
    expect(bullets).toHaveLength(3);
    expect(bullets[0]).toMatch(/Check eligibility/i);
  });

  it('splits exam format on semicolons', () => {
    const bullets = dossierTextToBullets(
      '180 questions; 230 minutes; includes 5 unscored pretest questions',
    );
    expect(bullets.length).toBeGreaterThanOrEqual(3);
  });

  it('splits prerequisites into option A and B', () => {
    const bullets = dossierTextToBullets(
      'Either: (A) four-year degree + 36 months leading projects or (B) secondary diploma + 60 months leading projects',
    );
    expect(bullets).toHaveLength(2);
    expect(bullets[0]).toMatch(/four-year degree/i);
    expect(bullets[1]).toMatch(/secondary diploma/i);
  });
});
