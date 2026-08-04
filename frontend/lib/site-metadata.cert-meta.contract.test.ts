import { describe, expect, it } from 'vitest';
import { certifications } from '@/data/certification-index';
import { buildCertMetadata } from '@/lib/site-metadata';

describe('OPEN-13 cert metadata uniqueness', () => {
  it('does not reuse one family description across distinct PRINCE2 cert pages', () => {
    const prince2 = certifications.filter((c) => c.familyId === 'PRINCE2');
    expect(prince2.length).toBeGreaterThan(2);
    const descriptions = prince2.map((c) => {
      const meta = buildCertMetadata(c.id);
      const desc = meta.description;
      expect(typeof desc).toBe('string');
      expect(String(desc).length).toBeGreaterThan(40);
      return String(desc);
    });
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it('keeps unique descriptions for prince2-agile, prince2-agile-practitioner, and mor', () => {
    const a = String(buildCertMetadata('prince2-agile').description);
    const b = String(buildCertMetadata('prince2-agile-practitioner').description);
    const c = String(buildCertMetadata('mor').description);
    expect(a).not.toEqual(b);
    expect(a).not.toEqual(c);
    expect(b).not.toEqual(c);
    expect(a).toContain('agile');
    expect(b.toLowerCase()).toContain('agile');
    expect(c.toLowerCase()).toMatch(/risk|management of risk|m_o_r/i);
  });
});
