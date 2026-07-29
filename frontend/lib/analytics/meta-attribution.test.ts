import { beforeEach, describe, expect, it, vi } from 'vitest';

const consent = vi.hoisted(() => ({ marketing: true }));

vi.mock('@/lib/legal/consent', () => ({
  hasMarketingConsent: () => consent.marketing,
}));
vi.mock('@/lib/analytics/meta-config', () => ({
  getMetaPixelId: () => 'test-pixel',
  isMetaPixelConfigured: () => true,
}));

import {
  buildMetaEventSourceUrl,
  META_ATTRIBUTION_VALUE_MAX_LENGTH,
  sanitizeMetaAttribution,
} from './meta-attribution';
import { trackMetaViewContent } from './meta-browser';

describe('Meta attribution allowlist', () => {
  beforeEach(() => {
    consent.marketing = true;
    vi.stubGlobal('window', {
      location: {
        origin: 'https://pmstructure.com',
        pathname: '/certifications/pmp',
        search:
          '?utm_term=term&utm_source=%20instagram%20&qa_noise=drop&utm_medium=paid_social&utm_campaign=gcc&utm_content=card&fbclid=drop&email=drop',
      },
      fbq: vi.fn(),
    });
    vi.stubGlobal('document', { cookie: '' });
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 200 })));
  });

  it('keeps only bounded nonempty UTM values in deterministic order', () => {
    const long = `  ${'x'.repeat(META_ATTRIBUTION_VALUE_MAX_LENGTH + 20)}  `;
    expect(
      sanitizeMetaAttribution(
        `qa_noise=drop&utm_term=${encodeURIComponent(long)}&utm_source=%20instagram%20&utm_medium=&gclid=drop`,
      ),
    ).toEqual({
      utm_source: 'instagram',
      utm_term: 'x'.repeat(META_ATTRIBUTION_VALUE_MAX_LENGTH),
    });
    expect(
      buildMetaEventSourceUrl(
        'https://pmstructure.com',
        '/certifications/pmp',
        '?utm_term=term&utm_content=card&utm_source=instagram&fbclid=drop',
      ),
    ).toBe(
      'https://pmstructure.com/certifications/pmp?utm_source=instagram&utm_content=card&utm_term=term',
    );
  });

  it('uses one event id and the same allowlisted attribution for Pixel and CAPI', async () => {
    const eventId = trackMetaViewContent(
      { content_name: 'PMP', content_type: 'certification' },
      'view_opaque',
    );
    expect(eventId).toBe('view_opaque');
    expect(window.fbq).toHaveBeenCalledTimes(1);
    const pixelData = (window.fbq as ReturnType<typeof vi.fn>).mock.calls[0][2];
    expect(pixelData).toMatchObject({
      utm_source: 'instagram',
      utm_medium: 'paid_social',
      utm_campaign: 'gcc',
      utm_content: 'card',
      utm_term: 'term',
    });
    expect(pixelData).not.toHaveProperty('qa_noise');
    expect(pixelData).not.toHaveProperty('fbclid');
    expect(pixelData).not.toHaveProperty('email');

    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const init = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][1] as RequestInit;
    const gateway = JSON.parse(String(init.body));
    expect(gateway.event_id).toBe('view_opaque');
    expect(gateway.custom_data).toEqual(pixelData);
    expect(gateway.event_source_url).toBe(
      'https://pmstructure.com/certifications/pmp?utm_source=instagram&utm_medium=paid_social&utm_campaign=gcc&utm_content=card&utm_term=term',
    );
  });

  it('emits neither browser nor gateway event without marketing consent', () => {
    consent.marketing = false;
    expect(trackMetaViewContent({ content_name: 'PMP' }, 'view_denied')).toBeNull();
    expect(window.fbq).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });
});
