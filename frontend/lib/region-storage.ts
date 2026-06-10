import type { GccCountryCode, RegionId } from '@/types/regional-catalogue';

const REGION_KEY = 'pms_region';
const GCC_KEY = 'pms_gcc_country';
const SOURCE_KEY = 'pms_region_source';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90;

/** How the active region was determined. Manual selection requires location share first. */
export type RegionSource = 'ip' | 'geolocation' | 'manual';

export interface StoredRegion {
  regionId: RegionId;
  gccCountry: GccCountryCode | null;
  source: RegionSource | null;
}

export function readStoredRegionSource(): RegionSource | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SOURCE_KEY);
    if (raw === 'ip' || raw === 'geolocation' || raw === 'manual') return raw;
    return null;
  } catch {
    return null;
  }
}

export function writeStoredRegionSource(source: RegionSource): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SOURCE_KEY, source);
}

export function readStoredRegion(): StoredRegion | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(REGION_KEY);
    if (!raw) return null;
    const regionId = raw as RegionId;
    const gccCountry = (localStorage.getItem(GCC_KEY) as GccCountryCode | null) ?? null;
    return { regionId, gccCountry, source: readStoredRegionSource() };
  } catch {
    return null;
  }
}

export function writeStoredRegion(
  regionId: RegionId,
  gccCountry?: GccCountryCode | null,
  source?: RegionSource,
): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REGION_KEY, regionId);
  if (gccCountry) localStorage.setItem(GCC_KEY, gccCountry);
  else localStorage.removeItem(GCC_KEY);
  if (source) writeStoredRegionSource(source);
  const gccPart = gccCountry ? `;gcc=${gccCountry}` : '';
  document.cookie = `${REGION_KEY}=${regionId}${gccPart};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
}

export function clearStoredRegion(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(REGION_KEY);
  localStorage.removeItem(GCC_KEY);
  localStorage.removeItem(SOURCE_KEY);
  document.cookie = `${REGION_KEY}=;path=/;max-age=0`;
}

export function hasStoredRegion(): boolean {
  return readStoredRegion() != null;
}
