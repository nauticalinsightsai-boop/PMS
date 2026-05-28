import { getDashboardApiHeaders } from '@/lib/auth/dashboard-api-headers';

/** Same-origin fetch with dashboard Bearer token when present. */
export function fetchDashboardApi(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const auth = getDashboardApiHeaders();
  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json');
  }
  for (const [k, v] of Object.entries(auth)) {
    headers.set(k, v);
  }
  return fetch(input, { ...init, headers, credentials: init?.credentials ?? 'include' });
}
