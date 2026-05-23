import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';

/** Mastery checkout allowed when admin approved consultation for this email + offering. */
export async function isConsultationApproved(
  email: string,
  offeringId: string
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const normalized = email.trim().toLowerCase();
  const { data, error } = await supabaseAdmin
    .from('form_submissions')
    .select('id, metadata, payload')
    .eq('source', 'consultation')
    .ilike('email', normalized)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data?.length) return false;

  return data.some((row) => {
    const meta = row.metadata as { approvalStatus?: string } | null;
    const payload = row.payload as { offeringId?: string } | null;
    return meta?.approvalStatus === 'approved' && payload?.offeringId === offeringId;
  });
}
