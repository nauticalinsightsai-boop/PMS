import { createHash } from 'node:crypto';
import {
  OperationsOutboxTerminalError,
  runOperationsOutboxWorker,
  validateOperationsProviderConfig,
  type OperationsOutboxRepository,
  type OperationsOutboxRow,
  type ParsedOperationsOutboxJob,
} from '@pms/booking-crm/operations/outbox-worker';
import { isEmailConfigured } from '@/lib/auth/send-email';
import { isGoogleSheetsConfigured } from '@/lib/interactions/google-sheets';
import {
  resolveInteractionsAdminEmail,
  sendInteractionAdminEmail,
} from '@/lib/interactions/notify-admin-email';
import {
  syncRowToGoogleSheetsWithRetries,
  type SheetsSyncRow,
} from '@/lib/interactions/sheets-sync';
import { getSupabaseAdmin } from '@/lib/supabase/client';

type BookingRow = {
  id: string;
  handoff_session_id: string | null;
  conversion_event_id: string | null;
  created_at: string;
};

type HandoffRow = {
  session_id: string;
  analytics_client_id: string | null;
  channel: string | null;
  funnel_label: string | null;
};

type SubmissionRow = SheetsSyncRow & {
  sheets_synced_at: string | null;
};

function configuredValue(name: string): string | null {
  const value = process.env[name]?.trim();
  return value && !value.toLowerCase().includes('placeholder') ? value : null;
}

function safeEventSourceUrl(requestOrigin: string): string {
  for (const raw of [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_MARKETING_SITE_URL,
    requestOrigin,
  ]) {
    if (!raw?.trim()) continue;
    try {
      const url = new URL(raw);
      if (url.protocol === 'https:' || url.hostname === 'localhost') {
        return `${url.origin}/booking-confirmed`;
      }
    } catch {
      // Continue to the next bounded origin.
    }
  }
  throw new OperationsOutboxTerminalError('event_source_not_configured');
}

async function sendGa4Booking(input: {
  clientId: string;
  eventId: string;
  channel: string | null;
  funnelLabel: string | null;
}) {
  const measurementId =
    configuredValue('GA4_MEASUREMENT_ID') ??
    configuredValue('NEXT_PUBLIC_GA_MEASUREMENT_ID');
  const apiSecret = configuredValue('GA4_API_SECRET');
  if (!measurementId || !apiSecret) throw new Error('ga4_not_configured');

  const response = await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(
      measurementId,
    )}&api_secret=${encodeURIComponent(apiSecret)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: input.clientId,
        events: [
          {
            name: 'booking_confirmed',
            params: {
              event_id: input.eventId,
              booking_source: 'calendly',
              ...(input.channel ? { channel: input.channel } : {}),
              ...(input.funnelLabel
                ? { funnel_label: input.funnelLabel }
                : {}),
              engagement_time_msec: 1,
            },
          },
        ],
      }),
      cache: 'no-store',
    },
  );
  if (!response.ok) throw new Error(`ga4_http_${response.status}`);
}

