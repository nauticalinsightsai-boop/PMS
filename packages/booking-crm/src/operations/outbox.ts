export type OutboxStatus =
  | 'pending'
  | 'processing'
  | 'delivered'
  | 'failed'
  | 'dead_letter';

export type OutboxFailurePatch = {
  status: 'failed';
  attempts: number;
  last_error: string;
  next_attempt_at: string;
};

export type OutboxTerminalPatch = {
  status: 'dead_letter';
  attempts: number;
  last_error: string;
  next_attempt_at: null;
  delivered_at: null;
};

export function sanitizeDeliveryError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]')
    .replace(/\+?\d[\d\s().-]{7,}\d/g, '[redacted-phone]')
    .slice(0, 1000);
}

export function buildOutboxFailurePatch(input: {
  error: unknown;
  attempts: number;
  now?: Date;
}): OutboxFailurePatch {
  const attempts = Math.max(1, Math.floor(input.attempts));
  const now = input.now ?? new Date();
  const delayMinutes = Math.min(24 * 60, 2 ** Math.min(attempts, 10));
  return {
    status: 'failed',
    attempts,
    last_error: sanitizeDeliveryError(input.error),
    next_attempt_at: new Date(now.getTime() + delayMinutes * 60_000).toISOString(),
  };
}

export function buildOutboxDeliveredPatch(attempts: number, now = new Date()) {
  return {
    status: 'delivered' as const,
    attempts: Math.max(1, Math.floor(attempts)),
    last_error: null,
    next_attempt_at: null,
    delivered_at: now.toISOString(),
  };
}

export function buildOutboxTerminalPatch(input: {
  error: unknown;
  attempts: number;
}): OutboxTerminalPatch {
  return {
    status: 'dead_letter',
    attempts: Math.max(1, Math.floor(input.attempts)),
    last_error: sanitizeDeliveryError(input.error),
    next_attempt_at: null,
    delivered_at: null,
  };
}
