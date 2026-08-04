import { describe, expect, it } from 'vitest';
import { FAQ_ENTRIES } from '@/content/faq/data';
import { getAllFaqs } from '@/content/faq';
import { SITE_ORGANIZATION_SAME_AS } from '@/config/site';
import { PMS_ORGANIZATION_SAME_AS } from '@/config/pms-site';
import { buildEntityJson, buildFaqJson, buildPmpFaqJson } from '@/lib/ai-files/builders';
import { buildOrganizationSchema } from '@/lib/schema';

function normalizeQuestion(q: string): string {
  return q.trim().replace(/\s+/g, ' ').toLowerCase();
}

describe('OPEN-06 FAQ duplicate contract', () => {
  it('FAQ_ENTRIES excludes known duplicate PMP26 ids', () => {
    const ids = new Set(FAQ_ENTRIES.map((f) => f.id));
    expect(ids.has('exams-pdu-eligibility')).toBe(true);
    expect(ids.has('t176-faq-pmi-affiliation')).toBe(true);
    expect(ids.has('pmp26-elig-04')).toBe(false);
    expect(ids.has('pmp26-gap-04')).toBe(false);
  });

  it('normalized FAQ questions are unique in FAQ_ENTRIES and getAllFaqs', () => {
    for (const list of [FAQ_ENTRIES, getAllFaqs()]) {
      const seen = new Set<string>();
      for (const entry of list) {
        const key = normalizeQuestion(entry.question);
        expect(seen.has(key), entry.id).toBe(false);
        seen.add(key);
      }
    }
  });

  it('faq.json / pmp-faq.json builders keep unique normalized questions', () => {
    for (const built of [buildFaqJson(), buildPmpFaqJson()] as const) {
      const seen = new Set<string>();
      for (const item of built.items as { id: string; question: string }[]) {
        const key = normalizeQuestion(item.question);
        expect(seen.has(key), item.id).toBe(false);
        seen.add(key);
      }
    }
  });
});

describe('OPEN-07 sameAs contract', () => {
  it('PMS_ORGANIZATION_SAME_AS has a single unique site URL', () => {
    expect(PMS_ORGANIZATION_SAME_AS).toEqual(['https://pmstructure.com']);
  });

  it('SITE_ORGANIZATION_SAME_AS is unique and includes verified social profiles', () => {
    expect(new Set(SITE_ORGANIZATION_SAME_AS).size).toBe(SITE_ORGANIZATION_SAME_AS.length);
    expect(SITE_ORGANIZATION_SAME_AS[0]).toBe('https://pmstructure.com');
    expect(SITE_ORGANIZATION_SAME_AS).toContain('https://www.linkedin.com/company/pmstructure');
    expect(SITE_ORGANIZATION_SAME_AS).toContain('https://x.com/PMStructure');
  });

  it('entity.json and Organization schema use unique owned sameAs', () => {
    const entity = buildEntityJson() as { sameAs: string[] };
    const org = buildOrganizationSchema() as { sameAs: string[] };
    expect(new Set(entity.sameAs).size).toBe(entity.sameAs.length);
    expect(new Set(org.sameAs).size).toBe(org.sameAs.length);
    expect(entity.sameAs).toEqual([...SITE_ORGANIZATION_SAME_AS]);
    expect(org.sameAs).toEqual([...SITE_ORGANIZATION_SAME_AS]);
  });
});
