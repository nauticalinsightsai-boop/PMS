import { timingSafeEqual } from 'node:crypto';
import {
  DEFAULT_OPERATIONS_OUTBOX_BATCH_SIZE,
  MAX_OPERATIONS_OUTBOX_BATCH_SIZE,
  type OperationsOutboxWorkerResult,
} from './outbox-worker';

const MIN_CRON_SECRET_LENGTH = 32;

function noStoreJson(body: Record<string, unknown>, status: number): Response {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
    },
  });
}

export function isOperationsOutboxCronSecretConfigured(
  secret: string | undefined,
): boolean {
  const value = secret?.trim();
  return Boolean(
    value &&
      value.length >= MIN_CRON_SECRET_LENGTH &&
      !value.toLowerCase().includes('placeholder'),
  );
}

function authorizedBearer(header: string | null, secret: string): boolean {
  if (!header?.startsWith('Bearer ')) return false;
  const candidate = header.slice('Bearer '.length).trim();
  const expected = Buffer.from(secret, 'utf8');
  const received = Buffer.from(candidate, 'utf8');
  return (
    received.length === expected.length && timingSafeEqual(received, expected)
  );
}

export function parseOperationsOutboxBatchLimit(url: string): number {
  const raw = new URL(url).searchParams.get('limit');
  if (!raw) return DEFAULT_OPERATIONS_OUTBOX_BATCH_SIZE;
  const value = Number(raw);
  if (!Number.isFinite(value)) return DEFAULT_OPERATIONS_OUTBOX_BATCH_SIZE;
  return Math.min(
    MAX_OPERATIONS_OUTBOX_BATCH_SIZE,
    Math.max(1, Math.floor(value)),
  );
}

export async function handleOperationsOutboxTrigger(
  request: Request,
  input: {
    configuredSecret: string | undefined;
    ready: boolean;
    run(limit: number): Promise<OperationsOutboxWorkerResult>;
  },
): Promise<Response> {
  if (!isOperationsOutboxCronSecretConfigured(input.configuredSecret)) {
    return noStoreJson(
      { ok: false, error: 'operations_outbox_cron_not_configured' },
      503,
    );
  }

  const secret = input.configuredSecret!.trim();
  if (!authorizedBearer(request.headers.get('authorization'), secret)) {
    return noStoreJson({ ok: false, error: 'unauthorized' }, 401);
  }

  if (!input.ready) {
    return noStoreJson(
      { ok: false, error: 'operations_outbox_unavailable' },
      503,
    );
  }

  try {
    const result = await input.run(parseOperationsOutboxBatchLimit(request.url));
    return noStoreJson({ ok: true, ...result }, 200);
  } catch {
    return noStoreJson(
      { ok: false, error: 'operations_outbox_worker_failed' },
      503,
    );
  }
}
