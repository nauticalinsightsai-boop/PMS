import { describe, expect, it } from 'vitest';
import { getPrivacyDocument, legalHubSections, getLegalDocumentBySlug, DYNAMIC_LEGAL_SLUGS } from './index';

describe('legal hub', () => {
  it('resolves all dynamic legal slugs', () => {
    for (const slug of DYNAMIC_LEGAL_SLUGS) {
      const doc = getLegalDocumentBySlug(slug);
      expect(doc).not.toBeNull();
      expect(doc!.slug).toBe(slug);
    }
  });

  it('hub card hrefs use /legal', () => {
    for (const section of legalHubSections) {
      for (const card of section.cards) {
        expect(card.href.startsWith('/legal')).toBe(true);
        expect(card.href).not.toContain('legalhub');
      }
    }
  });
});

describe('getPrivacyDocument', () => {
  it('returns global sections for global region', () => {
    const doc = getPrivacyDocument('global');
    expect(doc.sections.length).toBeGreaterThan(5);
    expect(doc.title).toContain('Global');
  });

  it('merges EU addendum', () => {
    const doc = getPrivacyDocument('eu');
    expect(doc.sections.some((s) => s.id === 'rights')).toBe(true);
    expect(doc.sections.length).toBeGreaterThan(10);
  });
});
