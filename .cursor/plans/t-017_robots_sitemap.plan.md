---
name: T-017 Robots Sitemap
overview: Confirm PM Structure robots.txt includes Sitemap https://pmstructure.com/sitemap.xml, preserve safe crawl rules, document verification, and close T-014/T-015/T-016 dependencies where repo-side work is complete.
todos:
  - id: ask-search-repo
    content: "Ask: Search repo for robots.txt, robots.ts, sitemap.ts, host env vars, Sitemap lines"
    status: completed
  - id: ask-inspection-table
    content: "Ask: Return inspection table (path, purpose, state, risk, safe to edit, notes)"
    status: completed
  - id: ask-q1-framework
    content: "Ask Q1: Identify framework (Next.js App Router)"
    status: completed
  - id: ask-q2-static-dynamic
    content: "Ask Q2: Confirm robots static vs dynamic (dynamic frontend/app/robots.ts)"
    status: completed
  - id: ask-q3-robots-present
    content: "Ask Q3: Confirm /robots.txt present and HTTP 200 on production"
    status: completed
  - id: ask-q4-sitemap-line
    content: "Ask Q4: Confirm robots includes Sitemap line"
    status: completed
  - id: ask-q5-exact-url
    content: "Ask Q5: Confirm exact sitemap URL https://pmstructure.com/sitemap.xml"
    status: completed
  - id: ask-q6-apex-host
    content: "Ask Q6: Confirm sitemap line uses https://pmstructure.com"
    status: completed
  - id: ask-q7-no-www
    content: "Ask Q7: Confirm no www.pmstructure.com in sitemap line"
    status: completed
  - id: ask-q8-no-http
    content: "Ask Q8: Confirm no http:// in sitemap line"
    status: completed
  - id: ask-q9-sitemap-type
    content: "Ask Q9: Confirm /sitemap.xml is dynamic (frontend/app/sitemap.ts)"
    status: completed
  - id: ask-q10-host-consistency
    content: "Ask Q10: Confirm robots and sitemap share PMS_SITE_URL"
    status: completed
  - id: ask-q11-sitemap-not-blocked
    content: "Ask Q11: Confirm /sitemap.xml not disallowed"
    status: completed
  - id: ask-q12-public-not-blocked
    content: "Ask Q12: Confirm important public pages not blocked"
    status: completed
  - id: ask-q13-internal-exposure
    content: "Ask Q13: Confirm robots does not expose internal paths unnecessarily"
    status: completed
  - id: ask-q14-agent-safe
    content: "Ask Q14: Confirm Agent can safely proceed"
    status: completed
  - id: plan-file-to-edit
    content: "Plan: Identify file to edit (none — robots.ts already correct)"
    status: completed
  - id: plan-sitemap-line
    content: "Plan: Define required line Sitemap https://pmstructure.com/sitemap.xml"
    status: completed
  - id: plan-preserve-rules
    content: "Plan: Preserve Allow / and Disallow /api/ /admin/"
    status: completed
  - id: plan-remove-wrong-lines
    content: "Plan: Remove/replace wrong www or http sitemap lines if present"
    status: completed
  - id: plan-t015-dependency
    content: "Plan: Confirm T-015 sitemap.xml dependency status"
    status: completed
  - id: plan-test-steps
    content: "Plan: Define test steps (seo:robots-check, live curl, seo:production-check)"
    status: completed
  - id: agent-sitemap-apex-https
    content: "Agent: Ensure sitemap line uses apex HTTPS absolute URL via PMS_SITE_URL"
    status: completed
  - id: agent-single-sitemap-line
    content: "Agent: Ensure exactly one sitemap line in production robots output"
    status: completed
  - id: agent-preserve-allow-disallow
    content: "Agent: Preserve safe Allow and Disallow rules"
    status: completed
  - id: agent-no-disallow-sitemap
    content: "Agent: Do not disallow /sitemap.xml or /robots.txt"
    status: completed
  - id: agent-no-block-public
    content: "Agent: Do not block /, /certifications/, /answers/, /topics/, /faq"
    status: completed
  - id: agent-internal-doc
    content: "Agent: Create docs/internal/PMSTRUCTURE_ROBOTS_SITEMAP_CHECK.md"
    status: completed
  - id: agent-readme-link
    content: "Agent: Link T-017 doc in docs/internal/README.md"
    status: completed
  - id: agent-env-example-railway
    content: "Agent: Update .env.example production URL comments for Railway (all four NEXT_PUBLIC_* URL vars)"
    status: completed
  - id: agent-robots-check-harden
    content: "Agent: Harden scripts/seo/robots-check.mjs to assert PMS_SITE_URL sitemap pattern and no sitemap disallow"
    status: completed
  - id: test-robots-check
    content: "Test: npm run seo:robots-check"
    status: completed
  - id: test-sitemap-check
    content: "Test: npm run seo:sitemap-check"
    status: completed
  - id: test-production-check
    content: "Test: npm run seo:production-check"
    status: completed
  - id: test-smoke-live
    content: "Test: npm run seo:smoke-live"
    status: completed
  - id: test-lint
    content: "Test: npm run lint (AC-10) — pre-existing frontend ESLint errors unrelated to T-017; not introduced by this task"
    status: completed
  - id: test-build-frontend
    content: "Test: npm run build -w @pms/frontend (AC-10)"
    status: completed
  - id: verify-curl-robots
    content: "Verify: curl https://pmstructure.com/robots.txt shows correct Sitemap line"
    status: completed
  - id: verify-curl-sitemap
    content: "Verify: curl -I https://pmstructure.com/sitemap.xml returns HTTP 200 XML"
    status: completed
  - id: owner-gsc-robots-fetch
    content: "Owner: GSC robots.txt tester — confirm /robots.txt fetchable (blocked: GSC login — PMSTRUCTURE_OWNER_SEO_UI_CHECKLIST.md)"
    status: pending
  - id: owner-gsc-sitemap-in-robots
    content: "Owner: GSC — confirm sitemap listed in robots.txt (blocked: GSC login)"
    status: pending
  - id: owner-gsc-sitemap-success
    content: "Owner: GSC Sitemaps — confirm sitemap.xml Success + Discovered URLs (T-016; blocked: GSC login)"
    status: pending
  - id: owner-gsc-url-inspection-home
    content: "Owner: GSC URL Inspection https://pmstructure.com/ (blocked: GSC login)"
    status: pending
  - id: owner-gsc-url-inspection-pmp
    content: "Owner: GSC URL Inspection https://pmstructure.com/certifications/pmp (blocked: GSC login)"
    status: pending
  - id: owner-gsc-url-inspection-answer
    content: "Owner: GSC URL Inspection https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026 (blocked: GSC login)"
    status: pending
  - id: owner-bing-verify
    content: "Owner: Bing — Sign In, Verify BingSiteAuth.xml, submit sitemap (blocked: Bing login — PMSTRUCTURE_OWNER_SEO_UI_CHECKLIST.md)"
    status: pending
  - id: owner-checklist-doc
    content: "Agent: Create docs/internal/PMSTRUCTURE_OWNER_SEO_UI_CHECKLIST.md"
    status: completed
  - id: dep-t014-robots-exists
    content: "Dependency T-014: Robots.txt exists"
    status: completed
  - id: dep-t015-sitemap-exists
    content: "Dependency T-015: XML sitemap exists and is correct"
    status: completed
  - id: dep-t016-gsc-submit
    content: "Dependency T-016: Sitemap submitted to Search Console (owner Success confirmation pending — GSC login required)"
    status: pending
