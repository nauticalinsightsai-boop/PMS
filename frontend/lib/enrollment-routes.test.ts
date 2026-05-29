import { describe, expect, it } from 'vitest';
import {
  enrollPath,
  enrollTierSlugFromTierId,
  enrollmentPathForOffering,
  resolveOfferingForEnrollment,
  tierIdsForEnrollSlug,
} from './enrollment-routes';

describe('enrollment-routes', () => {
  it('maps tier ids to URL slugs', () => {
    expect(enrollTierSlugFromTierId('mastery_corporate')).toBe('mastery-corporate');
    expect(enrollTierSlugFromTierId('foundation')).toBe('foundation');
  });

  it('builds enroll paths', () => {
    expect(enrollPath('pmp', 'foundation')).toBe('/certifications/pmp/foundation/enroll');
  });

  it('resolves PMP foundation offering', () => {
    const offering = resolveOfferingForEnrollment('pmp', 'foundation');
    expect(offering?.offeringId).toBe('pmp-preparation-foundation');
  });

  it('maps mastery slug to tier ids', () => {
    expect(tierIdsForEnrollSlug('mastery')).toContain('mastery');
  });

  it('builds offering enrollment path', () => {
    const href = enrollmentPathForOffering('pmp-preparation-foundation');
    expect(href).toBe('/certifications/pmp/foundation/enroll');
  });
});
