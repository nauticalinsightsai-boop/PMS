---
name: B15 Final Crawl Closeout
overview: "Final SEO closeout (B15): crawl findings register, priority URL QA, legacy URL decisions, A–Z batch closeout, digital PR planning register, owner action list. Docs-only Agent pass — no redirects without owner approval."
todos:
  - id: b15-ask-complete
    content: "Ask mode — repo inspection table + 25 questions (see conversation 2026-06-19)"
    status: completed
  - id: b15-plan-complete
    content: "Plan mode — 18-point closeout plan reviewed"
    status: completed
  - id: b15-doc-a
    content: "Create docs/internal/PMSTRUCTURE_FINAL_CRAWL_CLOSEOUT.md"
    status: completed
  - id: b15-csv-crawl
    content: "Create pmstructure-crawl-findings-register.csv (CRAWL-001 + task slots)"
    status: completed
  - id: b15-csv-pqa
    content: "Create pmstructure-priority-url-qa.csv (14 priority/legacy URLs)"
    status: completed
  - id: b15-csv-legacy
    content: "Create pmstructure-legacy-url-decision-register.csv"
    status: completed
  - id: b15-csv-az
    content: "Create pmstructure-a-z-implementation-closeout.csv (B01–B15)"
    status: completed
  - id: b15-csv-pr
    content: "Create pmstructure-digital-pr-backlink-register.csv (planning only)"
    status: completed
  - id: b15-csv-oa
    content: "Create pmstructure-final-owner-action-list.csv (OA-001–010)"
    status: completed
  - id: b15-readme
    content: "Update docs/internal/README.md with B15 links"
    status: completed
  - id: b15-qa-signoff
    content: "Add B14/B15 rows to pmstructure-qa-signoff-register.csv"
    status: completed
  - id: b15-test-ga
    content: "Run npm run check:ga + npm run seo:audit-analytics"
    status: completed
  - id: b15-owner-crawl
    content: "OA-001 Mahaa — run Screaming Frog/Sitebulb and attach export"
    status: pending
  - id: b15-owner-gsc
    content: "OA-002 Mahaa — GSC sitemap + priority URL indexation proof"
    status: pending
  - id: b15-owner-ga4
    content: "OA-003 Mahaa — GA4 DebugView/Tag Assistant after deploy"
    status: pending
  - id: b15-owner-pmp-url
    content: "OA-004/005 Sheikh — confirm /pmp and /pmp-exam-2026 vs B15 consolidation"
    status: pending
  - id: b15-owner-terms
    content: "OA-006 Sheikh — approve /terms → /legal/terms redirect"
    status: completed
  - id: b15-fix-terms-redirect
    content: "Implement /terms → /legal/terms in next.config.ts (blocked until OA-006)"
    status: completed
  - id: b15-fix-pmp-redirects
    content: "Implement /pmp or /pmp-exam-2026 redirects (blocked until OA-004/005)"
    status: pending
  - id: b15-live-crawl-import
    content: "Import real crawl export into crawl findings register (no invented rows)"
    status: pending
  - id: b15-manual-qa
    content: "Manual QA all 14 priority URLs post-deploy (status/redirect/canonical/schema)"
    status: pending
  - id: b15-psi-baseline
    content: "OA-009 Developer — PageSpeed/Lighthouse baseline for priority URLs (home CLI + evidence 2026-06-22; mobile PSI re-run recommended)"
    status: completed
  - id: b15-pr-outreach
    content: "OA-010 Mahaa — build legitimate PR outreach list from register"
    status: pending
isProject: false
---

# B15 — Final Crawl Fixes, Priority URL QA, A–Z Closeout

**Status:** Agent docs-only pass complete (2026-06-19). Verification and code fixes remain owner-blocked.

## Deliverables created

- [PMSTRUCTURE_FINAL_CRAWL_CLOSEOUT.md](../../docs/internal/PMSTRUCTURE_FINAL_CRAWL_CLOSEOUT.md)
- [pmstructure-crawl-findings-register.csv](../../docs/internal/pmstructure-crawl-findings-register.csv)
- [pmstructure-priority-url-qa.csv](../../docs/internal/pmstructure-priority-url-qa.csv)
- [pmstructure-legacy-url-decision-register.csv](../../docs/internal/pmstructure-legacy-url-decision-register.csv)
- [pmstructure-a-z-implementation-closeout.csv](../../docs/internal/pmstructure-a-z-implementation-closeout.csv)
- [pmstructure-digital-pr-backlink-register.csv](../../docs/internal/pmstructure-digital-pr-backlink-register.csv)
- [pmstructure-final-owner-action-list.csv](../../docs/internal/pmstructure-final-owner-action-list.csv)

## Key decisions documented (not implemented)

| URL | B15 default | Current repo |
|-----|-------------|--------------|
| `/pmp` | → `/certifications/pmp` | **Live T-032 hub** — redirect blocked |
| `/pmp-exam-2026` | → `/topics/pmp-exam-2026` | **Live cluster** — redirect blocked |
| `/privacy` | → `/legal/privacy` | **Implemented** |
| `/terms` | → `/legal/terms` | **Implemented** |

## Tests run

- `npm run check:ga` — pass
- `npm run seo:audit-analytics` — pass

## Not claimed

- Full Screaming Frog crawl complete
- GSC/GA4/PageSpeed live validation
- Any backlinks or PR placements