isProject: false
---

# T-017 — Confirm XML Sitemap Is Included in Robots.txt

## Required state

```txt
https://pmstructure.com/robots.txt
→ Sitemap: https://pmstructure.com/sitemap.xml

https://pmstructure.com/sitemap.xml
→ HTTP 200 valid XML
```

## Implementation

| Item | Location |
| ---- | -------- |
| Robots | `frontend/app/robots.ts` |
| Site URL | `frontend/config/pms-site.ts` → `PMS_SITE_URL` |
| Sitemap | `frontend/app/sitemap.ts` (T-015) |
| Validation | `npm run seo:robots-check` |
| Internal doc | `docs/internal/PMSTRUCTURE_ROBOTS_SITEMAP_CHECK.md` |

Production robots output (verified 2026-06-18):

```txt
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://pmstructure.com/sitemap.xml
```

## Related tasks

- T-014 — Robots.txt exists (complete)
- T-015 — XML sitemap (complete)
- T-016 — Search Console submission (owner Success pending)
- Bing — `BingSiteAuth.xml` deployed; owner Verify + sitemap submit pending

## Manual verification

```bash
curl https://pmstructure.com/robots.txt
curl -I https://pmstructure.com/sitemap.xml
npm run seo:robots-check
npm run seo:production-check
```
