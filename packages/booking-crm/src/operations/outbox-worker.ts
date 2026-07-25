import {
  buildOutboxDeliveredPatch,
  buildOutboxFailurePatch,
  buildOutboxTerminalPatch,
  type OutboxFailurePatch,
  type OutboxTerminalPatch,
} from './outbox';

export const OPERATIONS_OUTBOX_DESTINATIONS = [
  'ga4_booking',
  'meta_schedule',
  'google_sheets',
  'admin_email',
] as const;

export type OperationsOutboxDestination =
  (typeof OPERATIONS_OUTBOX_DESTINATIONS)[number];

export type OperationsOutboxRow = {
  id: string;
  aggregate_type: string;
  aggregate_id: string;
  destination: string;
  event_type: string;
  payload: unknown;
  status: 'processing';
  attempts: number;
};

export type ParsedOperationsOutboxJob =
  | {
      destination: 'google_sheets';
      submissionId: string;
    }
  | {
      destination: 'admin_email';
      submissionId: string;
    }
  | {
      destination: 'ga4_booking';
      bookingId: string;
      eventId: string;
    }
  | {
      destination: 'meta_schedule';
      bookingId: string;
      eventId: string;
    };

export type OutboxDeliveredPatch = ReturnType<
  typeof buildOutboxDeliveredPatch
>;

export type OperationsOutboxRepository = {
  claimDue(limit: number): Promise<OperationsOutboxRow[]>;
  markDelivered(id: string, patch: OutboxDeliveredPatch): Promise<void>;
  markFailed(id: string, patch: OutboxFailurePatch): Promise<void>;
  markDeadLetter(id: string, patch: OutboxTerminalPatch): Promise<void>;
};

export type OperationsOutboxDispatcher = (
  row: OperationsOutboxRow,
  job: ParsedOperationsOutboxJob,
) => Promise<void>;

export type OperationsOutboxLogger = {
  warn(message: string, detail: Record<string, unknown>): void;
};

export type OperationsOutboxWorkerResult = {
  claimed: number;
  delivered: number;
  failed: number;
  deadLettered: number;
};

export const DEFAULT_OPERATIONS_OUTBOX_BATCH_SIZE = 25;
export const MAX_OPERATIONS_OUTBOX_BATCH_SIZE = 50;
export const DEFAULT_OPERATIONS_OUTBOX_MAX_ATTEMPTS = 8;

const SAFE_OPAQUE_ID = /^[A-Za-z0-9._:-]{8,128}$/;
const BOOKING_EVENT_ID = /^cal_booking_[a-f0-9]{40}$/;

export class OperationsOutboxTerminalError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(code);
    this.name = 'OperationsOutboxTerminalError';
    this.code = code;
  }
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(
    value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.getPrototypeOf(value) === Object.prototype,
  );
}

function hasOnlyKeys(
  record: Record<string, unknown>,
  allowed: readonly string[],
): boolean {
  const allowedKeys = new Set(allowed);
  return Object.keys(record).every((key) => allowedKeys.has(key));
}

function safeOpaqueId(value: unknown): string | null {
  return typeof value === 'string' && SAFE_OPAQUE_ID.test(value)
    ? value
    : null;
}

function malformed(): never {
  throw new OperationsOutboxTerminalError('malformed_outbox_job');
}

/**
 * Accept only the opaque identifiers required by each provider. Extra fields
 * fail closed so contact details can never ride inside the outbox payload.
 */
export function parseOperationsOutboxJob(
  row: OperationsOutboxRow,
): ParsedOperationsOutboxJob {
  if (!isPlainRecord(row.payload)) malformed();
  const payload = row.payload;

  if (
    row.destination === 'google_sheets' ||
    row.destination === 'admin_email'
  ) {
    const expectedEvent =
      row.destination === 'google_sheets'
        ? 'lead_delivery'
        : 'lead_notification';
    if (
      row.aggregate_type !== 'form_submission' ||
      row.event_type !== expectedEvent ||
      !hasOnlyKeys(payload, ['submission_id'])
    ) {
      malformed();
    }
    const submissionId = safeOpaqueId(payload.submission_id);
    if (!submissionId || submissionId !== row.aggregate_id) malformed();
    return { destination: row.destination, submissionId };
  }

  if (
    row.destination === 'ga4_booking' ||
    row.destination === 'meta_schedule'
  ) {
    const expectedEvent =
      row.destination === 'ga4_booking' ? 'booking_confirmed' : 'Schedule';
    if (
      row.aggregate_type !== 'booking' ||
      row.event_type !== expectedEvent ||
      !hasOnlyKeys(payload, ['booking_id', 'event_id'])
    ) {
      malformed();
    }
    const bookingId = safeOpaqueId(payload.booking_id);
    const eventId =
      typeof payload.event_id === 'string' &&
      BOOKING_EVENT_ID.test(payload.event_id)
        ? payload.event_id
        : null;
    if (!bookingId || bookingId !== row.aggregate_id || !eventId) malformed();
    return { destination: row.destination, bookingId, eventId };
  }

  malformed();
}

