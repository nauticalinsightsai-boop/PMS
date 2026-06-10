# Calendly channel events (29-event manifest)

Single source of truth for all `/go/*` portal Calendly tiers and the Home hero consultation popup.

## Manifest

- **Path:** `data/calendly-events.manifest.json` (mirrored to `packages/booking-crm/data/`)
- **Count:** 29 events (001 hero + platform family pairs + channel-specific overrides)
- **Primary handle:** `booking-sh3ikhmabz` (`urls.primary`)
- **API fallback handle:** `pm-structure` (`urls.fallback` — populated after provision)

Each row includes: `id`, `name`, `slug`, `family`, `tierKind`, duration, CTA, payment/guests/limits/buffers, `description`, `standardQuestions`, `channelIds[]`, `portalTierIds[]`, and `urls`.

### Tier kinds → portal tiers

| tierKind | Portal tier ids |
|----------|-----------------|
| `hero` | Home hero only |
| `discovery` | `mentor-intro`, `discovery` |
| `executive` | `career-pathway`, `executive` |
| `services` | `services-detail`, `design-review` |

Channel-specific events (LinkedIn, YouTube, Email, RSS) take precedence over family-wide events when resolving URLs.

## Code

| Module | Role |
|--------|------|
| `packages/booking-crm/src/calendly/event-registry.ts` | `resolveCalendlyEventUrl`, `getEventForChannelTier` |
| `frontend/lib/calendly/event-registry.ts` | Re-export for Next.js |
| `packages/booking-crm/src/channel-landing-pages/platformTierCopy.ts` | Default tier URLs + CTAs |
| `frontend/components/channel-landing/portal/scheduleTierClick.ts` | Popup fallback via registry |

### URL resolution order

1. `NEXT_PUBLIC_CALENDLY_EVENT_{SLUG}` env override (slug without `go-`, dashes → underscores, uppercased)
2. Hero legacy: `NEXT_PUBLIC_CALENDLY_EVENT_URL_WEBSITE_HERO`
3. `urls.fallback` (pm-structure, from API provision)
4. `urls.primary` (booking-sh3ikhmabz)

## Commands

```bash
# Regenerate manifest JSON (after editing generator)
npm run calendly:generate-manifest

# Provision all events via Calendly API (requires CALENDLY_API_TOKEN in .env.local)
npm run calendly:provision-events
npm run calendly:provision-events -- --dry-run
npm run calendly:provision-events -- --only=028,029
npm run calendly:provision-events -- --skip-existing

# Sync portal JSON tier scheduleUrl + ctaLabel from manifest
npm run sync:portal-calendly-urls
npm run sync:portal-data

# Push manifest descriptions + durations to Calendly (API-supported fields)
npm run calendly:sync-event-details

# Validate manifest + channel resolution
npm run calendly:validate-events
npm run calendly:validate-events -- --check-urls
```

Provision report: `docs/reports/CALENDLY_PROVISION_REPORT.md`

Audit + UI checklist (after sync):

- `docs/reports/CALENDLY_AUDIT_REPORT.md`
- `docs/reports/CALENDLY_UI_SETUP_CHECKLIST.md`

## Calendly UI checklist (post-API)

The Calendly REST API may not apply custom questions, daily limits, buffers, guests, or Stripe payment. After provision, verify in Calendly UI:

| Template | Duration | Limit | Buffer | Guests | Payment |
|----------|----------|-------|--------|--------|---------|
| Discovery | 20 min | 2/day | 10 / 10 | Off | Free |
| Executive | 35 min | 2/day | 15 / 15 | On | Paid / Stripe |
| Services | 45 min | 2/day | 15 / 15 | On | Paid / Stripe |
| Hero | 20 min | 2/day | 10 / 10 | Off | Free / invite-only |

Standard invitee questions (all tiers): Phone, Certification (PMP/PRINCE2/Six Sigma + Other), Years of experience, optional concern, optional LinkedIn.

## Production (Railway / Vercel)

Set optional overrides only when a live URL differs from manifest defaults:

```env
# Hero (legacy name still supported)
NEXT_PUBLIC_CALENDLY_EVENT_URL_WEBSITE_HERO=https://calendly.com/pm-structure/website-hero-book-consultation

# Per-slug pattern (example)
NEXT_PUBLIC_CALENDLY_EVENT_SYNDICATED_DISCOVERY=https://calendly.com/booking-sh3ikhmabz/go-syndicated-discovery
```

API token for provisioning scripts only — **never** commit `CALENDLY_API_TOKEN`.

## Dual-account migration

Until all 29 events exist under `booking-sh3ikhmabz`, `urls.fallback` stores the pm-structure URL returned by the API. Remove fallbacks and env overrides once migration is complete.
