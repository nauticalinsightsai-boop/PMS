import { describe, expect, it, vi } from 'vitest';
import {
  handleOperationsOutboxTrigger,
  isOperationsOutboxCronSecretConfigured,
  parseOperationsOutboxBatchLimit,
} from './outbox-trigger';

const SECRET = 'outbox-cron-secret-at-least-32-chars-long';
const EMPTY_RESULT = {
  claimed: 0,
  delivered: 0,
  failed: 0,
  deadLettered: 0,
};

function request(
  authorization?: string,
  url = 'https://pmstructure.com/api/interactions/outbox',
) {
  return new Request(url, {
    method: 'POST',
    headers: authorization ? { Authorization: authorization } : {},
  });
}

describe('operations outbox cron trigger', () => {
  it('returns 503 without running when the server secret is missing or invalid', async () => {
    const run = vi.fn().mockResolvedValue(EMPTY_RESULT);

    for (const configuredSecret of [undefined, 'short', 'placeholder-secret-that-is-long-enough']) {
      const response = await handleOperationsOutboxTrigger(
        request(`Bearer ${SECRET}`),
        {
          configuredSecret,
          ready: true,
          run,
        },
      );
      expect(response.status).toBe(503);
      expect(response.headers.get('cache-control')).toBe('no-store');
    }
    expect(run).not.toHaveBeenCalled();
  });

  it('returns 401 without running when the bearer secret is missing or incorrect', async () => {
    const run = vi.fn().mockResolvedValue(EMPTY_RESULT);

    for (const authorization of [undefined, 'Basic abc', 'Bearer wrong']) {
      const response = await handleOperationsOutboxTrigger(
        request(authorization),
        {
          configuredSecret: SECRET,
          ready: true,
          run,
        },
      );
      expect(response.status).toBe(401);
      expect(response.headers.get('cache-control')).toBe('no-store');
    }
    expect(run).not.toHaveBeenCalled();
  });

  it('returns 503 without running when the service-role repository is unavailable', async () => {
    const run = vi.fn().mockResolvedValue(EMPTY_RESULT);
    const response = await handleOperationsOutboxTrigger(
      request(`Bearer ${SECRET}`),
      {
        configuredSecret: SECRET,
        ready: false,
        run,
      },
    );

    expect(response.status).toBe(503);
    expect(run).not.toHaveBeenCalled();
  });

  it('runs an authorized bounded batch and exposes counts only', async () => {
    const run = vi.fn().mockResolvedValue({
      claimed: 4,
      delivered: 3,
      failed: 1,
      deadLettered: 0,
    });
    const response = await handleOperationsOutboxTrigger(
      request(
        `Bearer ${SECRET}`,
        'https://pmstructure.com/api/interactions/outbox?limit=999',
      ),
      {
        configuredSecret: SECRET,
        ready: true,
        run,
      },
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(run).toHaveBeenCalledWith(50);
    expect(await response.json()).toEqual({
      ok: true,
      claimed: 4,
      delivered: 3,
      failed: 1,
      deadLettered: 0,
    });
  });

  it('bounds malformed, low, and high requested limits', () => {
    expect(
      parseOperationsOutboxBatchLimit(
        'https://pmstructure.com/api/interactions/outbox',
      ),
    ).toBe(25);
    expect(
      parseOperationsOutboxBatchLimit(
        'https://pmstructure.com/api/interactions/outbox?limit=nope',
      ),
    ).toBe(25);
    expect(
      parseOperationsOutboxBatchLimit(
        'https://pmstructure.com/api/interactions/outbox?limit=0',
      ),
    ).toBe(1);
    expect(
      parseOperationsOutboxBatchLimit(
        'https://pmstructure.com/api/interactions/outbox?limit=500',
      ),
    ).toBe(50);
  });

  it('requires a non-placeholder secret with adequate entropy length', () => {
    expect(isOperationsOutboxCronSecretConfigured(SECRET)).toBe(true);
    expect(isOperationsOutboxCronSecretConfigured('short')).toBe(false);
    expect(
      isOperationsOutboxCronSecretConfigured(
        'this-placeholder-secret-is-definitely-long-enough',
      ),
    ).toBe(false);
  });
});
