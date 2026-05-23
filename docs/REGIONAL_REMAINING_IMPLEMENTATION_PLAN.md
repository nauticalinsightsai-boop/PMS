# Regional Matrix — Remaining Implementation Plan

**Canonical spec:** [REGIONAL_AVAILABILITY_IMPLEMENTATION_PLAN.md](./REGIONAL_AVAILABILITY_IMPLEMENTATION_PLAN.md)

This document tracks follow-up work from the full regional matrix conversation. Code waves 2–4 were implemented in-repo; **Wave 1 ops** still require your Supabase credentials.

---

## Implementation status (2026-05-23)

| Wave | Code in repo | Your action |
|------|--------------|-------------|
| **1** Ops | `spot-check-india-pmp` script; migrate script lists all 4 SQL files | Add root `.env` with `DATABASE_URL`; run `npm run db:migrate` + `npm run sync:regional` |
| **2** Membership checkout | `hasMembership` on checkout API + `CheckoutForm` checkbox | Test checkout with membership checked |
| **3** UX polish | Compare + membership rows; Membership sample prices; FAQ; catalogue duration on Home/Certs | Browser verify |
| **4** Dashboard ops | Consultation queue + approve API; checkout allows approved mastery; profile region API + sync hooks | Configure Supabase; approve test consultation |
| **5** Docs/QA | `npm run qa:regional`; verify API logs to `verification_logs` | Manual browser QA; commit when ready |

---

## Wave 1 — Environment (you run locally)

```bash
cp .env.example .env
# Edit DATABASE_URL from Supabase → Settings → Database

npm run db:migrate
npm run sync:regional
npm run spot-check:india-pmp   # expects PASS: ₹44,999 + ₹35,999
```

**SQL Editor fallback:** run migrations in `supabase/migrations/` in filename order (4 regional files after initial schema).

**Stripe:** uncomment keys in `backend/.env.local`, restart backend.

**Dev fix if 500 on :3000 or `next build` ENOENT on pages:**

```powershell
Remove-Item -Recurse -Force frontend/.next
npm run dev:3000 -w @pms/frontend
```

**One-shot CLI verification (no browser):**

```bash
npm run verify:regional-dev
```

---

## Wave 2 — Membership checkout (done in code)

- `backend/lib/membership-pricing.ts` — 80% of `usdCents`
- `POST /api/checkout/create` — `hasMembership` body field
- `CheckoutForm` — checkbox + USD amount preview

---

## Wave 3 — UX polish (done in code)

- `Compare.tsx` — regional + member price cells; `PricingComplianceNote`
- `Membership.tsx` — member pricing samples (PMP, CAPM, PRINCE2)
- `Home.tsx` / `Certifications.tsx` — `getCertDurationLabel()`
- `FAQ.tsx` — regional pricing FAQ + compliance block

---

## Wave 4 — Dashboard (done in code)

- `GET /api/admin/consultations`, `PATCH .../approve` (dashboard-backend)
- `/dashboard/members-revenue/consultations` — approve UI
- `backend/lib/consultation-approval.ts` — mastery checkout after approval
- `POST /api/profile/region` (public + dashboard backend)
- `RegionContext` + dashboard account region save → profile upsert when `pms_supabase_user_id` set

---

## Wave 5 — QA checklist

| Region | Cert | Verify |
|--------|------|--------|
| global, europe, uk, gcc+AE, india, pakistan | PMP | F/P/M tiers, prices, CTAs |
| india | CAPM | Professional only |
| india | PMP Mastery | scholarship_unavailable |

```bash
npm run setup:env          # creates .env from example if missing
npm run verify:regional-dev  # spot-check + qa + frontend/backend probes
npm run qa:regional        # 55 offerings × regions automated check
npm run spot-check:checkout-api  # membership 80% on checkout API (backend required)
npm run test:regional
npm run build
```

---

## Out of scope (Phase 2)

- Dashboard matrix spreadsheet editor (T9.7)
- Normalized `regional_offering_rules` tables (JSON remains source of truth)

---

## Acceptance criteria

- [ ] `npm run db:migrate` succeeds (needs root `.env` with `DATABASE_URL` — operator step)
- [x] `npm run spot-check:india-pmp` → PASS (catalogue math)
- [x] `npm run qa:regional` → PASS (55 offerings × 6 regions)
- [x] `npm run test:regional` green (11 tests)
- [x] `npm run spot-check:checkout-api` → 89900 / 71920 when backend is up
- [x] `npm run verify:regional-dev` — CLI bundle (frontend probe when dev server running)
- [ ] Browser: India → PMP Professional → ₹44,999 + ₹35,999 membership (manual; use `dev:3000` after clearing `.next` if 500)
- [ ] Consultation approve → mastery checkout (needs Supabase + dashboard data)
- [x] `npm run build` — run after code changes to confirm monorepo green
