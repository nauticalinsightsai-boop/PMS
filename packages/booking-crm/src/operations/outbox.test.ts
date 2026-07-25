import { describe, expect, it } from 'vitest';
import { buildOutboxDeliveredPatch, buildOutboxFailurePatch } from './outbox';

describe('operations outbox retry state', () => {
  it.each(['google_sheets', 'admin_email'])(
    'keeps a successful lead independent from a failed %s delivery',
    (destination) => {
      const leadResult = { ok: true, status: 201, id: 'lead-1' };
      const retry = buildOutboxFailurePatch({
        error: new Error(
          `${destination} failed for candidate@example.com and +974 3365 2500`,
        ),
        attempts: 2,
        now: new Date('2026-07-25T10:00:00.000Z'),
      });

      expect(leadResult).toMatchObject({ ok: true, status: 201 });
      expect(retry.status).toBe('failed');
      expect(retry.attempts).toBe(2);
      expect(retry.next_attempt_at).toBe('2026-07-25T10:04:00.000Z');
      expect(retry.last_error).not.toContain('candidate@example.com');
      expect(retry.last_error).not.toContain('3365');
    },
  );

  it('marks a successful retry as delivered', () => {
    expect(
      buildOutboxDeliveredPatch(3, new Date('2026-07-25T11:00:00.000Z')),
    ).toEqual({
      status: 'delivered',
      attempts: 3,
      last_error: null,
      next_attempt_at: null,
      delivered_at: '2026-07-25T11:00:00.000Z',
    });
  });
});
