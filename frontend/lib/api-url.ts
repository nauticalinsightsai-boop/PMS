/**
 * Resolve API path for fetch().
 * Browser: same-origin relative path so checkout works on whatever host/port
 * serves the page (dev :3050, gateway :3000, production).
 * Server/SSR: absolute URL from NEXT_PUBLIC_API_URL or local gateway default.
 */
export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (typeof window !== 'undefined') return normalized;
  const base = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  return `${base}${normalized}`;
}
