/** URL prefix for the admin app on the main site (e.g. pmstructure.com/admin). */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? '/admin').replace(/\/$/, '');

/** True when dashboard UI is mounted under /admin on the marketing app (no Next basePath). */
export const DASHBOARD_BUNDLED = process.env.NEXT_PUBLIC_DASHBOARD_BUNDLED === 'true';

/** Prefix an app path (`/login`, `/dashboard/...`, `/api/...`). */
export function withBasePath(path: string): string {
  if (!path.startsWith('/')) path = `/${path}`;
  if (!BASE_PATH) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}`;
}

/**
 * Normalize pathname/href to app paths (`/dashboard/...`) whether or not `/admin` is in the URL.
 */
export function normalizeDashboardPath(path: string): string {
  if (!path.startsWith('/')) path = `/${path}`;
  if (!BASE_PATH) return path;
  if (path === BASE_PATH) return '/';
  if (path.startsWith(`${BASE_PATH}/`)) return path.slice(BASE_PATH.length) || '/';
  return path;
}

/** @deprecated Use normalizeDashboardPath */
export const routerPath = normalizeDashboardPath;

/** Link/router target: bundled app needs `/admin` prefix; standalone dashboard uses Next basePath. */
export function dashboardHref(path: string): string {
  if (!path.startsWith('/')) path = `/${path}`;
  if (DASHBOARD_BUNDLED && BASE_PATH) return withBasePath(path);
  return path;
}