export const PRODUCTION_SITE_URL = 'https://pmstructure.com';

export function isLocalDevHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]'
  );
}

export function isProductionRuntime(): boolean {
  return (
    process.env.VERCEL_ENV === 'production' ||
    process.env.NODE_ENV === 'production' ||
    Boolean(process.env.RAILWAY_ENVIRONMENT)
  );
}

/** Never emit localhost in production builds or on Railway. */
export function resolvePublicSiteUrl(
  envValue?: string,
  fallback: string = PRODUCTION_SITE_URL,
): string {
  const raw = envValue?.trim().replace(/\/$/, '');
  const production = isProductionRuntime();

  if (raw) {
    try {
      const host = new URL(raw).hostname;
      if (production && isLocalDevHost(host)) {
        return PRODUCTION_SITE_URL;
      }
      return raw;
    } catch {
      // fall through
    }
  }

  return production ? PRODUCTION_SITE_URL : raw || fallback;
}
