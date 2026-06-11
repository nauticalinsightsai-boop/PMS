/** URL prefix for the admin app on the main site (e.g. pmstructure.com/admin). */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? '/admin').replace(/\/$/, '');

/** Prefix an app path (`/login`, `/dashboard/...`, `/api/...`). */
export function withBasePath(path: string): string {
  if (!path.startsWith('/')) path = `/${path}`;
  if (!BASE_PATH) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}`;
}

/**
 * Path for `next/navigation` when this app’s Next config sets `basePath`.
 * The bundled marketing app has no basePath: use `withBasePath` there instead.
 */
export function routerPath(path: string): string {
  if (!path.startsWith('/')) path = `/${path}`;
  if (!BASE_PATH) return path;
  if (path === BASE_PATH) return '/';
  if (path.startsWith(`${BASE_PATH}/`)) return path.slice(BASE_PATH.length) || '/';
  return path;
}