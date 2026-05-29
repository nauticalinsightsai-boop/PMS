# Learner headshots (`/portal/learners/`)

## Files

- **82 WebP files:** `{channelId}-1.webp`, `{channelId}-2.webp` for each slug in `IMPLEMENTATION_SCOPE_41`
- **Paths in code:** [`portalLearnerAvatars.ts`](../packages/booking-crm/src/channel-landing-pages/portalLearnerAvatars.ts)
- **UI:** `LearnerAvatar` in [`PortalCredibilityTabs.tsx`](../frontend/components/channel-landing/portal/primitives/PortalCredibilityTabs.tsx) (`#portal-cred-panel-quotes`)

## Personas

Names and quotes come from [`portalLearnerStories.ts`](../packages/booking-crm/src/channel-landing-pages/portalLearnerStories.ts). Avatars show initials derived from each persona name on a per-channel gradient.

## Generate / validate

```bash
node scripts/generate-learner-avatars.mjs   # 128×128 WebP, requires sharp
node scripts/ensure-learner-headshots.mjs --check   # fails if any file ≤500 bytes
```

Replace generated files with curated stock photography when available; keep filenames stable.
