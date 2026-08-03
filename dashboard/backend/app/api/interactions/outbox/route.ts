import { handleOperationsOutboxTrigger } from '@pms/booking-crm/operations/outbox-trigger';
import { runOperationsOutboxRetryWorker } from '@/lib/interactions/operations-outbox-worker';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handleOutboxRequest(request: Request): Promise<Response> {
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

/**
 * Vercel Cron invokes configured routes with GET. Keep POST for bounded manual
 * recovery calls; both methods retain the same bearer-secret and readiness
 * gates inside handleOperationsOutboxTrigger.
 */
export const GET = handleOutboxRequest;
export const POST = handleOutboxRequest;
