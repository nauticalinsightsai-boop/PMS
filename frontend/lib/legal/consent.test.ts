import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  acceptAllConsent,
  getDefaultConsent,
  hasAnalyticsConsent,
  hasMarketingConsent,
  readStoredConsent,
  rejectNonEssentialConsent,
  writeStoredConsent,
} from '@/lib/legal/consent';

class MemoryStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

function installBrowserGlobals(): void {
  vi.stubGlobal('localStorage', new MemoryStorage());
  vi.stubGlobal('CustomEvent', class {
    constructor(
      public readonly type: string,
      public readonly init?: { detail?: unknown },
    ) {}
  });
  vi.stubGlobal('window', { dispatchEvent: vi.fn() });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('persisted consent categories', () => {
  it('defaults optional categories off when no record exists', () => {
    installBrowserGlobals();

    expect(getDefaultConsent().categories).toEqual({
      necessary: true,
      analytics: false,
      marketing: false,
    });
    expect(readStoredConsent()).toBeNull();
    expect(hasAnalyticsConsent()).toBe(false);
    expect(hasMarketingConsent()).toBe(false);
  });

  it('persists analytics and marketing independently', () => {
    installBrowserGlobals();
    writeStoredConsent({ necessary: true, analytics: true, marketing: false });

    expect(hasAnalyticsConsent()).toBe(true);
    expect(hasMarketingConsent()).toBe(false);
  });

  it('accepts or withdraws all optional categories explicitly', () => {
    installBrowserGlobals();
    acceptAllConsent();
    expect(hasAnalyticsConsent()).toBe(true);
    expect(hasMarketingConsent()).toBe(true);

    rejectNonEssentialConsent();
    expect(hasAnalyticsConsent()).toBe(false);
    expect(hasMarketingConsent()).toBe(false);
  });

  it.each([
    { necessary: true, analytics: 'true', marketing: false },
    { necessary: true, analytics: false, marketing: 1 },
    { necessary: false, analytics: false, marketing: false },
    { necessary: true, analytics: false },
  ])('rejects malformed same-version category records: %j', (categories) => {
    installBrowserGlobals();
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: CONSENT_VERSION,
        categories,
        updatedAt: new Date().toISOString(),
      }),
    );

    expect(readStoredConsent()).toBeNull();
    expect(hasAnalyticsConsent()).toBe(false);
    expect(hasMarketingConsent()).toBe(false);
  });

  it('fails closed when runtime callers pass truthy non-booleans', () => {
    installBrowserGlobals();
    writeStoredConsent({
      necessary: true,
      analytics: 'true',
      marketing: 1,
    } as never);

    expect(hasAnalyticsConsent()).toBe(false);
    expect(hasMarketingConsent()).toBe(false);
  });
});
