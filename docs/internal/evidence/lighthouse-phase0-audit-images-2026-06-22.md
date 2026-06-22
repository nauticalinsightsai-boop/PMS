# Phase 0 — Image audit baseline (2026-06-22)

## Repo scan (`node scripts/audit-images.mjs`)

**PASS** — no `https://picsum.photos` or `i.pravatar.cc` URL literals in `frontend/` or `packages/` source after hardening.

## CMS snapshot (`docs/cms-audit/website-data-snapshot.json`)

| Field | Finding |
|-------|---------|
| `store` products `imageUrl` | 6× `picsum.photos` seeds (exam, templates, planner, bundle, risk, sigma) |
| `testimonials` `avatarUrl` | **None** in snapshot (no pravatar) |
| Newsletter covers | No picsum in snapshot posts |

## Production HTML (`--production=https://pmstructure.com`)

**PASS** — initial HTML contains no `pravatar.cc` or `picsum.photos` (client-loaded CMS URLs guarded at runtime in `Home.tsx` / `Store.tsx`).

## Conclusion

- **Repo defaults:** fixed in `packages/site-content` (store, cms-posts).
- **Live CMS:** store rows may still hold picsum until admin republish; runtime guards prevent browser fetch.
- **pravatar:** production PSI showed pravatar on testimonials — likely live CMS-only; runtime `sanitizeAvatarUrl` in Home maps to `/images/marketing/pmp-avatar-*.webp`.
