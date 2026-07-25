import { describe, expect, it, vi } from 'vitest';
import {
  OperationsOutboxTerminalError,
  runOperationsOutboxWorker,
  validateOperationsProviderConfig,
  type OperationsOutboxRepository,
  type OperationsOutboxRow,
  type OutboxDeliveredPatch,
} from './outbox-worker';
import type {
  OutboxFailurePatch,
  OutboxTerminalPatch,
  OutboxStatus,
} from './outbox';

type StoredRow = Omit<OperationsOutboxRow, 'status'> & {
  status: OutboxStatus;
  nextAttemptAt: Date | null;
  lastError: string | null;
};

class InMemoryOutboxRepository implements OperationsOutboxRepository {
  constructor(
    readonly rows: StoredRow[],
    private readonly now: () => Date,
  ) {}

  async claimDue(limit: number): Promise<OperationsOutboxRow[]> {
    const due = this.rows
      .filter(
        (row) =>
          (row.status === 'pending' || row.status === 'failed') &&
          row.nextAttemptAt !== null &&
          row.nextAttemptAt.getTime() <= this.now().getTime(),
      )
      .sort(
        (a, b) =>
          a.nextAttemptAt!.getTime() - b.nextAttemptAt!.getTime() ||
          a.id.localeCompare(b.id),
      )
      .slice(0, limit);

    for (const row of due) {
      row.status = 'processing';
      row.attempts += 1;
    }
    return due.map((row) => ({
      ...row,
      status: 'processing' as const,
    }));
  }

  async markDelivered(
    id: string,
    patch: OutboxDeliveredPatch,
  ): Promise<void> {
    const row = this.required(id);
    row.status = patch.status;
    row.attempts = patch.attempts;
    row.nextAttemptAt = null;
    row.lastError = patch.last_error;
  }

  async markFailed(id: string, patch: OutboxFailurePatch): Promise<void> {
    const row = this.required(id);
    row.status = patch.status;
    row.attempts = patch.attempts;
    row.nextAttemptAt = new Date(patch.next_attempt_at);
    row.lastError = patch.last_error;
  }

  async markDeadLetter(
    id: string,
    patch: OutboxTerminalPatch,
  ): Promise<void> {
    const row = this.required(id);
    row.status = patch.status;
    row.attempts = patch.attempts;
    row.nextAttemptAt = null;
    row.lastError = patch.last_error;
  }

  private required(id: string): StoredRow {
    const row = this.rows.find((candidate) => candidate.id === id);
    if (!row) throw new Error('missing_test_row');
    return row;
  }
}

const BOOKING_ID = '11111111-1111-4111-8111-111111111111';
const SUBMISSION_ID = '22222222-2222-4222-8222-222222222222';
const EVENT_ID = `cal_booking_${'a'.repeat(40)}`;

function row(
  input: Pick<
    StoredRow,
    | 'id'
    | 'aggregate_type'
    | 'aggregate_id'
    | 'destination'
    | 'event_type'
    | 'payload'
  > &
    Partial<
      Pick<StoredRow, 'status' | 'attempts' | 'nextAttemptAt' | 'lastError'>
    >,
): StoredRow {
  return {
    ...input,
    status: input.status ?? 'pending',
    attempts: input.attempts ?? 0,
    nextAttemptAt:
      input.nextAttemptAt ?? new Date('2026-07-25T10:00:00.000Z'),
    lastError: input.lastError ?? null,
  };
}

