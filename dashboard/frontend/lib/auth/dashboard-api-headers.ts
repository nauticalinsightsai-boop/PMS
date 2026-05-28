/** localStorage key — must match AuthContext `AUTH_API_TOKEN_KEY`. */
export const AUTH_API_TOKEN_KEY = 'auth_api_token';

/** Bearer headers for dashboard CMS API calls from the browser. */
export function getDashboardApiHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = getDashboardSessionToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/** Reads auth_api_token, falling back to the signed token stored in auth_session JSON. */
export function getDashboardSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  const direct = localStorage.getItem(AUTH_API_TOKEN_KEY)?.trim();
  if (direct) return direct;
  try {
    const raw = localStorage.getItem('auth_session');
    if (!raw) return null;
    const session = JSON.parse(raw) as { sessionApiToken?: string };
    const fromSession = session.sessionApiToken?.trim();
    if (fromSession) {
      localStorage.setItem(AUTH_API_TOKEN_KEY, fromSession);
      return fromSession;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function hasDashboardMutationAuth(): boolean {
  return Boolean(getDashboardSessionToken());
}