function boundedInteger(
  value: number,
  fallback: number,
  maximum: number,
): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(maximum, Math.max(1, Math.floor(value)));
}

function safeFailureCode(error: unknown): string {
  if (error instanceof OperationsOutboxTerminalError) return error.code;
  if (error instanceof Error && /^[a-z0-9_:-]{1,120}$/i.test(error.message)) {
    return error.message;
  }
  return 'provider_delivery_failed';
}

export async function runOperationsOutboxWorker(input: {
  repository: OperationsOutboxRepository;
  dispatch: OperationsOutboxDispatcher;
  limit?: number;
  maxAttempts?: number;
  now?: () => Date;
  logger?: OperationsOutboxLogger;
}): Promise<OperationsOutboxWorkerResult> {
  const limit = boundedInteger(
    input.limit ?? DEFAULT_OPERATIONS_OUTBOX_BATCH_SIZE,
    DEFAULT_OPERATIONS_OUTBOX_BATCH_SIZE,
    MAX_OPERATIONS_OUTBOX_BATCH_SIZE,
  );
  const maxAttempts = boundedInteger(
    input.maxAttempts ?? DEFAULT_OPERATIONS_OUTBOX_MAX_ATTEMPTS,
    DEFAULT_OPERATIONS_OUTBOX_MAX_ATTEMPTS,
    100,
  );
  const now = input.now ?? (() => new Date());
  const rows = await input.repository.claimDue(limit);
  const result: OperationsOutboxWorkerResult = {
    claimed: rows.length,
    delivered: 0,
    failed: 0,
    deadLettered: 0,
  };

  for (const row of rows) {
    try {
      const parsed = parseOperationsOutboxJob(row);
      await input.dispatch(row, parsed);
      await input.repository.markDelivered(
        row.id,
        buildOutboxDeliveredPatch(row.attempts, now()),
      );
      result.delivered += 1;
    } catch (error) {
      const terminal =
        error instanceof OperationsOutboxTerminalError ||
        row.attempts >= maxAttempts;
      const code = safeFailureCode(error);
      input.logger?.warn('operations_outbox_delivery_failed', {
        destination: row.destination,
        code,
        terminal,
      });

      if (terminal) {
        await input.repository.markDeadLetter(
          row.id,
          buildOutboxTerminalPatch({ error: code, attempts: row.attempts }),
        );
        result.deadLettered += 1;
      } else {
        await input.repository.markFailed(
          row.id,
          buildOutboxFailurePatch({
            error,
            attempts: row.attempts,
            now: now(),
          }),
        );
        result.failed += 1;
      }
    }
  }

  return result;
}

type ProviderConfigEnv = Record<string, string | undefined>;

export type OperationsProviderCapabilities = {
  googleSheetsConfigured: boolean;
  adminEmailConfigured: boolean;
  adminEmailRecipientConfigured: boolean;
};

export type ProviderConfigurationResult =
  | { ok: true }
  | { ok: false; code: string };

function configuredValue(
  env: ProviderConfigEnv,
  name: string,
): string | null {
  const value = env[name]?.trim();
  return value && !value.toLowerCase().includes('placeholder') ? value : null;
}

export function validateOperationsProviderConfig(
  destination: OperationsOutboxDestination,
  input: {
    env?: ProviderConfigEnv;
    capabilities: OperationsProviderCapabilities;
  },
): ProviderConfigurationResult {
  const env = input.env ?? process.env;

  if (destination === 'google_sheets') {
    return input.capabilities.googleSheetsConfigured
      ? { ok: true }
      : { ok: false, code: 'google_sheets_not_configured' };
  }

  if (destination === 'admin_email') {
    if (!input.capabilities.adminEmailConfigured) {
      return { ok: false, code: 'admin_email_not_configured' };
    }
    return input.capabilities.adminEmailRecipientConfigured
      ? { ok: true }
      : { ok: false, code: 'admin_email_recipient_not_configured' };
  }

  if (destination === 'ga4_booking') {
    const measurementId =
      configuredValue(env, 'GA4_MEASUREMENT_ID') ??
      configuredValue(env, 'NEXT_PUBLIC_GA_MEASUREMENT_ID');
    if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) {
      return { ok: false, code: 'ga4_measurement_id_not_configured' };
    }
    return configuredValue(env, 'GA4_API_SECRET')
      ? { ok: true }
      : { ok: false, code: 'ga4_api_secret_not_configured' };
  }

  const datasetId = configuredValue(env, 'META_DATASET_ID');
  const graphVersion = configuredValue(env, 'META_GRAPH_API_VERSION');
  if (!configuredValue(env, 'META_CAPI_ACCESS_TOKEN')) {
    return { ok: false, code: 'meta_access_token_not_configured' };
  }
  if (!datasetId || !/^\d+$/.test(datasetId)) {
    return { ok: false, code: 'meta_dataset_id_not_configured' };
  }
  return graphVersion && /^v\d+\.\d+$/.test(graphVersion)
    ? { ok: true }
    : { ok: false, code: 'meta_graph_version_not_configured' };
}
