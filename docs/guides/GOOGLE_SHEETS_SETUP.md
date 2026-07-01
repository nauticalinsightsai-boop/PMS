# Google Sheets setup (website leads)

The **Sheets Records** page (`/admin/dashboard/booking-crm/interactions/sheets`) is the dashboard mirror of your lead spreadsheet. Configure Google Sheets once on the **dashboard API** service; every public form then appends a row automatically.

## What syncs

All marketing forms use `POST /api/interactions` → Supabase `form_submissions` → background Google Sheets append:

- Contact, newsletter, waitlists
- **PMP / certification roadmap forms** (home, cert pages, popups) — `pmp_roadmap_lead` / `cert_roadmap_lead`
- **Consultation, scholarship, register modal, cert waitlists** — see `Certification Forms` tab
- Register / join-waitlist modals
- Lead recovery bar and dialog
- `/go/*` channel landing forms
- Confirmed engagement bookings (`meeting_booking`)

Details (name, phone, message, etc.) live in dedicated columns — **no JSON**.

### Sheet tabs (auto-updated on every form submit)

| Tab | Purpose |
|-----|---------|
| **Submissions** | Every form — human-readable columns (Date, Form Type, Email, Name, Phone, …) |
| **Records** | Same leads in a shorter layout for daily ops |
| **Certification Forms** | Certification / pathway leads only |
| **Payments** | Stripe purchases (separate layout) |

Row 1 on **Submissions** (columns A–W):

| Col | Header |
|-----|--------|
| A | Date |
| B | Form Type |
| C | Email |
| D | Full Name |
| E | Phone |
| F | Company |
| G | Role / Job Title |
| H | Certification |
| I | Tier / Package |
| J | Region |
| K | Page URL |
| L | Form / Placement |
| M | Subject line |
| N | Message / Notes |
| O | Years of Experience |
| P | Daily Study Time |
| Q | How they found us |
| R | UTM Source |
| S | UTM Medium |
| T | UTM Campaign |
| U | Referrer |
| V | Other form answers |
| W | Submission ID |

Do not edit row 1. Legacy rows with `payload_json` are still readable in the dashboard.

See also: [INTERACTIONS_SETUP.md](../interactions/INTERACTIONS_SETUP.md)

## 1. Create the spreadsheet

1. In Google Drive, create a spreadsheet (suggested title: **PMS structure Website**).
2. Add a tab named **`Submissions`**.
3. Row 1 headers: see table in section **What syncs** below (columns A–W).

Copy the spreadsheet ID from the URL:  
`https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

## 2. GCP service account

1. Google Cloud Console → create/select project → enable **Google Sheets API**.
2. IAM → Service accounts → create → download JSON key.
3. Note the **`client_email`** from the JSON.

## 3. Share the sheet

Share the spreadsheet with the service account **`client_email`** as **Editor**.

## 4. Environment variables

Set on **dashboard API** (local: repo root `.env.local`; production: Railway **PMS** service).

### Local development

```env
GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH=.secrets/google-sheets-sa.json
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SHEETS_RANGE=Submissions!A:W
GOOGLE_SHEETS_EDITOR_URL=https://docs.google.com/spreadsheets/d/your_spreadsheet_id/edit
```

Save the JSON key at `.secrets/google-sheets-sa.json` (gitignored).

### Production (Railway)

```env
GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64=<base64 of entire service account JSON>
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SHEETS_RANGE=Submissions!A:W
GOOGLE_SHEETS_EDITOR_URL=https://docs.google.com/spreadsheets/d/your_spreadsheet_id/edit
```

Encode locally (PowerShell):

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes(".secrets/google-sheets-sa.json"))
```

### Optional — instant dashboard refresh

```env
INTERACTIONS_REALTIME_CHANNEL=<openssl rand -hex 24>
NEXT_PUBLIC_INTERACTIONS_REALTIME_CHANNEL=<same value>
```

Restart `npm run dev` (or redeploy) after changing env.

## 5. Verify

1. Open **Sheets Records** — setup panel should show **Google Sheets connected** and **Open Google Sheet**.
2. Submit footer newsletter or contact form on the public site.
3. Check **Interaction Inbox** — Sheets badge Pending → Synced.
4. Confirm new row in the Google Sheet and on Sheets Records.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| “Showing Supabase rows” | `GOOGLE_SHEETS_*` not set on dashboard API; restart server |
| 502 / read error | Share sheet with service account; check spreadsheet ID and tab name `Submissions` |
| Row in Supabase but not sheet | Inbox → retry sync; check dashboard API logs for `[interactions] Google Sheets` |
| Old rows missing from sheet | Sync is append-only on submit; historical Supabase rows are not backfilled |

## Do not

- Put service account JSON in git or inline in `.env` (use path or base64 var).
- Block public form `201` responses on Sheets failures (by design, sync is background).
