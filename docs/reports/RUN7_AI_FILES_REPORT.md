# Run 7 — AI Files Report

**Date:** 2026-06-10

## Delivered

- `frontend/lib/ai-files/compliance.ts` — safe language, doNotCite rules
- `frontend/lib/ai-files/builders.ts` — all JSON builders
- `frontend/scripts/generate-ai-files.mjs` — uses shared builders (prebuild)
- `frontend/public/llms.txt` — expanded with PMP cluster, doNotCite, lastUpdated
- 14 public JSON files with version, updatedAt, compliance fields
- `npm run seo:ai-files-check` — field + compliance validation

## Files generated

entity.json, ai-profile.json, courses.json, certifications.json, learning-pathways.json, pricing-policy.json, pmp-2026.json, pmp-keywords.json, pmp-faq.json, pmp-routes.json, faq.json, answers.json, topics.json

## Future rules

Re-run `npm run seo:generate-ai-files` after FAQ expansion, new answer/topic routes, or PMP cluster changes. Prebuild hook runs automatically on `npm run build`.
