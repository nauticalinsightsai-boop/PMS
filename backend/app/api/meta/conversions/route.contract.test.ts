import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

describe('Meta conversions gateway contract', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.META_CAPI_ACCESS_TOKEN;
    delete process.env.META_DATASET_ID;
    delete process.env.META_GRAPH_API_VERSION;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_MARKETING_SITE_URL;
  });

  async function post(
    body: Record<string, unknown>,
    options: {
      requestUrl?: string;
      headers?: Record<string, string>;
      siteUrl?: string;
    } = {},
  ) {
    process.env.META_CAPI_ACCESS_TOKEN = 'test-token';
    process.env.META_DATASET_ID = '123456';
    process.env.META_GRAPH_API_VERSION = 'v22.0';
    process.env.NEXT_PUBLIC_SITE_URL =
      options.siteUrl ?? 'https://pmstructure.com';
    return POST(
      new Request(
        options.requestUrl ??
          'https://pmstructure.com/api/meta/conversions',
        {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          origin: 'https://pmstructure.com',
          ...options.headers,
        },
        body: JSON.stringify(body),
        },
      ),
    );
  }

  it('preserves sanctioned non-PII Lead context and removes PII/unknown keys', async () => {
    let forwarded: Record<string, unknown> | undefined;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init?: RequestInit) => {
        forwarded = JSON.parse(String(init?.body)) as Record<string, unknown>;
        return new Response(JSON.stringify({ events_received: 1 }), { status: 200 });
      }),
    );
    const response = await post({
      event_name: 'Lead',
      event_id: 'lead_submission-opaque',
      event_source_url: 'https://pmstructure.com/certifications/pmp',
      custom_data: {
        content_name: 'PMP Roadmap',
        content_category: 'lead',
        form_placement: 'homepage',
        email: 'redacted@example.invalid',
        phone: '000',
        full_name: 'redacted',
        external_id: 'prohibited',
        unexpected_context: 'drop',
      },
    });
    expect(response.status).toBe(200);
    const data = (
      forwarded?.data as Array<{ custom_data: Record<string, unknown> }>
    )[0]?.custom_data;
    expect(data).toEqual({
      content_name: 'PMP Roadmap',
      content_category: 'lead',
      form_placement: 'homepage',
    });
  });

  it('sanitizes attribution in custom data and the same-origin source URL', async () => {
    let forwarded: {
      data: Array<{
        event_source_url: string;
        custom_data: Record<string, unknown>;
      }>;
    } | undefined;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init?: RequestInit) => {
        forwarded = JSON.parse(String(init?.body));
        return new Response(JSON.stringify({ events_received: 1 }), { status: 200 });
      }),
    );
    const response = await post({
      event_name: 'ViewContent',
      event_id: 'view_opaque',
      event_source_url:
        'https://pmstructure.com/certifications/pmp?utm_term=term&utm_source=%20instagram%20&qa_noise=drop&utm_medium=paid_social&utm_campaign=gcc&utm_content=card&fbclid=drop#private',
      custom_data: {
        content_name: 'PMP',
        utm_term: ' term ',
        utm_source: ' instagram ',
        utm_medium: 'paid_social',
        utm_campaign: 'gcc',
        utm_content: 'card',
        qa_noise: 'drop',
        fbclid: 'drop',
        gclid: 'drop',
        email: 'redacted@example.invalid',
      },
    });
    expect(response.status).toBe(200);
    expect(forwarded?.data[0]).toEqual(expect.objectContaining({
      event_source_url:
        'https://pmstructure.com/certifications/pmp?utm_source=instagram&utm_medium=paid_social&utm_campaign=gcc&utm_content=card&utm_term=term',
      custom_data: {
        content_name: 'PMP',
        utm_term: 'term',
        utm_source: 'instagram',
        utm_medium: 'paid_social',
        utm_campaign: 'gcc',
        utm_content: 'card',
      },
    }));
  });

  it('rejects invalid event IDs without echoing identifiers', async () => {
    const response = await post({
      event_name: 'Lead',
      event_id: 'invalid id with spaces',
      event_source_url: 'https://pmstructure.com/',
    });
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ ok: false, error: 'event_id_invalid' });
  });

  it('rejects invalid source URLs without echoing identifiers', async () => {
    const response = await post({
      event_name: 'Lead',
      event_id: 'lead_safe',
      event_source_url: 'https://example.invalid/private-id',
    });
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      error: 'event_source_url_invalid',
    });
  });

  it('accepts the canonical public origin through Railway reverse-proxy headers', async () => {
    const provider = vi.fn(async () =>
      new Response(JSON.stringify({ events_received: 1 }), { status: 200 }),
    );
    vi.stubGlobal('fetch', provider);
    const response = await post(
      {
        event_name: 'ViewContent',
        event_id: 'view_proxy',
        event_source_url: 'https://pmstructure.com/certifications/pmp',
      },
      {
        requestUrl:
          'https://pms-production.up.railway.app/api/meta/conversions',
        headers: {
          'x-forwarded-host': 'pmstructure.com',
          'x-forwarded-proto': 'https',
        },
      },
    );
    expect(response.status).toBe(200);
    expect(provider).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['localhost', 'http://localhost:3000/api/meta/conversions', {}],
    ['loopback', 'http://127.0.0.1:3000/api/meta/conversions', {}],
    ['ipv6 loopback', 'http://[::1]:3000/api/meta/conversions', {}],
    ['preview', 'https://preview.example.test/api/meta/conversions', {}],
    [
      'spoofed proxy host',
      'https://pms-production.up.railway.app/api/meta/conversions',
      {
        'x-forwarded-host': 'preview.example.test',
        'x-forwarded-proto': 'https',
      },
    ],
  ])('blocks %s before provider transport', async (_label, requestUrl, headers) => {
    const provider = vi.fn();
    vi.stubGlobal('fetch', provider);
    const response = await post(
      {
        event_name: 'Lead',
        event_id: 'lead_private_identifier',
        event_source_url: 'https://pmstructure.com/contact',
      },
      {
        requestUrl,
        headers,
      },
    );
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      ok: false,
      skipped: true,
      reason: 'noncanonical_origin',
    });
    expect(provider).not.toHaveBeenCalled();
  });

  it('fails closed on absent or malformed canonical configuration', async () => {
    const provider = vi.fn();
    vi.stubGlobal('fetch', provider);
    const missing = await post(
      {
        event_name: 'Lead',
        event_id: 'lead_private_identifier',
        event_source_url: 'https://pmstructure.com/contact',
      },
      { siteUrl: '' },
    );
    expect(missing.status).toBe(503);
    expect(await missing.json()).toEqual({
      ok: false,
      skipped: true,
      reason: 'canonical_origin_unavailable',
    });

    const malformed = await post(
      {
        event_name: 'Lead',
        event_id: 'lead_private_identifier',
        event_source_url: 'https://pmstructure.com/contact',
      },
      { siteUrl: 'not-a-url' },
    );
    expect(malformed.status).toBe(503);
    expect(provider).not.toHaveBeenCalled();
  });

  it.each([
    'https://railway.app',
    'https://pms-preview.railway.app',
    'https://up.railway.app',
    'https://pms-preview.up.railway.app',
    'https://railway.internal',
    'https://pms.railway.internal',
  ])(
    'rejects configured Railway nonproduction origin %s before provider transport',
    async (origin) => {
      const provider = vi.fn();
      vi.stubGlobal('fetch', provider);
      const response = await post(
        {
          event_name: 'ViewContent',
          event_id: 'view_configured_preview',
          event_source_url: `${origin}/certifications/pmp`,
        },
        {
          requestUrl: `${origin}/api/meta/conversions`,
          headers: { origin },
          siteUrl: origin,
        },
      );

      expect(response.status).toBe(503);
      expect(await response.json()).toEqual({
        ok: false,
        skipped: true,
        reason: 'canonical_origin_unavailable',
      });
      expect(provider).not.toHaveBeenCalled();
    },
  );
});
