import { describe, expect, it } from 'vitest';
import { buildOrganizationSchema } from '@/lib/schema';

describe('OPEN-08 Organization schema contract', () => {
  it('emits Organization only — not EducationalOrganization without accreditation proof', () => {
    const org = buildOrganizationSchema() as { '@type': string | string[]; sameAs: string[] };
    expect(org['@type']).toBe('Organization');
    expect(JSON.stringify(org)).not.toContain('EducationalOrganization');
    expect(new Set(org.sameAs).size).toBe(org.sameAs.length);
  });
});
