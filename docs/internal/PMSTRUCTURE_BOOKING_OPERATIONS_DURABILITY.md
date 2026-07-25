# PM Structure booking and operations durability

## Scope

This foundation makes Calendly booking state authoritative on the server and
keeps secondary delivery failures separate from the visitor's successful lead
or booking result.

### Booking lifecycle

- The browser creates a short-lived, opaque `bks_...` handoff record before it
  opens Calendly.
- Calendly sees that opaque ID in `utm_content`; contact details and raw ad
  click IDs are not placed in the Calendly URL.
- `POST /api/calendly/webhook` verifies the signature against the exact raw
  body before parsing JSON.
- `invitee.created` and `invitee.canceled` are stored through one atomic RPC.
- The raw-body event hash prevents webhook replay from creating another
  booking or conversion.
- Reschedules link the old and new invitee URIs and cancel the replaced row.
- GA4 `booking_confirmed` and Meta `Schedule` are queued only after an active
  booking is persisted and only when the corresponding consent exists.
- GA4 and Meta use the same stable conversion event ID. No contact PII is
  included in their event parameters.

### Lead operations

- Google Sheets and administrator email each receive a unique outbox job keyed
  to the persisted form submission.
- A provider failure records attempts, a redacted error code/message, and
  `next_attempt_at`.
- A service-role-only RPC atomically claims due rows with
  `FOR UPDATE SKIP LOCKED`, increments attempts and moves them to
  `processing`. Concurrent workers cannot claim the same row.
- The bounded retry worker handles `google_sheets`, `admin_email`,
  `ga4_booking`, and `meta_schedule`.
- A successful provider delivery becomes `delivered`. Retryable failures use
  exponential backoff; malformed jobs and jobs at the attempt ceiling become
  `dead_letter`.
- The public lead result remains successful after the Supabase insert even when
  Sheets or email delivery fails.
- Outbox payloads contain only the opaque submission or booking ID. Contact PII
  remains in its source table.

## Migration state

`supabase/migrations/20260725130000_booking_operations_outbox.sql` is added but
has **not** been applied. It creates:

- `calendly_booking_handoffs`
- `calendly_bookings`
- `calendly_webhook_events`
- `operations_outbox`
- service-role-only RPC `process_calendly_webhook`
- service-role-only RPC `claim_operations_outbox`

All four tables have RLS enabled and forced, no anonymous/authenticated policy,
and explicit service-role access only.

## Required Railway variables

Do not invent values. Configure these only from the owning provider:

- `CALENDLY_WEBHOOK_SIGNING_KEY` — Calendly webhook signing key
- `OPERATIONS_OUTBOX_CRON_SECRET` — random server-only bearer secret with at
  least 32 characters; never expose it through a `NEXT_PUBLIC_*` variable
- `GA4_API_SECRET` — GA4 Measurement Protocol API secret
- `GA4_MEASUREMENT_ID` — server-side measurement ID; the implementation may
  fall back to the existing `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `META_CAPI_ACCESS_TOKEN`
- `META_DATASET_ID`
- `META_GRAPH_API_VERSION` — pinned value such as the version already approved
  for the existing CAPI proxy
- Existing `SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL`
- Existing `SUPABASE_SERVICE_ROLE_KEY`
- Existing `NEXT_PUBLIC_SITE_URL` or `NEXT_PUBLIC_MARKETING_SITE_URL`

`CALENDLY_API_TOKEN` is not needed to verify deliveries. It is needed only if
the webhook subscription is provisioned through Calendly's API rather than its
owning UI/OAuth workflow.

## Operations-outbox scheduled trigger

The production trigger is:

```text
POST https://pmstructure.com/api/interactions/outbox?limit=25
Authorization: Bearer $OPERATIONS_OUTBOX_CRON_SECRET
```

The single-service production build rewrites this public route to the bundled
dashboard route at:

```text
/admin/api/interactions/outbox
```

Use the public `/api/interactions/outbox` URL for a Railway scheduled
invocation. A suitable command is:

```sh
curl --fail --silent --show-error \
  --request POST \
  --header "Authorization: Bearer $OPERATIONS_OUTBOX_CRON_SECRET" \
  "https://pmstructure.com/api/interactions/outbox?limit=25"
```

Do not echo the secret, request payloads, or provider responses in the cron
command. Missing/invalid server configuration returns `503`; a missing or
incorrect bearer value returns `401`. Every response uses
`Cache-Control: no-store`. The request limit is clamped to `1..50`.

## Retry and terminal-state semantics

1. Only `pending` or `failed` rows whose `next_attempt_at <= now()` are due.
2. The database claims rows in deterministic
   `next_attempt_at, created_at, id` order and moves them to `processing`.
3. A successful dispatch becomes `delivered` and cannot be claimed again.
4. A retryable failure records only a redacted operational error and schedules
   `2^attempts` minutes of backoff, capped at 24 hours.
5. The default attempt ceiling is eight. Jobs at the ceiling and malformed jobs
   become `dead_letter` with no future retry.
6. Outbox payloads contain only opaque source-row IDs plus the stable booking
   event ID. The worker rejects extra fields, so email, phone, names and raw
   tracking values cannot be carried or logged by the outbox.
7. Google Sheets checks the submission ID before appending, admin email uses a
   stable provider idempotency key, and GA4/Meta reuse the stable conversion
   event ID.

Provider validation is destination-specific:

- Google Sheets requires a valid service-account configuration and spreadsheet
  ID.
- Administrator email requires a configured Resend/SMTP transport and an
  administrator recipient.
- GA4 requires `GA4_MEASUREMENT_ID` (or the existing public measurement ID)
  and `GA4_API_SECRET`.
- Meta requires `META_CAPI_ACCESS_TOKEN`, a numeric `META_DATASET_ID`, and a
  pinned `META_GRAPH_API_VERSION` such as `v23.0`.

One destination being unavailable does not invalidate the persisted lead or
booking and does not stop other claimed jobs from being attempted.

## Provider-failure recovery drill

Run this only in a reviewed non-production environment or with an approved
test job:

1. Record the outbox row ID, destination, current attempts and status. Do not
   copy its source-row contact fields into the drill log.
2. Temporarily make that destination's test credential invalid, invoke the
   protected trigger once and verify the row becomes `failed`, attempts
   increments, `last_error` is redacted and `next_attempt_at` moves forward.
3. Invoke again before `next_attempt_at` and verify the row is not claimed.
4. Restore the valid provider configuration.
5. At or after `next_attempt_at`, invoke the trigger and verify the row becomes
   `delivered` exactly once in the provider.
6. For a `dead_letter` row, correct the root cause first. An operator may then
   explicitly move that one reviewed row to `failed`, reset
   `next_attempt_at = now()`, and invoke the trigger. Never bulk-reset terminal
   rows without reviewing their error codes.

## Deployment-owner actions not performed

1. Review and apply the migration.
2. Configure the real Railway variables above.
3. Deploy the reviewed code.
4. Create the Calendly webhook subscription for:
   - `invitee.created`
   - `invitee.canceled`
5. Point it to the deployed `/api/calendly/webhook`.
6. Generate and configure `OPERATIONS_OUTBOX_CRON_SECRET`.
7. Create the Railway scheduled invocation for
   `POST /api/interactions/outbox?limit=25`.
8. Validate one test booking, its cancellation, and a reschedule in provider
   dashboards before treating the conversion path as production-qualified.

No migration, Railway variable, Calendly subscription, email, lead, booking,
campaign, commit, push, deployment, or publication was performed in this
packet.
