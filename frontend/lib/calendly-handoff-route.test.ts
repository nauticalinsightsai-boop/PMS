import { describe, expect, it } from 'vitest';
import { POST } from '../../backend/app/api/calendly/handoff/route';

describe('Calendly handoff POST transport guards', () => {
  it('rejects a non-JSON content type before any persistence work', async () => {
    const response = await POST(
      new Request('https://pmstructure.com/api/calendly/handoff', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          Origin: 'https://pmstructure.com',
        },
        body: '{}',
      }),
    );

    expect(response.status).toBe(415);
    expect(await response.json()).toEqual({
      ok: false,
      error: 'content_type_not_supported',
    });
  });

  it('retains same-origin enforcement for JSON requests', async () => {
    const response = await POST(
      new Request('https://pmstructure.com/api/calendly/handoff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'https://example.net',
          'Sec-Fetch-Site': 'cross-site',
        },
        body: '{}',
      }),
    );

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      ok: false,
      error: 'origin_not_allowed',
    });
  });
});
