# PM Structure — Validation Scripts Plan

**Updated:** 2026-06-10 — Run 17 + SSR guards

## `seo:check` suite (17 scripts)

| Script | npm command | Validates |
|--------|-------------|-----------|
| Sitemap guard | `seo:sitemap-check` | Literal paths in sitemap config |
| Canonical smoke | `seo:canonical-check` | UTM/region param stripping |
| Noindex guard | `seo:noindex-check` | Checkout/enroll noindex |
| H1 count | `seo:h1-check` | Single H1 on marketing pages |
| Heading outline | `seo:headings-check` | H1 presence on key page components |
| Section ambience | `seo:section-ambience-check` | No content wrapped as `SectionAmbience` children (SSR) |
| Schema | `seo:schema-check` | Builders + JSON-LD components |
| Schema guards | `seo:schema-guards-check` | No ATP/checkout/AggregateRating in JSON-LD |
| FAQ | `seo:faq-check` | 75 PMP 2026 + ~145 total FAQs |
| AI files | `seo:ai-files-check` | 14 public JSON/feed files |
| PMP cluster | `seo:pmp-check` | 21 PMP routes |
| Answers | `seo:answers-check` | 23 answer slugs |
| Topics | `seo:topics-check` | 17 topic hubs |
| Courses | `seo:course-check` | 8 pathway routes |
| Internal links | `seo:internal-links-check` | PMP/answer/topic cross-links |
| Regional pricing | `seo:regional-pricing-check` | Legal + pricing policy |
| Legal compliance | `seo:legal-compliance-check` | Hub, disclaimers, footer |

## Additional scripts

| Script | npm command | When |
|--------|-------------|------|
| Audit | `seo:audit` | Pre-check token + file presence |
| Render / SSR body | `seo:render-check` | After `next build` |
| Post-build verify | `seo:postbuild` | Alias for `seo:render-check` |
| AI files generate | `seo:generate-ai-files` | Prebuild / `seo:all` |
| Legal SEO | `test:legal-seo` + `legal-seo-check.mjs` | Banned strings, hub paths |
| Release verify | `seo:release-verify` | Build + `seo:all` + `seo:postbuild` |
| Smoke URL list | `seo:smoke-urls` | Post-deploy GSC inspection list |
| Live smoke | `seo:smoke-live` | HTTP 200 + H1 + canonical on production |

## `seo:all` pipeline

```
seo:audit → seo:check (17) → seo:generate-ai-files → test:legal-seo → legal-seo-check.mjs
```

## CI / pre-deploy

```bash
npm run build -w @pms/frontend
npm run seo:all
npm run seo:postbuild
```

## Render-check spec (8 routes)

After `next build`, verify static HTML at `frontend/.next/server/app/**/*.html` contains:

| Route | Must include |
|-------|----------------|
| `/` | `<h1`, `PMP` |
| `/faq` | `<h1`, `FAQ` |
| `/pmp-exam-2026` | `<h1`, `2026` |
| `/answers/is-the-pmp-exam-changing-in-2026` | `<h1`, `changing`, `short answer` |
| `/topics/pmp-exam-2026` | `<h1`, `PMP` |
| `/certifications/pmp` | `<h1`, `PMP` |
| `/answers` | `<h1` |
| `/topics` | `<h1` |
