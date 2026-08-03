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

function failedResponse(status: number, payload: unknown) {
  return {
    ok: false,
    status,
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
});
