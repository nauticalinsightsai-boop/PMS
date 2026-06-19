export {
  INTERACTION_SOURCES,
  FORM_SOURCE_LABELS,
  submissionSourceLabel,
  type InteractionSource,
} from '@pms/booking-crm/form-submissions';

export type FormSubmissionRow = {
  id: string;
  created_at: string;
  source: import('@pms/booking-crm/form-submissions').InteractionSource;
  subject: string;
  email: string;
  payload: Record<string, unknown>;
  metadata: Record<string, unknown>;
  sheets_synced_at: string | null;
  sheets_sync_error: string | null;
  sheets_sync_attempts: number;
};
