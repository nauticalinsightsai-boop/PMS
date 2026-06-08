import { withBasePath } from '@/lib/base-path';
import { getDashboardApiHeaders } from '@/lib/auth/dashboard-api-headers';

function resolveInput(input: RequestInfo | URL): RequestInfo | URL {
  if (typeof input === 'string' && input.startsWith('/')) {
    return withBasePath(input);
  }
  return input;
}

/** Same-origin fetch with dashboard Bearer token and `/admin` path prefix when configured. */
export function fetchDashboardApi(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const auth = getDashboardApiHeaders();
  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json');
  }
  for (const [k, v] of Object.entries(auth)) {
    headers.set(k, v);
  }
  return fetch(resolveInput(input), { ...init, headers, credentials: init?.credentials ?? 'include' });
}
