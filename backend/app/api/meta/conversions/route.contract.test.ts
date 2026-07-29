import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

describe('Meta conversions gateway contract', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.META_CAPI_ACCESS_TOKEN;
    delete process.env.META_DATASET_ID;
    delete process.env.META_GRAPH_API_VERSION;
  });

  async function post(body: Record<string, unknown>) {
    process.env.META_CAPI_ACCESS_TOKEN = 'test-token';
    process.env.META_DATASET_ID = '123456';
    process.env.META_GRAPH_API_VERSION = 'v22.0';
    return POST(
      new Request('https://pmstructure.com/api/meta/conversions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          origin: 'https://pmstructure.com',
        },
        body: JSON.stringify(body),
      }),
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
});
