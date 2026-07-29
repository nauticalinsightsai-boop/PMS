import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const consent = vi.hoisted(() => ({ marketing: true }));
vi.mock('@/lib/legal/consent', () => ({
  hasMarketingConsent: () => consent.marketing,
}));

import { trackMetaViewContent } from './meta-browser';

describe('Meta browser host suppression', () => {
  beforeEach(() => {
    consent.marketing = true;
    process.env.NEXT_PUBLIC_META_PIXEL_ID = 'test-pixel';
    process.env.NEXT_PUBLIC_SITE_URL = 'https://pmstructure.com';
    vi.stubGlobal('document', { cookie: '' });
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 200 })));
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_META_PIXEL_ID;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_MARKETING_SITE_URL;
    vi.unstubAllGlobals();
  });

  function setWindow(origin: string) {
    vi.stubGlobal('window', {
      location: { origin, pathname: '/certifications/pmp', search: '' },
      fbq: vi.fn(),
    });
  }

  it('permits one browser and gateway leg on the exact canonical origin', async () => {
    setWindow('https://pmstructure.com');
    expect(
      trackMetaViewContent({ content_name: 'PMP' }, 'view_canonical'),
    ).toBe('view_canonical');
    expect(window.fbq).toHaveBeenCalledTimes(1);
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  it.each([
    'http://localhost:3000',
    'http://127.0.0.1:3050',
    'http://[::1]:3050',
    'https://branch.localhost',
    'https://preview.example.test',
    'https://pms-preview.up.railway.app',
  ])('suppresses browser and gateway transport on %s', (origin) => {
    setWindow(origin);
    expect(trackMetaViewContent({ content_name: 'PMP' }, 'view_blocked')).toBeNull();
    expect(window.fbq).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('suppresses both legs when canonical configuration is unavailable', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    setWindow('https://pmstructure.com');
    expect(trackMetaViewContent({ content_name: 'PMP' }, 'view_unconfigured')).toBeNull();
    expect(window.fbq).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });
});
