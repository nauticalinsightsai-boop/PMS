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
  it('treats 201 plus sheetsWarning as one authoritative lead success', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          id: 'submission-123',
          sheetsSynced: false,
          sheetsSyncPending: false,
          sheetsWarning: 'secondary sink unavailable',
        }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await submitPublicInteraction({
      source: 'contact',
      subject: 'PMP roadmap',
      email: 'candidate@example.com',
      clientSubmissionId: 'lead_test-1234567890',
    });

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
        source: 'contact',
      }),
    );
  });

  it('does not track a conversion for an unsuccessful persistence response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: 'invalid' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    const result = await submitPublicInteraction({
      source: 'contact',
      subject: 'PMP roadmap',
      email: 'candidate@example.com',
      clientSubmissionId: 'lead_failed_123',
    });

    expect(result.ok).toBe(false);
    expect(trackPersistedLeadSuccess).not.toHaveBeenCalled();
  });
});
