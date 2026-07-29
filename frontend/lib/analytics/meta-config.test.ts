import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getConfiguredCanonicalMetaOrigins,
  isCanonicalMetaBrowserOrigin,
  isMetaPixelConfigured,
} from './meta-config';

describe('Meta canonical browser origin', () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_META_PIXEL_ID;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_MARKETING_SITE_URL;
    vi.unstubAllGlobals();
  });

  function setWindowOrigin(origin: string) {
    vi.stubGlobal('window', { location: { origin } });
  }

  it('allows only an exact configured canonical or www public origin', () => {
    process.env.NEXT_PUBLIC_META_PIXEL_ID = 'test-pixel';
    process.env.NEXT_PUBLIC_SITE_URL = 'https://pmstructure.com';
    process.env.NEXT_PUBLIC_MARKETING_SITE_URL = 'https://www.pmstructure.com/';

    expect([...getConfiguredCanonicalMetaOrigins()]).toEqual([
      'https://pmstructure.com',
      'https://www.pmstructure.com',
    ]);
    setWindowOrigin('https://pmstructure.com');
    expect(isCanonicalMetaBrowserOrigin()).toBe(true);
    expect(isMetaPixelConfigured()).toBe(true);
    setWindowOrigin('https://www.pmstructure.com');
    expect(isCanonicalMetaBrowserOrigin()).toBe(true);
  });

  it.each([
    'http://localhost:3000',
    'http://127.0.0.1:3050',
    'http://[::1]:3050',
    'https://branch.localhost',
    'https://preview.example.test',
    'https://pms-preview.up.railway.app',
  ])('blocks noncanonical browser origin %s', (origin) => {
    process.env.NEXT_PUBLIC_META_PIXEL_ID = 'test-pixel';
    process.env.NEXT_PUBLIC_SITE_URL = 'https://pmstructure.com';
    setWindowOrigin(origin);
    expect(isCanonicalMetaBrowserOrigin()).toBe(false);
    expect(isMetaPixelConfigured()).toBe(false);
  });

  it('fails closed when canonical configuration is absent or malformed', () => {
    process.env.NEXT_PUBLIC_META_PIXEL_ID = 'test-pixel';
    setWindowOrigin('https://pmstructure.com');
    expect(isMetaPixelConfigured()).toBe(false);

    process.env.NEXT_PUBLIC_SITE_URL = 'not-a-url';
    expect(isMetaPixelConfigured()).toBe(false);

    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
    expect(isMetaPixelConfigured()).toBe(false);
  });

  it.each([
    'https://railway.app',
    'https://pms-preview.railway.app',
    'https://up.railway.app',
    'https://pms-preview.up.railway.app',
    'https://railway.internal',
    'https://pms.railway.internal',
  ])('rejects configured Railway nonproduction origin %s', (origin) => {
    process.env.NEXT_PUBLIC_META_PIXEL_ID = 'test-pixel';
    process.env.NEXT_PUBLIC_SITE_URL = origin;
    setWindowOrigin(origin);

    expect([...getConfiguredCanonicalMetaOrigins()]).toEqual([]);
    expect(isCanonicalMetaBrowserOrigin()).toBe(false);
    expect(isMetaPixelConfigured()).toBe(false);
  });
});
