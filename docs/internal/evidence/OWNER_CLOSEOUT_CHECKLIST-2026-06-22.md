# Owner closeout checklist (2026-06-22)

Dev/agent closeout for the SEO Remaining Implementation Plan is complete. These items require **human login, approval, or content creation**.

## Mahaa (OA-001, OA-002, OA-003, OA-010, dashboard)

**Start here:** [`GSC_GA4_OWNER_ACTIONS.md`](./GSC_GA4_OWNER_ACTIONS.md) — direct GSC/GA4 links, 9 inspection URLs, screenshot folders (`evidence/gsc/`, `evidence/ga4/`).

- [ ] **OA-002** Resubmit `https://pmstructure.com/sitemap.xml` in Google Search Console
- [ ] **OA-002** URL Inspection on 9 priority URLs (see `GSC_GA4_OWNER_ACTIONS.md`)
- [ ] **OA-002** Manual actions: confirm none; screenshot
- [ ] **OA-002** Inspect `/legal/terms` and `/legal/privacy` in GSC
- [ ] Attach GSC evidence → `pmstructure-result-scan-links.csv` **SCAN-005**
- [ ] **OA-003** GA4 DebugView: `page_view`, roadmap CTA, `form_start`, `generate_lead`, `booking_click`
- [ ] **OA-003** Tag Assistant: single GA4 config, no duplicates
- [ ] Attach GA4 evidence → **SCAN-004**
- [ ] **OA-001** Full Screaming Frog / Sitebulb export to repo
- [ ] Fill first row `pmstructure-weekly-seo-dashboard.csv` (real GSC/GA4 only)
- [ ] **OA-010** Digital PR list in `pmstructure-digital-pr-backlink-register.csv`
- [ ] Update `pmstructure-final-owner-action-list.csv` OA-002/OA-003 → **Verified** when screenshots attached

## Sheikh (OA-007, OA-011, OA-008)

- [ ] **OA-007** Legal sign-off PMP/PMI trademark + independent-prep disclaimers (`pmstructure-qa-signoff-register.csv`)
- [ ] **OA-011** Testimonials: keep removed OR approve with written permission
- [ ] **OA-008** Regional/GCC SEO: keep **deferred** OR approve (unblocks 5 Website schedule rows)
- [ ] **OA-004/OA-005** No action unless reversing keep `/pmp` + `/pmp-exam-2026` clusters (already Verified)

## Env (OA-012 full)

- [x] Form submissions persist to Supabase (verified 2026-06-22 after deploy `819fae3`)
- [x] Public URL prereqs for GSC/GA4: `npm run seo:owner-prereq-check` (14/14 pass 2026-06-22)
- [ ] Optional: Google Sheets env on Railway for mirror append (`INTERACTIONS_SETUP.md`)

## Marketing schedule

- [x] **Dev Website rows** — Done in repo (see `seo-remaining-closeout-2026-06-22.md`)
- [x] **Social/email copy drafts** — [`marketing-drafts/90-day-social-email-copy.md`](../marketing-drafts/90-day-social-email-copy.md)
- [ ] **Publish** LinkedIn/X/email on schedule dates (Sheikh/Mahaa)
- [ ] **Mahaa Website copy** still needed: Jul 17, Jul 31, Aug 20 corporate landing
- [ ] **Sep 12** site update — blocked until Sheikh 2026-09-11 decision ([`SEP12_90DAY_DECISION_TEMPLATE.md`](./SEP12_90DAY_DECISION_TEMPLATE.md))

Blocked regional Website rows (Jul 23–Aug 4) remain blocked until **OA-008** approval.

Reference: [`seo-remaining-closeout-2026-06-22.md`](./seo-remaining-closeout-2026-06-22.md)
