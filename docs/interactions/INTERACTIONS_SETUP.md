# Interactions pipeline setup

Public forms post to **`POST /api/interactions`** (no Formspree). The handler stores rows in Supabase, sends a non-blocking **admin email ping**, and optionally appends to **Google Sheets** in the background.

## Architecture

```
Public forms (contact, newsletter, /go/* portals, …)
    ↓ POST /api/interactions
Rate limit + honeypot + Zod validation
    ↓
Supabase INSERT → public.form_submissions
    ↓ fire-and-forget
Admin SMTP/Resend ping (skipped when metadata.booking_id is set)
    ↓ fire-and-forget
Google Sheets append (7 columns) + sync columns update
    ↓
Realtime Broadcast → Interaction Inbox + Sheets Records refetch
```

**Rules**

- Supabase is required; Sheets and admin email are optional.
- HTTP **201** never waits on Sheets or email delivery.
- Engagement bookings (`metadata.booking_id`) skip admin pings — booking flow has its own emails.

## Key files (PM Structure monorepo)

| File | Role |
|------|------|
| `dashboard/backend/app/api/interactions/route.ts` | Public `POST` + admin `GET` |
| `dashboard/backend/lib/interactions/service.ts` | `insertFormSubmission` |
| `dashboard/backend/lib/interactions/notify-admin-email.ts` | Admin lead ping |
| `dashboard/backend/lib/auth/send-email.ts` | SMTP (preferred) / Resend |
| `backend/app/api/interactions/route.ts` | Proxies `POST` → dashboard API |
| `scripts/dev-gateway.mjs` | Routes `/api/interactions` → dashboard API `:3002` |
| `frontend/lib/interactions/submit-public.ts` | Browser helper |

## Dashboard routes

| Page | URL |
|------|-----|
| Interaction Inbox | `/admin/dashboard/booking-crm/interactions/inbox` |
| Sheets Records | `/admin/dashboard/booking-crm/interactions/sheets` |

Legacy: `/admin/dashboard/members-revenue/interactions` → inbox.

## Environment variables

### Supabase (required)

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Run migrations including `20260610120000_form_submissions_sheets_sync.sql` for Sheets sync columns.

### SMTP admin pings

Uses `sendAuthEmail()` — **SMTP if `SMTP_HOST` is set**, else Resend.

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=you@gmail.com
SMTP_PASS=app-password
AUTH_EMAIL_FROM=you@gmail.com
AUTH_EMAIL_FROM_NAME=PM Structure
# RESEND_API_KEY=re_...   # fallback when SMTP_HOST unset
```

**Admin inbox resolution (first match wins):**

1. `INTERACTIONS_ADMIN_EMAIL`
2. `DISCOVERY_CALL_ADMIN_EMAIL`
3. `SMTP_USER`
4. `AUTH_EMAIL_FROM`

```env
INTERACTIONS_ADMIN_EMAIL=admin@example.com
```

**Email subject:** `[New lead] {form subject} — {submitter email}`

### Google Sheets (optional)

```env
# Local dev — path to service account JSON
GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH=/path/to/sa.json

# Production — base64-encoded JSON
GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64=

GOOGLE_SHEETS_SPREADSHEET_ID=
GOOGLE_SHEETS_RANGE=Submissions!A:G
GOOGLE_SHEETS_EDITOR_URL=https://docs.google.com/spreadsheets/d/…/edit
```

Share the spreadsheet with the service account `client_email` as **Editor**.

### Realtime inbox refresh (optional)

```env
INTERACTIONS_REALTIME_CHANNEL=<openssl rand -hex 24>
NEXT_PUBLIC_INTERACTIONS_REALTIME_CHANNEL=<same value>
```

## Google Sheet columns (row 1 headers)

| Col | Header | Value |
|-----|--------|-------|
| A | `created_at` | ISO timestamp |
| B | `source` | `contact`, `subscription`, … |
| C | `subject` | Form subject |
| D | `email` | Lowercased |
| E | `payload_json` | `JSON.stringify(payload)` |
| F | `metadata_json` | `JSON.stringify(metadata)` |
| G | `submission_id` | Supabase UUID |

## Submission sources

| `source` | Label | Examples |
|----------|-------|----------|
| `contact` | Contact | `/contact`, channel forms |
| `subscription` | Subscription | Footer newsletter |
| `meeting_booking` | Meeting / booking | `/go/*` portals, engagement Stripe |
| `documentation_request` | Documentation | Course enrollment, brief modals |

## Forms wired in this repo

- `frontend/lib/interactions/submit-public.ts` — shared client helper
- `frontend/components/channel-landing/ChannelLandingPublicView.tsx`
- `frontend/components/channel-landing/portal/ChannelPortalBookingForm.tsx`
- `frontend/services/interactions.ts`

Extend with the same helper for additional surfaces (footer subscribe, contact page, etc.).

**Not interactions:** Stripe engagement bookings use `/api/engagement/bookings/*` and the engagement bridge (`logEngagementMeetingInteraction`).

## Smoke test (local)

1. `npm run dev` — gateway at `http://localhost:3000`
2. Submit a test via footer newsletter or contact form
3. Check **Interaction Inbox** — new row, Sheets badge Pending → Synced
4. Check Gmail/admin inbox for `[New lead] …` ping
5. Check Google Sheet for new row (when configured)

## Production checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` on dashboard API service
- [ ] `SMTP_*` or `RESEND_API_KEY` + `INTERACTIONS_ADMIN_EMAIL`
- [ ] `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64` + `GOOGLE_SHEETS_SPREADSHEET_ID`
- [ ] `DASHBOARD_BACKEND_URL` on marketing API (if split deploy)
- [ ] Migrations applied (`form_submissions` sync columns)
- [ ] `INTERACTIONS_REALTIME_CHANNEL` set (optional live inbox)

## Do not

- Re-add Formspree or dual-write to external form SaaS unless explicitly requested.
- Block the public `201` response on Sheets or email failures.
