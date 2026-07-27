import { afterEach, describe, expect, it, vi } from 'vitest';

const trackPersistedLeadSuccess = vi.hoisted(() => vi.fn());
vi.mock('@/lib/analytics/track-persisted-lead', () => ({
  trackPersistedLeadSuccess,
}));

import { submitPublicInteraction } from '@/lib/interactions/submit-public';

afterEach(() => {
  vi.unstubAllGlobals();
  trackPersistedLeadSuccess.mockReset();
});

describe('submitPublicInteraction', () => {
  const response = (body: unknown, status = 201) =>
    new Response(typeof body === 'string' ? body : JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  const submit = (overrides: Record<string, unknown> = {}) =>
    submitPublicInteraction({
      source: 'contact',
      subject: 'PMP roadmap',
      email: 'candidate@example.com',
      clientSubmissionId: 'lead_test-1234567890',
      ...overrides,
    });

  it('tracks one new durable 201 and propagates the real submission id and optional form version', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      response({
        success: true,
        id: ' submission-123 ',
        sheetsSynced: false,
        sheetsSyncPending: false,
        sheetsWarning: 'secondary sink unavailable',
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await submit({ payload: { formVersion: ' p0.6.2 ' } });

    expect(result).toEqual({
      ok: true,
      submissionId: 'submission-123',
      clientSubmissionId: 'lead_test-1234567890',
      sheetsSynced: false,
      sheetsSyncPending: true,
      idempotentReplay: false,
    });
    expect(result.error).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(request.headers).toEqual({
      'Content-Type': 'application/json',
      'Idempotency-Key': 'lead_test-1234567890',
    });
    expect(JSON.parse(String(request.body))).toMatchObject({
      clientSubmissionId: 'lead_test-1234567890',
    });
    expect(trackPersistedLeadSuccess).toHaveBeenCalledTimes(1);
    expect(trackPersistedLeadSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        clientSubmissionId: 'lead_test-1234567890',
        submissionId: 'submission-123',
        formVersion: 'p0.6.2',
        source: 'contact',
      }),
    );
  });

  it.each([
    ['missing id', response({ success: true })],
    ['blank id', response({ success: true, id: '   ' })],
    ['non-201 with id', response({ success: true, id: 'submission-200' }, 200)],
    ['non-2xx with id', response({ error: 'invalid', id: 'submission-400' }, 400)],
    ['malformed JSON', response('{not-json', 201)],
  ])('suppresses conversion for %s', async (_label, mockedResponse) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockedResponse));

    const result = await submit();
    expect(trackPersistedLeadSuccess).not.toHaveBeenCalled();
    if (_label !== 'non-201 with id') expect(result.ok).toBe(false);
  });

  it('returns replay success with its parsed id but emits no duplicate conversion', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        response({
          success: true,
          id: 'submission-replay',
          idempotentReplay: true,
        }),
      ),
    );

    await expect(submit()).resolves.toMatchObject({
      ok: true,
      submissionId: 'submission-replay',
      idempotentReplay: true,
    });
    expect(trackPersistedLeadSuccess).not.toHaveBeenCalled();
  });

  it.each([
    ['website', { website: 'filled-by-bot' }],
    ['company', { company: 'filled-by-bot' }],
  ])('keeps %s honeypot UX safe without surfacing an id or conversion', async (_field, trap) => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        response({ success: true, id: 'submission-hidden' }),
      ),
    );

    await expect(submit(trap)).resolves.toMatchObject({
      ok: true,
      submissionId: undefined,
    });
    expect(trackPersistedLeadSuccess).not.toHaveBeenCalled();
  });

  it('suppresses conversion and returns a network error when fetch rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    await expect(submit()).resolves.toMatchObject({
      ok: false,
      error: 'Network error',
    });
    expect(trackPersistedLeadSuccess).not.toHaveBeenCalled();
  });
});
