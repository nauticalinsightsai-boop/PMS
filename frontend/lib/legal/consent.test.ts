import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  acceptAllConsent,
  hasAnalyticsConsent,
  hasMarketingConsent,
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
});