function destinationRows(): StoredRow[] {
  return [
    row({
      id: 'job-google-sheets',
      aggregate_type: 'form_submission',
      aggregate_id: SUBMISSION_ID,
      destination: 'google_sheets',
      event_type: 'lead_delivery',
      payload: { submission_id: SUBMISSION_ID },
    }),
    row({
      id: 'job-admin-email',
      aggregate_type: 'form_submission',
      aggregate_id: SUBMISSION_ID,
      destination: 'admin_email',
      event_type: 'lead_notification',
      payload: { submission_id: SUBMISSION_ID },
    }),
    row({
      id: 'job-ga4',
      aggregate_type: 'booking',
      aggregate_id: BOOKING_ID,
      destination: 'ga4_booking',
      event_type: 'booking_confirmed',
      payload: { booking_id: BOOKING_ID, event_id: EVENT_ID },
    }),
    row({
      id: 'job-meta',
      aggregate_type: 'booking',
      aggregate_id: BOOKING_ID,
      destination: 'meta_schedule',
      event_type: 'Schedule',
      payload: { booking_id: BOOKING_ID, event_id: EVENT_ID },
    }),
  ];
}

describe('operations outbox worker', () => {
  it('does not give the same due row to two concurrent claims and skips future jobs', async () => {
    const now = () => new Date('2026-07-25T10:00:00.000Z');
    const due = destinationRows()[0]!;
    const future = row({
      ...destinationRows()[1]!,
      id: 'job-future',
      nextAttemptAt: new Date('2026-07-25T10:05:00.000Z'),
    });
    const repository = new InMemoryOutboxRepository([due, future], now);

    const claims = await Promise.all([
      repository.claimDue(25),
      repository.claimDue(25),
    ]);
    const claimedIds = claims.flat().map((candidate) => candidate.id);

    expect(claimedIds).toEqual(['job-google-sheets']);
    expect(new Set(claimedIds).size).toBe(claimedIds.length);
    expect(future.status).toBe('pending');
  });

  it('reschedules a provider failure and a later success becomes delivered', async () => {
    let clock = new Date('2026-07-25T10:00:00.000Z');
    const now = () => new Date(clock);
    const job = destinationRows()[0]!;
    const repository = new InMemoryOutboxRepository([job], now);
    const dispatch = vi
      .fn()
      .mockRejectedValueOnce(new Error('google_sheets_http_503'))
      .mockResolvedValueOnce(undefined);

    expect(
      await runOperationsOutboxWorker({
        repository,
        dispatch,
        now,
      }),
    ).toMatchObject({ claimed: 1, failed: 1, delivered: 0 });
    expect(job.status).toBe('failed');
    expect(job.nextAttemptAt?.toISOString()).toBe(
      '2026-07-25T10:02:00.000Z',
    );

    clock = new Date('2026-07-25T10:01:59.000Z');
    expect(
      await runOperationsOutboxWorker({ repository, dispatch, now }),
    ).toMatchObject({ claimed: 0 });

    clock = new Date('2026-07-25T10:02:00.000Z');
    expect(
      await runOperationsOutboxWorker({ repository, dispatch, now }),
    ).toMatchObject({ claimed: 1, delivered: 1, failed: 0 });
    expect(job.status).toBe('delivered');
    expect(job.attempts).toBe(2);
    expect(dispatch).toHaveBeenCalledTimes(2);
  });

  it('delivers one unique job per destination only once across concurrent workers', async () => {
    const now = () => new Date('2026-07-25T10:00:00.000Z');
    const jobs = destinationRows();
    const repository = new InMemoryOutboxRepository(jobs, now);
    const dispatch = vi.fn().mockResolvedValue(undefined);

    await Promise.all([
      runOperationsOutboxWorker({ repository, dispatch, now }),
      runOperationsOutboxWorker({ repository, dispatch, now }),
    ]);
    await runOperationsOutboxWorker({ repository, dispatch, now });

    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(
      dispatch.mock.calls.map(([, parsed]) => parsed.destination).sort(),
    ).toEqual([
      'admin_email',
      'ga4_booking',
      'google_sheets',
      'meta_schedule',
    ]);
    expect(jobs.every((candidate) => candidate.status === 'delivered')).toBe(
      true,
    );
  });

  it('dead-letters malformed payloads without persisting or logging contact PII', async () => {
    const now = () => new Date('2026-07-25T10:00:00.000Z');
    const job = row({
      ...destinationRows()[0]!,
      payload: {
        submission_id: SUBMISSION_ID,
        email: 'candidate@example.com',
        phone: '+974 3365 2500',
      },
    });
    const repository = new InMemoryOutboxRepository([job], now);
    const logs: unknown[] = [];

    const result = await runOperationsOutboxWorker({
      repository,
      dispatch: async () => {
        throw new Error('should_not_dispatch');
      },
      now,
      logger: {
        warn(message, detail) {
          logs.push({ message, detail });
        },
      },
    });

    expect(result).toMatchObject({ claimed: 1, deadLettered: 1 });
    expect(job.status).toBe('dead_letter');
    expect(job.lastError).toBe('malformed_outbox_job');
    const serialized = JSON.stringify(logs);
    expect(serialized).not.toContain('candidate@example.com');
    expect(serialized).not.toContain('3365');
  });

  it('dead-letters explicit terminal errors and jobs at the attempt ceiling', async () => {
    const now = () => new Date('2026-07-25T10:00:00.000Z');
    const terminal = destinationRows()[0]!;
    const exhausted = row({
      ...destinationRows()[1]!,
      id: 'job-exhausted',
      attempts: 7,
    });
    const repository = new InMemoryOutboxRepository(
      [terminal, exhausted],
      now,
    );

    const result = await runOperationsOutboxWorker({
      repository,
      now,
      maxAttempts: 8,
      dispatch: async (claimed) => {
        if (claimed.id === terminal.id) {
          throw new OperationsOutboxTerminalError('source_row_not_found');
        }
        throw new Error('provider_http_503');
      },
    });

    expect(result).toMatchObject({ claimed: 2, deadLettered: 2 });
    expect(terminal.status).toBe('dead_letter');
    expect(exhausted.status).toBe('dead_letter');
  });
});

