import { describe, expect, it } from 'vitest';
import { regionFromCountryCode } from '@/lib/region-geo';

describe('region-geo', () => {
  it('maps South Asia country codes', () => {
    expect(regionFromCountryCode('PK')).toEqual({ regionId: 'pakistan', gccCountry: null });
    expect(regionFromCountryCode('IN')).toEqual({ regionId: 'india', gccCountry: null });
  });

  it('maps GCC members with country code', () => {
    expect(regionFromCountryCode('AE')).toEqual({ regionId: 'gcc', gccCountry: 'AE' });
    expect(regionFromCountryCode('SA')).toEqual({ regionId: 'gcc', gccCountry: 'SA' });
  });

  it('maps UK and Europe', () => {
    expect(regionFromCountryCode('GB')).toEqual({ regionId: 'uk', gccCountry: null });
    expect(regionFromCountryCode('DE')).toEqual({ regionId: 'europe', gccCountry: null });
  });

  it('falls back to global for unknown codes', () => {
    expect(regionFromCountryCode('US')).toEqual({ regionId: 'global', gccCountry: null });
    expect(regionFromCountryCode(null)).toEqual({ regionId: 'global', gccCountry: null });
  });
});
