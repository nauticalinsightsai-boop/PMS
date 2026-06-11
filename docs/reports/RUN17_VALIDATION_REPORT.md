# Run 17. Validation Scripts Report

**Date:** 2026-06-10

## Suite

`seo:check`: **17 scripts** (was 16):

| New / updated | Purpose |
|---------------|---------|
| `seo:section-ambience-check` | Prevents `SectionAmbience` children pattern (empty SSR bodies) |
| `seo:answers-check` | Min 23 slugs |
| `seo:topics-check` | Min 17 hubs |
| `seo:render-check` | 8 routes after build |
| `seo:postbuild` | Alias for render-check in deploy flow |

## Commands

```bash
npm run seo:all        # audit + 17 checks + AI files + legal-seo
npm run build -w @pms/frontend
npm run seo:postbuild  # SSR H1 + answer body in static HTML
```

## CI / pre-deploy

- `npm run seo:release-verify`: single command for release gate
- `.github/workflows/seo-release.yml`. CI on frontend/seo path changes
- `npm run seo:smoke-urls`: post-deploy URL list for GSC/manual checks

## Post-deploy only

GSC/Bing submit, Rich Results Test, AI answer baseline: not automatable in repo.