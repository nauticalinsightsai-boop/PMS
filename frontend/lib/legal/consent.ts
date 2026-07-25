export const CONSENT_VERSION = '2026-07-25'

export const CONSENT_STORAGE_KEY = 'legal_cookie_consent_v1'
const LEGACY_CONSENT_STORAGE_KEY = 'pms_cookie_consent'

export type ConsentCategories = {
  necessary: true
  analytics: boolean
  marketing: boolean
}

export type StoredConsent = {
  version: string
  categories: ConsentCategories
  updatedAt: string
}

export function getDefaultConsent(): StoredConsent {
  return {
    version: CONSENT_VERSION,
    categories: { necessary: true, analytics: false, marketing: false },
    updatedAt: new Date().toISOString(),
  }
}

export function readStoredConsent(): StoredConsent | null {
  if (typeof window === 'undefined') return null
  try {
    localStorage.removeItem(LEGACY_CONSENT_STORAGE_KEY)
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredConsent
    if (!parsed?.categories || parsed.version !== CONSENT_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

export function writeStoredConsent(categories: ConsentCategories): StoredConsent {
  const record: StoredConsent = {
    version: CONSENT_VERSION,
    categories: {
      necessary: true,
      analytics: Boolean(categories.analytics),
      marketing: Boolean(categories.marketing),
    },
    updatedAt: new Date().toISOString(),
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record))
    window.dispatchEvent(new CustomEvent('legal-consent-updated', { detail: record }))
  }
  return record
}

export function hasAnalyticsConsent(): boolean {
  return readStoredConsent()?.categories.analytics === true
}

export function hasMarketingConsent(): boolean {
  return readStoredConsent()?.categories.marketing === true
}

export function acceptAllConsent(): StoredConsent {
  return writeStoredConsent({ necessary: true, analytics: true, marketing: true })
}

export function rejectNonEssentialConsent(): StoredConsent {
  return writeStoredConsent({
    necessary: true,
    analytics: false,
    marketing: false,
  })
}

export function clearStoredConsent(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CONSENT_STORAGE_KEY)
  localStorage.removeItem(LEGACY_CONSENT_STORAGE_KEY)
  document.cookie = `${LEGACY_CONSENT_STORAGE_KEY}=;path=/;max-age=0;SameSite=Lax`
  window.dispatchEvent(new CustomEvent('legal-consent-updated'))
}

export function isCookieConsentPreviewMode(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('cookie_consent') === 'preview'
}

export const LEGAL_POLICY_VERSION = CONSENT_VERSION
