import { describe, expect, it } from 'vitest';
import { certifications } from '@/data/siteData';
import { buildPathwayTiersForCert } from '@/lib/pathway-from-catalogue';

const REGIONS = ['global', 'india', 'pakistan', 'gcc', 'europe', 'uk'] as const;

describe('buildPathwayTiersForCert — all site certifications', () => {
  for (const cert of certifications) {
    for (const regionId of REGIONS) {
      it(`${cert.id} @ ${regionId} builds tiers with pathway CTA labels`, () => {
        const tiers = buildPathwayTiersForCert(cert.id, cert.name, regionId, null);
        for (const tier of tiers) {
          expect(tier.pathwayCta.label.length).toBeGreaterThan(0);
          expect(tier.pathwayCta.label).not.toMatch(/View programme & verify eligibility/i);
        }
      });
    }
  }
});
