import type { GccCountryCode, RegionId } from '@/types/regional-catalogue';

const GCC: GccCountryCode[] = ['AE', 'SA', 'QA', 'KW', 'BH', 'OM'];

/** Best-effort map from IP geo country code → catalogue region (portal bootstrap only). */
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

/** Optional IP hint — never throws; returns null on failure. */
export async function fetchPortalRegionHint(): Promise<{
  regionId: RegionId;
  gccCountry: GccCountryCode | null;
} | null> {
  try {
    const res = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { country_code?: string };
    return regionFromCountryCode(data.country_code);
  } catch {
    return null;
  }
}
