import { describe, expect, it } from 'vitest';
import { defaultNewsletterAuthorsRegistry } from '@pms/site-content/newsletter-authors';
import { buildNewsletterAuthorProfileSchema } from '@/components/seo/NewsletterAuthorJsonLd';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('Packet B newsletter authorship honesty', () => {
  const registry = defaultNewsletterAuthorsRegistry();

  it('keeps editorial roles personSchemaEligible=false and founder Person-eligible', () => {
    const founder = registry.authors.find((p) => p.slug === 'sheikh-m-abdullah');
    const roles = registry.authors.filter((p) => p.bylineType === 'editorial_role');
    expect(founder?.personSchemaEligible).toBe(true);
    expect(roles.length).toBe(2);
    for (const role of roles) {
      expect(role.personSchemaEligible).toBe(false);
      expect(role.linkedinUrl || role.twitterUrl || role.websiteUrl || role.email).toBeFalsy();
    }
  });

  it('emits ProfilePage Person only for the founder and Organization for roles', () => {
    const founder = registry.authors.find((p) => p.slug === 'sheikh-m-abdullah')!;
    const role = registry.authors.find((p) => p.slug === 'pmp-readiness-mentor')!;
    const founderSchema = buildNewsletterAuthorProfileSchema(founder);
    const roleSchema = buildNewsletterAuthorProfileSchema(role);
    expect(founderSchema['@type']).toBe('ProfilePage');
    expect(JSON.stringify(founderSchema)).toContain('"@type":"Person"');
    expect(JSON.stringify(founderSchema)).not.toContain('sameAs');
    expect(roleSchema['@type']).toBe('ProfilePage');
    expect(JSON.stringify(roleSchema)).not.toContain('"@type":"Person"');
    expect(JSON.stringify(roleSchema)).toContain('"@type":"Organization"');
  });

  it('newsletter hub links author desks and the MENA career-evidence article', () => {
    const newsletter = readFileSync(
      path.join(process.cwd(), 'components/pages/Newsletter.tsx'),
      'utf8',
    );
    expect(newsletter).toContain('/newsletter/author/sheikh-m-abdullah');
    expect(newsletter).toContain('/newsletter/author/pmp-readiness-mentor');
    expect(newsletter).toContain('/newsletter/author/pmo-transformation-mentor');
    expect(newsletter).toContain('/newsletter/mena-project-talent-gap-career-evidence');
  });
});
