import type { EngagementBookingRow } from '@/lib/engagement/bookings';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/client';
import { insertFormSubmission } from '@/lib/interactions/service';

/**
 * Logs a confirmed engagement booking into `form_submissions` + optional Sheets sync.
 * Fire-and-forget from API routes; errors are logged only.
 * Dedupes by `metadata.booking_id` so Stripe webhook retries do not duplicate rows.
 */
export function logEngagementMeetingInteraction(row: EngagementBookingRow): void {
  void (async () => {
    if (!isSupabaseConfigured()) return;

    const supabase = getSupabaseAdmin();
    const { data: dup } = await supabase
      .from('form_submissions')
      .select('id')
      .eq('source', 'meeting_booking')
      .contains('metadata', { booking_id: row.id })
      .maybeSingle();

    if (dup) return;

    const meta: Record<string, unknown> = {
      booking_id: row.id,
      service_id: row.service_id,
      booking_date: row.booking_date,
      time_slot: row.time_slot,
      status: row.status,
      amount_cents: row.amount_cents,
    };
    if (row.metadata && typeof row.metadata === 'object') {
      meta.calendly = row.metadata;
    }

    const res = await insertFormSubmission({
      source: 'meeting_booking',
      subject: `Engagement booking — ${row.service_title}`,
      email: row.client_email.trim().toLowerCase(),
      payload: {
        client_name: row.client_name,
        role: row.role,
        project_stage: row.project_stage,
        budget_range: row.budget_range,
        duration: row.duration,
        final_price_display: row.final_price_display,
      },
      metadata: meta,
    });
    if (!res.ok) {
      console.error('[interactions] engagement bridge insert failed', res.error);
    } else if (res.sheetsError) {
      console.warn('[interactions] engagement booking Sheets sync failed', res.sheetsError);
    }
  })();
}
