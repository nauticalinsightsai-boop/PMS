import type { GccCountryCode, RegionId } from '@/types/regional-catalogue';

const GCC: GccCountryCode[] = ['AE', 'SA', 'QA', 'KW', 'BH', 'OM'];

/** Best-effort map from ISO country code → catalogue region. */
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

export type RegionGeoHint = {
  regionId: RegionId;
  gccCountry: GccCountryCode | null;
};

/** Optional IP hint — never throws; returns null on failure. */
export async function fetchIpRegionHint(): Promise<RegionGeoHint | null> {
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

/** @deprecated Use fetchIpRegionHint */
export const fetchPortalRegionHint = fetchIpRegionHint;

async function reverseGeocodeCountryCode(latitude: number, longitude: number): Promise<string | null> {
  try {
    const url = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client');
    url.searchParams.set('latitude', String(latitude));
    url.searchParams.set('longitude', String(longitude));
    url.searchParams.set('localityLanguage', 'en');
    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { countryCode?: string };
    return data.countryCode ?? null;
  } catch {
    return null;
  }
}

/** Browser geolocation + reverse geocode — requires user permission. */
export async function fetchBrowserGeolocationRegionHint(): Promise<RegionGeoHint | null> {
  if (typeof window === 'undefined' || !navigator.geolocation) return null;

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 12000,
      maximumAge: 300_000,
    });
  });

  const countryCode = await reverseGeocodeCountryCode(
    position.coords.latitude,
    position.coords.longitude,
  );
  if (!countryCode) return null;
  return regionFromCountryCode(countryCode);
}
