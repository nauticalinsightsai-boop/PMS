# Google Sheets setup (website leads)

The **Sheets Records** page (`/admin/dashboard/booking-crm/interactions/sheets`) is the dashboard mirror of your lead spreadsheet. Configure Google Sheets once on the **dashboard API** service; every public form then appends a row automatically.

## What syncs

All marketing forms use `POST /api/interactions` → Supabase `form_submissions` → background Google Sheets append:

- Contact, newsletter, waitlists
- PMP / certification roadmap forms (home, cert pages, popups)
- Register / join-waitlist modals
- Lead recovery bar and dialog
- `/go/*` channel landing forms
- Confirmed engagement bookings (`meeting_booking`)

Details (name, phone, page path, cert interest, etc.) live in column **payload_json**.

See also: [INTERACTIONS_SETUP.md](../interactions/INTERACTIONS_SETUP.md)

## 1. Create the spreadsheet

1. In Google Drive, create a spreadsheet (suggested title: **PMS structure Website**).
2. Add a tab named **`Submissions`**.
3. Row 1 headers (columns A–G):

| Col | Header |
|-----|--------|
| A | `created_at` |
| B | `source` |
| C | `subject` |
| D | `email` |
| E | `payload_json` |
| F | `metadata_json` |
| G | `submission_id` |

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
GOOGLE_SHEETS_RANGE=Submissions!A:G
GOOGLE_SHEETS_EDITOR_URL=https://docs.google.com/spreadsheets/d/your_spreadsheet_id/edit
```

Save the JSON key at `.secrets/google-sheets-sa.json` (gitignored).

### Production (Railway)

```env
GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64=<base64 of entire service account JSON>
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SHEETS_RANGE=Submissions!A:G
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
