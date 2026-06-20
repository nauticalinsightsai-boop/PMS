# Frontend config layer

Single-responsibility modules for the public PM Structure site. Import from the narrowest module that fits.

| Module | Purpose |
|--------|---------|
| `pms-site.ts` | Canonical URL, legal entity, support contact, Calendly, WhatsApp, SEO assets |
| `community.ts` | Circle join URL (`NEXT_PUBLIC_CIRCLE_COMMUNITY_JOIN_URL`), platform label |
| `site.ts` | Social profile URLs, brand ecosystem links, `sameAs` for syndication |

## Rules

1. **SEO metadata** → `pms-site.ts` + `@/lib/site-metadata.ts` (never `site.ts` homepage SEO — removed).
2. **Community join links** → `resolveCommunityJoinUrl()` from `community.ts` (or re-export `PMS_SKOOL_COMMUNITY_JOIN_URL` from `pms-site.ts`).
3. **Footer / portal social icons** → `@/constants/socialProfiles.ts` (derived from `site.ts`).
4. **Secrets** → environment variables only (invitation tokens, API keys). No tokens in source defaults.

## Production env

Set on Vercel/Railway for the marketing deployment:

```bash
NEXT_PUBLIC_SITE_URL=https://pmstructure.com
NEXT_PUBLIC_CIRCLE_COMMUNITY_JOIN_URL=https://www.pmstructure.com/join?invitation_token=…
```

Community CTAs use `resolveCommunityJoinUrl()` → Circle custom domain (`www.pmstructure.com/join`). Apex `/join` redirects to www with params preserved. Legacy `/community/sign-in` redirects to `/join`.
