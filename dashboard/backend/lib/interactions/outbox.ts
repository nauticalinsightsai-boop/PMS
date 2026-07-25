import type { SupabaseClient } from '@supabase/supabase-js';

/** Enqueue only an opaque submission reference; contact PII stays in its source row. */
export async function enqueueInteractionOperations(
  supabase: SupabaseClient,
  submissionId: string,
  includeAdminEmail: boolean,
): Promise<void> {
  const jobs = [
    {
      aggregate_type: 'form_submission',
      aggregate_id: submissionId,
      destination: 'google_sheets',
      event_type: 'lead_delivery',
      payload: { submission_id: submissionId },
    },
    ...(includeAdminEmail
      ? [
          {
            aggregate_type: 'form_submission',
            aggregate_id: submissionId,
            destination: 'admin_email',
            event_type: 'lead_notification',
            payload: { submission_id: submissionId },
          },
        ]
      : []),
  ];
  try {
    await supabase.from('operations_outbox').upsert(jobs, {
      onConflict: 'aggregate_type,aggregate_id,destination,event_type',
      ignoreDuplicates: true,
    });
  } catch {
    // The authoritative lead row remains successful even if outbox storage is unavailable.
  }
}