async function sendMetaSchedule(input: {
  bookingSessionId: string;
  eventId: string;
  eventTime: string;
  eventSourceUrl: string;
  channel: string | null;
  funnelLabel: string | null;
}) {
  const accessToken = configuredValue('META_CAPI_ACCESS_TOKEN');
  const datasetId = configuredValue('META_DATASET_ID');
  const graphVersion = configuredValue('META_GRAPH_API_VERSION');
  if (!accessToken || !datasetId || !graphVersion) {
    throw new Error('meta_not_configured');
  }

  const externalId = createHash('sha256')
    .update(input.bookingSessionId, 'utf8')
    .digest('hex');
  const eventTime = Date.parse(input.eventTime);
  if (!Number.isFinite(eventTime)) {
    throw new OperationsOutboxTerminalError('booking_event_time_invalid');
  }

  const response = await fetch(
    `https://graph.facebook.com/${graphVersion}/${datasetId}/events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [
          {
            event_name: 'Schedule',
            event_time: Math.floor(eventTime / 1000),
            event_id: input.eventId,
            event_source_url: input.eventSourceUrl,
            action_source: 'website',
            user_data: { external_id: [externalId] },
            custom_data: {
              booking_source: 'calendly',
              ...(input.channel ? { channel: input.channel } : {}),
              ...(input.funnelLabel
                ? { funnel_label: input.funnelLabel }
                : {}),
            },
          },
        ],
      }),
      cache: 'no-store',
    },
  );
  if (!response.ok) throw new Error(`meta_http_${response.status}`);
}

function createRepository(): OperationsOutboxRepository {
  const supabase = getSupabaseAdmin();

  async function updateProcessingRow(
    id: string,
    patch: Record<string, unknown>,
  ): Promise<void> {
    const { error } = await supabase
      .from('operations_outbox')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('status', 'processing');
    if (error) throw new Error('operations_outbox_state_update_failed');
  }

  return {
    async claimDue(limit) {
      const { data, error } = await supabase.rpc('claim_operations_outbox', {
        p_limit: limit,
      });
      if (error) throw new Error('operations_outbox_claim_failed');
      return (Array.isArray(data) ? data : []) as OperationsOutboxRow[];
    },
    markDelivered: updateProcessingRow,
    markFailed: updateProcessingRow,
    markDeadLetter: updateProcessingRow,
  };
}

async function getSubmission(submissionId: string): Promise<SubmissionRow> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('form_submissions')
    .select(
      'id,created_at,source,subject,email,payload,metadata,sheets_synced_at',
    )
    .eq('id', submissionId)
    .maybeSingle();
  if (error) throw new Error('submission_lookup_failed');
  if (!data) {
    throw new OperationsOutboxTerminalError('submission_not_found');
  }
  return data as SubmissionRow;
}

async function getBookingContext(bookingId: string): Promise<{
  booking: BookingRow;
  handoff: HandoffRow;
}> {
  const supabase = getSupabaseAdmin();
  const { data: booking, error: bookingError } = await supabase
    .from('calendly_bookings')
    .select('id,handoff_session_id,conversion_event_id,created_at')
    .eq('id', bookingId)
    .maybeSingle();
  if (bookingError) throw new Error('booking_lookup_failed');
  if (
    !booking?.handoff_session_id ||
    !booking.conversion_event_id ||
    !booking.created_at
  ) {
    throw new OperationsOutboxTerminalError('booking_context_missing');
  }

  const { data: handoff, error: handoffError } = await supabase
    .from('calendly_booking_handoffs')
    .select('session_id,analytics_client_id,channel,funnel_label')
    .eq('session_id', booking.handoff_session_id)
    .maybeSingle();
  if (handoffError) throw new Error('booking_handoff_lookup_failed');
  if (!handoff) {
    throw new OperationsOutboxTerminalError('booking_handoff_missing');
  }

  return {
    booking: booking as BookingRow,
    handoff: handoff as HandoffRow,
  };
}

async function dispatchJob(
  row: OperationsOutboxRow,
  job: ParsedOperationsOutboxJob,
  requestOrigin: string,
): Promise<void> {
  const config = validateOperationsProviderConfig(job.destination, {
    capabilities: {
      googleSheetsConfigured: isGoogleSheetsConfigured(),
      adminEmailConfigured: isEmailConfigured(),
      adminEmailRecipientConfigured: Boolean(resolveInteractionsAdminEmail()),
    },
  });
  if (!config.ok) throw new Error(config.code);

  if (job.destination === 'google_sheets') {
    const submission = await getSubmission(job.submissionId);
    if (submission.sheets_synced_at) return;
    const sync = await syncRowToGoogleSheetsWithRetries(
      getSupabaseAdmin(),
      submission.id,
      submission,
    );
    if (!sync.synced) throw new Error('google_sheets_delivery_failed');
    return;
  }

  if (job.destination === 'admin_email') {
    const submission = await getSubmission(job.submissionId);
    const delivery = await sendInteractionAdminEmail({
      source: submission.source,
      subject: submission.subject,
      email: submission.email,
      metadata: submission.metadata,
      idempotencyKey: `interaction-admin:${submission.id}`,
    });
    if (!delivery.delivered) throw new Error(delivery.error);
    return;
  }

  const { booking, handoff } = await getBookingContext(job.bookingId);
  if (booking.conversion_event_id !== job.eventId) {
    throw new OperationsOutboxTerminalError('booking_event_id_mismatch');
  }

  if (job.destination === 'ga4_booking') {
    if (!handoff.analytics_client_id) {
      throw new OperationsOutboxTerminalError('ga4_client_id_unavailable');
    }
    await sendGa4Booking({
      clientId: handoff.analytics_client_id,
      eventId: job.eventId,
      channel: handoff.channel,
      funnelLabel: handoff.funnel_label,
    });
    return;
  }

  await sendMetaSchedule({
    bookingSessionId: handoff.session_id,
    eventId: job.eventId,
    eventTime: booking.created_at,
    eventSourceUrl: safeEventSourceUrl(requestOrigin),
    channel: handoff.channel,
    funnelLabel: handoff.funnel_label,
  });
}

export async function runOperationsOutboxRetryWorker(input: {
  limit: number;
  requestOrigin: string;
}) {
  return runOperationsOutboxWorker({
    repository: createRepository(),
    limit: input.limit,
    dispatch: (row, job) => dispatchJob(row, job, input.requestOrigin),
    logger: {
      warn(message, detail) {
        console.warn(`[operations-outbox] ${message}`, detail);
      },
    },
  });
}
