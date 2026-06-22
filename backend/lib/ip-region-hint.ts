import type { RegionId } from '@/lib/regional-catalogue';

const GCC = ['AE', 'SA', 'QA', 'KW', 'BH', 'OM'] as const;
type GccCountryCode = (typeof GCC)[number];

export function regionFromCountryCode(countryCode: string | undefined | null): {
  regionId: RegionId;
  gccCountry: GccCountryCode | null;
} {
  const cc = countryCode?.trim().toUpperCase();
  if (!cc) return { regionId: 'global', gccCountry: null };
  if (cc === 'IN') return { regionId: 'india', gccCountry: null };
  if (cc === 'PK') return { regionId: 'pakistan', gccCountry: null };
  if (cc === 'GB') return { regionId: 'uk', gccCountry: null };
  if (GCC.includes(cc as GccCountryCode)) {
    return { regionId: 'gcc', gccCountry: cc as GccCountryCode };
  }
  const europe = new Set([
    'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'CH', 'PL', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT',
  ]);
  if (europe.has(cc)) return { regionId: 'europe', gccCountry: null };
  return { regionId: 'global', gccCountry: null };
}
