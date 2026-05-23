export const COOKIE_CONSENT_KEY = 'pms_cookie_consent';
export const COOKIE_CONSENT_VERSION = 'v1';

export type CookieConsentChoice = 'all' | 'necessary';

export interface CookieConsentState {
  version: string;
  choice: CookieConsentChoice;
  updatedAt: string;
}

export function readCookieConsent(): CookieConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentState;
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeCookieConsent(choice: CookieConsentChoice): void {
  const state: CookieConsentState = {
    version: COOKIE_CONSENT_VERSION,
    choice,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(state));
  document.cookie = `${COOKIE_CONSENT_KEY}=${choice};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
}

export function hasAnalyticsConsent(): boolean {
  return readCookieConsent()?.choice === 'all';
}
