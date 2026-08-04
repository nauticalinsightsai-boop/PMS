import { countries } from 'country-flag-icons';
import { describe, expect, it } from 'vitest';
import { GCC_SCHOLARSHIP_COUNTRIES } from '@/lib/scholarship';
import {
  isIsoAlpha2RegionIdentifier,
  scholarshipCountryOptions,
  scholarshipRegionName,
} from '@/lib/enrollment/scholarship-country-options';

const INVALID_INSTALLED_IDENTIFIERS = [
  'BQ-BO',
  'BQ-SA',
  'BQ-SE',
  'ES-CT',
  'GB-ENG',
  'GB-NIR',
  'GB-SCT',
  'GB-WLS',
] as const;

describe('scholarship country options', () => {
  it('filters every non-ISO-alpha-2 installed identifier before DisplayNames lookup', () => {
    const globalOptions = scholarshipCountryOptions('global');
    const globalCodes = globalOptions.map((option) => option.code);

    expect(() => scholarshipCountryOptions('global')).not.toThrow();
    expect(countries.filter((code) => !isIsoAlpha2RegionIdentifier(code))).toEqual(
      INVALID_INSTALLED_IDENTIFIERS,
    );
    expect(globalCodes.every(isIsoAlpha2RegionIdentifier)).toBe(true);
    expect(globalCodes).not.toContain('IN');
    expect(globalCodes).not.toContain('PK');
    expect(globalCodes).toEqual(expect.arrayContaining(['GB', 'US']));
    for (const invalidCode of INVALID_INSTALLED_IDENTIFIERS) {
      expect(globalCodes).not.toContain(invalidCode);
    }
    for (const gccCode of GCC_SCHOLARSHIP_COUNTRIES) {
      expect(globalCodes).not.toContain(gccCode);
    }
  });

  it('keeps the exact GCC allowlist and returns safe labels', () => {
    const gccOptions = scholarshipCountryOptions('gcc');

    expect(gccOptions.map((option) => option.code).sort()).toEqual(
      [...GCC_SCHOLARSHIP_COUNTRIES].sort(),
    );
    expect(gccOptions.every((option) => option.name.length > 0)).toBe(true);
  });

  it('fails closed to a normalized code if a label lookup throws', () => {
    const throwingDisplayNames = {
      of: () => {
        throw new RangeError('invalid region');
      },
    };

    expect(scholarshipRegionName('us', throwingDisplayNames)).toBe('US');
    expect(scholarshipRegionName('GB-ENG', throwingDisplayNames)).toBe('GB-ENG');
  });
});
