import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth/api-login-config', () => ({
  isApiLoginEnabled: () => true,
}));

vi.mock('@/lib/auth/dashboard-api-headers', () => ({
  getDashboardApiHeaders: () => ({}),
}));

vi.mock('@/lib/base-path', () => ({
  withBasePath: (path: string) => `/admin${path}`,
}));

import { WebsiteDataService } from './WebsiteDataService';

function failedResponse(
  status: number,
  payload: unknown,
  headers: Record<string, string> = {},
) {
  return {
    ok: false,
    status,
    headers: new Headers(headers),
    json: vi.fn().mockResolvedValue(payload),
  } as unknown as Response;
}

describe('WebsiteDataService Item07 error-code observability', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  it.each(['second_table_hash_mismatch', 'item07_body_hash_mismatch'])(
    'preserves safe server code %s without changing the preview request',
    async (code) => {
      fetchMock.mockResolvedValueOnce(failedResponse(409, { ok: false, code }));

      await expect(WebsiteDataService.item07FirstTable('preview')).rejects.toThrow(
        `CMS API error (409): ${code}`,
      );

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith('/admin/api/cms/newsletter-first-table', {
        method: 'POST',
        body: JSON.stringify({ action: 'preview' }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
    },
  );

  it.each([
    ['missing', { error: 'raw provider error', body: '<table>secret</table>' }],
    ['unsafe characters', { code: 'item07 body mismatch', error: 'person@example.com' }],
    ['uppercase', { code: 'ITEM07_BODY_HASH_MISMATCH', record: 'post-secret' }],
    ['oversized', { code: `a${'b'.repeat(64)}`, token: 'credential-secret' }],
    ['non-string', { code: { nested: 'item07_body_hash_mismatch' }, email: 'person@example.com' }],
  ])('uses the generic fallback for %s code data and echoes no response fields', async (_label, payload) => {
    fetchMock.mockResolvedValueOnce(failedResponse(409, payload));

    let message = '';
    try {
      await WebsiteDataService.item07FirstTable('preview');
    } catch (error) {
      message = error instanceof Error ? error.message : String(error);
    }

    expect(message).toBe('CMS API error (409)');
    expect(message).not.toMatch(/provider|table|secret|@|post-|credential|nested/i);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('binds the safe leaf to the server request id from body and headers', async () => {
    const requestId = '7dc6e64b-8c23-4ad2-86bc-7fb32d9bb589';
    fetchMock.mockResolvedValueOnce(failedResponse(
      409,
      { ok: false, code: 'second_table_hash_mismatch', requestId },
      {
        'x-pms-error-code': 'second_table_hash_mismatch',
        'x-pms-request-id': requestId,
      },
    ));

    await expect(WebsiteDataService.item07FirstTable('preview')).rejects.toThrow(
      `CMS API error (409): second_table_hash_mismatch [request ${requestId}]`,
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('uses safe response headers when an intermediary removes the JSON body', async () => {
    const requestId = '42510b19-02b9-49f0-8784-d09f03a089ae';
    fetchMock.mockResolvedValueOnce(failedResponse(
      409,
      {},
      {
        'x-pms-error-code': 'item07_body_hash_mismatch',
        'x-pms-request-id': requestId,
      },
    ));

    await expect(WebsiteDataService.item07FirstTable('preview')).rejects.toThrow(
      `CMS API error (409): item07_body_hash_mismatch [request ${requestId}]`,
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('rejects unsafe leaf and correlation fields without echo or retry', async () => {
    fetchMock.mockResolvedValueOnce(failedResponse(
      409,
      { code: 'item07 body mismatch', requestId: 'person@example.com', body: '<table>secret</table>' },
      {
        'x-pms-error-code': 'ITEM07_BODY_HASH_MISMATCH',
        'x-pms-request-id': 'credential-secret',
      },
    ));

    let message = '';
    try {
      await WebsiteDataService.item07FirstTable('preview');
    } catch (error) {
      message = error instanceof Error ? error.message : String(error);
    }
    expect(message).toBe('CMS API error (409)');
    expect(message).not.toMatch(/person|@|table|secret|credential|mismatch/i);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
