import { describe, expect, it } from 'vitest';
import { getPrivacyDocument } from './index';

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
