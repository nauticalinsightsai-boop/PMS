-- Prevent duplicate public lead rows when a client retries the same logical submission.
-- The random client key is stored in metadata; no contact data is used for deduplication.

create unique index if not exists idx_form_submissions_client_submission_id
  on public.form_submissions ((metadata ->> 'clientSubmissionId'))
  where coalesce(metadata ->> 'clientSubmissionId', '') <> '';
