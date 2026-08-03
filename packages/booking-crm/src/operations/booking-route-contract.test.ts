import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const route = readFileSync(
  new URL(
    '../../../../dashboard/backend/app/api/interactions/outbox/route.ts',
    import.meta.url,
  ),
  'utf8',
);

const worker = readFileSync(
  new URL(
    '../../../../dashboard/backend/lib/interactions/operations-outbox-worker.ts',
    import.meta.url,
  ),
  'utf8',
);

describe('Booking CRM operations route contract', () => {
  it('keeps GET and POST behind the same fail-closed trigger handler', () => {
    expect(route).toContain('const GET = handleOutboxRequest');
    expect(route).toContain('const POST = handleOutboxRequest');
    expect(route).toContain('configuredSecret: process.env.OPERATIONS_OUTBOX_CRON_SECRET');
    expect(route).toContain('ready: isSupabaseConfigured()');
  });

  it('delivers Meta Schedule only through the server outbox with a stable event id', () => {
    expect(worker).toContain('await sendMetaSchedule({');
    expect(worker).toContain("event_name: 'Schedule'");
    expect(worker).toContain('event_id: input.eventId');
  });
});
