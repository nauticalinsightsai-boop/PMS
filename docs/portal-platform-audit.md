# Portal platform audit (41 slugs)

Audit reconciled with implementation. Machine-readable matrix: [`packages/booking-crm/data/portal-theme-matrix.json`](../packages/booking-crm/data/portal-theme-matrix.json).

## Summary

| Check | Status |
|-------|--------|
| 41 slugs in `IMPLEMENTATION_SCOPE_41` | OK |
| Dark mode avoids bluish `#0B1018` baseline | OK (brand overrides + extended + derive fallback) |
| Light extended palettes for former baseline slugs | OK (`platformScopePalettes.ts`) |
| Theme-tinted portal cards (not site GlassCard) | OK (`PortalCard.tsx`) |
| Calendly uses `--portal-*` on `/go/*` | OK (`embed-url.ts`) |
| Per-slug credibility tab labels + value cards | OK (`portalChannelConversionOverrides.ts`) |
| 82 learner avatars ≥500 bytes | OK (`frontend/public/portal/learners/`) |

## Regenerate

```bash
npx tsx scripts/generate-portal-theme-matrix.ts
node scripts/generate-learner-avatars.mjs
node scripts/ensure-learner-headshots.mjs --check
npm run test -w @pms/frontend -- packages/booking-crm/src/channel-landing-pages/platformThemeModes.test.ts
```
