import { describe, expect, it } from 'vitest';
import {
  DEFAULT_COMPARE_CERT_IDS,
  MAX_COMPARE_CERTS,
  compareCertificationPriority,
  getCompareableCertifications,
  getDefaultCompareIdsForFamily,
  parseCompareCertIds,
  toggleCompareSelection,
} from './compare-certifications';

describe('compare-certifications', () => {
  it('lists certifications with matrix pathways', () => {
    const ids = getCompareableCertifications().map((c) => c.id);
    expect(ids).toContain('pmp');
    expect(ids).toContain('capm');
    expect(ids).not.toContain('gpm-b');
  });

  it('parses URL cert ids with fallback defaults', () => {
    const allowed = new Set(getCompareableCertifications().map((c) => c.id));
    expect(parseCompareCertIds('pmp,prince2', allowed)).toEqual(['pmp', 'prince2']);
    expect(parseCompareCertIds(null, allowed).length).toBeGreaterThan(0);
    expect(parseCompareCertIds('invalid', allowed)).toEqual(
      DEFAULT_COMPARE_CERT_IDS.filter((id) => allowed.has(id)).slice(0, MAX_COMPARE_CERTS),
    );
  });

  it('limits selection to three', () => {
    const { next, atMax } = toggleCompareSelection(['a', 'b', 'c'], 'd');
    expect(next).toEqual(['a', 'b', 'c']);
    expect(atMax).toBe(true);
  });

  it('orders PMI flagship certifications before others in the family', () => {
    const certs = getCompareableCertifications().filter((c) => c.familyId === 'PMI');
    const ids = certs.map((c) => c.id);
    expect(ids.indexOf('pmp')).toBeLessThan(ids.indexOf('pgmp'));
    expect(compareCertificationPriority(
      certs.find((c) => c.id === 'pmp')!,
      certs.find((c) => c.id === 'capm')!,
    )).toBeLessThan(0);
  });

  it('returns family default compare ids', () => {
    const allowed = new Set(getCompareableCertifications().map((c) => c.id));
    expect(getDefaultCompareIdsForFamily('PRINCE2', allowed)).toEqual([
      'prince2',
      'prince2-practitioner',
      'prince2-agile',
    ]);
  });
});
