import { getAuthDb, insertAudit } from '@/lib/auth/auth-db';

export async function logInteractionAdminAction(params: {
  adminEmail: string;
  eventType:
    | 'interactions_list'
    | 'interactions_export'
    | 'interactions_sheets_retry'
    | 'interactions_sheets_read'
    | 'interactions_sheets_export';
  detail?: Record<string, unknown>;
  ipAddress?: string | null;
}): Promise<void> {
  const db = getAuthDb();
  if (!db) return;
  await insertAudit(db, {
    event_type: params.eventType,
    subject_email: params.adminEmail,
    detail: params.detail ?? null,
    ip_address: params.ipAddress ?? null,
  });
}
