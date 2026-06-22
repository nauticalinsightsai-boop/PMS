# SEO Remaining Closeout — Evidence (2026-06-22)

Agent session implementing `seo_remaining_closeout_c8c86d99` plan. Production base: `https://pmstructure.com`.

## Phase A — Automated verification

| Script | Result | Notes |
|--------|--------|-------|
| `npm run seo:release-verify` | **PASS** | Build + seo:all + postbuild 2026-06-22 |
| `npm run seo:smoke-live` | **PASS** | 10/10 URLs — report `docs/reports/SMOKE_LIVE_2026-06-22.md` |
| `npm run audit:weekly-seo-health` | **PASS** | Sitemap `<loc>` hygiene fix; www Circle community documented as known exception |
| `npm run seo:audit-crawl-indexation` | **PASS** | Priority indexable URLs OK |
| `npm run seo:audit-redirects` | **PASS** | Legacy paths OK; www Circle community documented as known infra exception |
| `npm run seo:audit-on-page-seo` | **PASS** | Duplicate PMP 2026 titles fixed; architecture-check updated |
| `npm run seo:audit-analytics` | **PASS** | Repo guards OK; live GA4 needs owner (OA-003) |

### Hub QA (CRAWL-T137 / T138)

| URL | HTTP | Scripts | Notes |
|-----|------|---------|-------|
| `/answers` | 200 | h1/metadata/internal-links OK | 36 answer pages indexed; not thin |
| `/topics` | 200 | topics-check OK | Links to `/topics/pmp-exam-2026` |

### OA-009 — Lighthouse / PSI

- Batch capture: `node scripts/seo/psi-batch-capture.mjs` → `docs/internal/evidence/psi-batch-summary-2026-06-22.json`
- **16/16 complete** (2026-06-22): mobile priority URLs + desktop `/`, `/certifications`, `/certifications/pmp` + legal terms
- Prior evidence retained: `lighthouse-home-final-mobile-2026-06-22.json`, `psi-agentic-3of3-2026-06-22.png`

### OA-012 — Forms smoke

Evidence: [`forms-smoke-live-2026-06-22.json`](./forms-smoke-live-2026-06-22.json)

| Form | HTTP | Result |
|------|------|--------|
| PMP roadmap | 201 | Stored (`971d9240-…`) after deploy `819fae3` |
| Waitlist | 201 | Stored (`31f9f2de-…`) |
| Newsletter | 201 | Stored (`bed08333-…`) |

**Fix:** Removed explicit `sheets_sync_attempts` insert for DBs without migration columns; restored missing PMP prerender imports (`PmpExam2026LiveBanner`, `FaqAnswer`). Railway deploy `819fae3` **SUCCESS** 2026-06-22.

**Note:** Google Sheets sync not configured on production (`sheetsSyncPending=false`). Owner can add Sheets env per `docs/interactions/INTERACTIONS_SETUP.md` for mirror append.

## Phase B — Website dev rows shipped

| Schedule date | Row | Status | Implementation |
|---------------|-----|--------|----------------|
| 2026-07-09 | Updated PMP exam live banner | **Done** | `PmpExam2026LiveBanner` on `/certifications/pmp`, `/pmp-exam-2026` cluster, `/topics/pmp-exam-2026` |
| 2026-07-14 | PMP metadata + schema | **Done** | Distinct phase-2 titles for `/topics/pmp-exam-2026` vs `/pmp-exam-2026` |
| 2026-08-14 | Learner story | **Done (placeholder)** | `PORTAL_SOCIAL_PROOF_PENDING_MESSAGE` — no fake testimonials (OA-011) |
| 2026-09-01 | Waitlist CTAs secondary pathways | **Done** | Compare page secondary waitlist block |
| 2026-09-09 | Funnel cleanup | **Done** | Banner + compare#secondary-waitlist + cert hub link |
| 2026-07-21 | Engineer FAQ | **Done** | `#pmp-engineer-faq` (`Pmp2026ScheduleSections`) |
| 2026-08-11 | Mock-tracking CTA | **Done** | `#pmp-mock-tracking-cta` + diagnostic GA4 event |
| 2026-08-18 | Trust FAQ | **Done** | `#pmp-trust-faq` section |
| 2026-09-03 | PMP landing objections | **Done** | `#pmp-considerations` on `/certifications/pmp` |
| 2026-09-12 | Site update post-review | **Blocked** | Sheikh 90-day decision |

Regional rows (OA-008): remain **Blocked** / cancelled in plan.

## Owner handoff (human-only)

### Mahaa — OA-001, OA-002, OA-003, OA-010, weekly dashboard

Follow [`GSC_GA4_OWNER_ACTIONS.md`](./GSC_GA4_OWNER_ACTIONS.md). Attach screenshots to `pmstructure-result-scan-links.csv` SCAN-004 (GA4) and SCAN-005 (GSC).

### Sheikh — OA-007, OA-011, OA-008

- **OA-007:** Legal sign-off in `pmstructure-qa-signoff-register.csv`
- **OA-011:** Testimonials remain withheld until written permission
- **OA-008:** Regional/GCC routes deferred (unblocks 5 schedule rows)

### Marketing schedule (74 Planned rows)

LinkedIn, X, email, internal ops — **owner content**, not dev. Copy for blocked Phase B FAQ/CTA rows should be added to `pmstructure-90-day-marketing-schedule.csv` before dev can ship.

## Mahaa audit Excel — Phase 1 Foundation mirror

Use these statuses when updating the external Excel (no `.xlsx` in repo):

| Category | Status | Date |
|----------|--------|------|
| Dev verification scripts | **Verified live** | 2026-06-22 |
| GSC resubmit + URL inspection | **Pending owner** | — |
| GA4 DebugView events | **Pending owner** | — |
| Full Screaming Frog export | **Pending owner** | OA-001 partial substitute attached |
| GBP / regional routes / Cloudflare CSP | **Deferred** | — |

## Success criteria snapshot

- [x] `seo:release-verify` + `seo:smoke-live` pass
- [x] `/answers` + `/topics` crawl registers updated (no longer Pending crawl)
- [x] Fresh PSI batch for priority URLs (16/16 — see summary JSON)
- [x] Dev Website schedule rows marked Done where implemented
- [x] Forms storage verified (OA-012, deploy `819fae3`)
- [ ] GSC/GA4 owner screenshots (Mahaa)

## Dev agent sign-off (2026-06-22)

All executable dev/agent items from `seo_remaining_closeout_c8c86d99` are **complete**. Commits: `66112e6` → `a9d1224`. Re-verified production smoke + forms **2026-06-22**. Mirror for Mahaa Excel: [`pmstructure-mahaa-audit-phase1-mirror.csv`](../pmstructure-mahaa-audit-phase1-mirror.csv).
