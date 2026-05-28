export const INTERACTION_SOURCES = [
  'contact',
  'subscription',
  'meeting_booking',
  'documentation_request',
] as const;

export type InteractionSource = (typeof INTERACTION_SOURCES)[number];

export type FormSubmissionRow = {
  id: string;
  created_at: string;
  source: InteractionSource;
  subject: string;
  email: string;
  payload: Record<string, unknown>;
  metadata: Record<string, unknown>;
  sheets_synced_at: string | null;
  sheets_sync_error: string | null;
  sheets_sync_attempts: number;
};