describe('operations provider configuration validation', () => {
  const allCapabilities = {
    googleSheetsConfigured: true,
    adminEmailConfigured: true,
    adminEmailRecipientConfigured: true,
  };
  const completeEnv = {
    GA4_MEASUREMENT_ID: 'G-ABC123XYZ',
    GA4_API_SECRET: 'ga4-secret',
    META_CAPI_ACCESS_TOKEN: 'meta-token',
    META_DATASET_ID: '1772869590548346',
    META_GRAPH_API_VERSION: 'v23.0',
  };

  it.each([
    'google_sheets',
    'admin_email',
    'ga4_booking',
    'meta_schedule',
  ] as const)('accepts complete configuration for %s', (destination) => {
    expect(
      validateOperationsProviderConfig(destination, {
        env: completeEnv,
        capabilities: allCapabilities,
      }),
    ).toEqual({ ok: true });
  });

  it('fails closed for absent or placeholder provider configuration', () => {
    expect(
      validateOperationsProviderConfig('google_sheets', {
        env: {},
        capabilities: {
          ...allCapabilities,
          googleSheetsConfigured: false,
        },
      }),
    ).toEqual({ ok: false, code: 'google_sheets_not_configured' });
    expect(
      validateOperationsProviderConfig('admin_email', {
        env: {},
        capabilities: {
          ...allCapabilities,
          adminEmailRecipientConfigured: false,
        },
      }),
    ).toEqual({
      ok: false,
      code: 'admin_email_recipient_not_configured',
    });
    expect(
      validateOperationsProviderConfig('ga4_booking', {
        env: {
          GA4_MEASUREMENT_ID: 'G-ABC123XYZ',
          GA4_API_SECRET: 'placeholder',
        },
        capabilities: allCapabilities,
      }),
    ).toEqual({ ok: false, code: 'ga4_api_secret_not_configured' });
    expect(
      validateOperationsProviderConfig('meta_schedule', {
        env: {
          ...completeEnv,
          META_GRAPH_API_VERSION: 'latest',
        },
        capabilities: allCapabilities,
      }),
    ).toEqual({
      ok: false,
      code: 'meta_graph_version_not_configured',
    });
  });
});
