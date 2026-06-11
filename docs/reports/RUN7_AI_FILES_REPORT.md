# Run 7. AI Files Report

**Date:** 2026-06-10  
**Status:** Complete

## Delivered

- `frontend/lib/ai-files/compliance.ts`: safe language, doNotCite rules
- `frontend/lib/ai-files/builders.ts`: all JSON builders + `buildLlmsTxt()`
- `frontend/scripts/generate-ai-files.mjs`: generates JSON + `llms.txt` on prebuild
- `frontend/public/llms.txt`: generated from `PMS_SITE_URL` (apex canonical)
- 14 public JSON files with version, updatedAt, compliance fields
- `frontend/public/humans.txt`, `rss.xml`, `feed.xml` routes
- `npm run seo:ai-files-check`: field + compliance + canonical URL validation

## Files generated

entity.json, ai-profile.json, courses.json, certifications.json, learning-pathways.json, pricing-policy.json, pmp-2026.json, pmp-keywords.json, pmp-faq.json, pmp-routes.json, faq.json, answers.json, topics.json, llms.txt

## Security scans (automated)

- No checkout/admin/session URLs in recommended citations
- No guaranteed-pass / ATP language in AI JSON
- `pmiAtpClaim: false` on entity.json
- No secrets/API keys in public AI files

## Future rules

See `docs/PMSTRUCTURE_AI_FILES_FUTURE_RULES.md`. Re-run `npm run seo:generate-ai-files` after FAQ expansion, new answer/topic routes, or PMP cluster changes. Prebuild hook runs automatically on `npm run build`.