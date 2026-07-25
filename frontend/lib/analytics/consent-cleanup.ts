'use client';

import { clearMarketingAttributionStorage } from '@/lib/analytics/funnel';
import { clearPendingMetaBrowserEvents } from '@/lib/analytics/meta-browser';
import { clearPersistedLeadTrackingState } from '@/lib/analytics/track-persisted-lead';
import { readStoredConsent } from '@/lib/legal/consent';

function expireCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;path=/;max-age=0;SameSite=Lax`;
}

function expireCookiesMatching(prefixes: readonly string[]): void {
  if (typeof document === 'undefined') return;
  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0]?.trim();
    if (name && prefixes.some((prefix) => name.startsWith(prefix))) {
      expireCookie(name);
    }
  }
}

/** Apply storage/queue cleanup immediately after consent is denied or withdrawn. */
export function applyConsentWithdrawalCleanup(): void {
  const categories = readStoredConsent()?.categories;

  if (!categories?.marketing) {
    clearMarketingAttributionStorage();
    clearPendingMetaBrowserEvents();
    expireCookie('_fbp');
    expireCookie('_fbc');
  }

  if (!categories?.analytics) {
    clearPersistedLeadTrackingState();
    expireCookiesMatching(['_ga', '_gid', '_gat', '_gac_']);
  }
}
