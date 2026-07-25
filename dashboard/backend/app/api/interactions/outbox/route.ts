import { handleOperationsOutboxTrigger } from '@pms/booking-crm/operations/outbox-trigger';
import { runOperationsOutboxRetryWorker } from '@/lib/interactions/operations-outbox-worker';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
  return handleOperationsOutboxTrigger(request, {
    configuredSecret: process.env.OPERATIONS_OUTBOX_CRON_SECRET,
    ready: isSupabaseConfigured(),
    run: (limit) =>
      runOperationsOutboxRetryWorker({
        limit,
        requestOrigin: new URL(request.url).origin,
      }),
  });
}
