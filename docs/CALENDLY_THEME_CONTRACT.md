# Calendly + cookie theme contract (all 41 published `/go` slugs)

Per-page Calendly popup theming and portal-matched cookie consent. Driven only by `resolvePortalTheme` / `resolveSchedulerChrome`. **No Instagram-only or Snapchat override hacks.**

## Published slug ↔ channelId map

| Public slug | channelId | Theme tier | Calendly family |
|---|---|---|---|
| website | website | full | website |
| medium | medium | full | publishing |
| substack | substack | extended | publishing |
| beehiiv | beehiiv | full | publishing |
| ghost | ghost | extended | publishing |
| hashnode | hashnode | extended | publishing |
| notion | notion-public | extended | publishing |
| linkedin | linkedin | full | social |
| x | twitter | full | social |
| instagram | instagram | full | social |
| facebook | facebook | full | social |
| reddit | reddit | full | social |
| threads | threads | extended | social |
| quora | quora | extended | social |
| bluesky | bluesky | full | social |
| mastodon | mastodon | extended | social |
| pinterest | pinterest | extended | social |
| youtube | youtube | full | social (video) |
| tiktok | tiktok | full | social (video) |
| snapchat | snapchat | full | social (video) |
| vimeo | vimeo | extended | social (video) |
| spotify | spotify | full | podcast |
| apple-podcasts | apple-podcasts | extended | podcast |
| amazon-audible | amazon-audible | extended | podcast |
| google-podcasts | google-podcasts | extended (hardened; was baseline) | podcast |
| podbean | podbean | extended | podcast |
| soundcloud | soundcloud | extended | podcast |
| email | email | extended | messaging |
| whatsapp | whatsapp | full | messaging |
| telegram | telegram | full | messaging |
| discord | discord | full | messaging |
| slack | slack | extended | messaging |
| google-search | google-search | extended | syndicated |
| youtube-search | youtube-search | extended | syndicated |
| podcast-directories | podcast-directories | extended | syndicated |
| bing-search | bing-search | extended | syndicated |
| ai-visibility | ai-visibility | extended | syndicated |
| rss-feeds | rss-feeds | extended | syndicated |
| content-aggregators | content-aggregators | extended | syndicated |
| api-ai-fed | api-ai-fed | extended | syndicated |
| webinar | webinar | full (palette aliases website) | webinar |

**Theme tier counts:** 17 full (`PLATFORM_THEME_OVERRIDES`) + 24 extended (`PLATFORM_THEME_SCOPE_EXTENDED`, including hardened `google-podcasts`) = 41 published. Webinar shell/primary matches website.

**Draft `vk`:** theme exists (extended) but page is draft / not in SSG. **Exclude** from automated matrix stop-gate; optional preview parity only.

**Aliases:** `x` → `twitter`, `notion` → `notion-public` via `CHANNEL_PUBLIC_SLUG` / `resolveChannelIdFromLegacyKey`.

## Calendly event families (19 unique URLs)

| Family | Free / open | Paid |
|---|---|---|
| Website | talk-to-mentor | talk-to-advisor (exec + services) |
| Webinar | go-webinar-open | go-webinar-paid |
| Publishing | go-newsletters-discovery | go-newsletters-executive, go-newsletters-design-review |
| Social (+ video) | so-discovery-mentorship | go-social-media-executive, go-social-media-design-review |
| Podcasts | go-podcasts-discovery | go-podcasts-executive, go-podcasts-design-review |
| Messaging | go-messaging-discovery | go-messaging-executive, go-messaging-design-review |
| Syndicated | go-syndicated-discovery | go-syndicated-executive, go-syndicated-design-review |

Resolved per slug by `getCalendlyUrlForChannelTier` / portal tier modules (not Instagram-only).

## Visual gates (every slug × light/dark)

### Calendly popup
1. Shell `background_color` / `text_color` / `primary_color` = page theme (exact primary; no adjustHex drift)
2. Unselected date fill mode-aware (dark ≠ white)
3. Unselected date number readable (primary if contrast ≥ 3 else text)
4. Selected date / time / Next = primary + primaryForeground
5. Unselected time fill/border/text contrast-safe
6. Form Name/Email labels readable; submit = primary
7. After date select: real date string — never `[missing "en.time.formats.date_full"]`
8. Avatar loads (CloudFront / Calendly CDN)
9. Date → time → Next → form works; no infinite spinner / Oops on free flows
10. Paid invitee/payment paths escape to `https://calendly.com/...` (calendar/time stay themed until handoff)

### Cookie banner (portal pages)
1. Background = card/surface chrome
2. Body = textMuted; title = text
3. Links = linkColor
4. Reject = border + text
5. Accept = primary + primaryForeground
6. Updates when portal light/dark toggles (and when banner reopens)
7. Marketing (`PublicShell`, no portal theme) keeps slate/brand fallback

## Architecture

- Theme: `resolvePortalTheme(channelId, mode)` + `resolveSchedulerChrome(channelId, mode)`
- Open: `openCalendlyThemedPopup` → same-origin proxy URL with shell + `slot_*` params
- Proxy: `/api/calendly/scheduler` (HTML rewrite + CSP) + `/api/calendly/booking/[...path]`
- Cookie: `usePortalRegionTheme()` on banner sibling in `PortalRegionShell` (not `.portal-root` CSS inheritance)

## Call-site matrix

| Entry | Surface | Theme wiring |
|---|---|---|
| `ChannelPortalTiersSection` → `scheduleTierClick` | Portal | `channelId` + `portalTheme` + `colorMode` |
| `ChannelConsultationPortalView` bookDiscovery / hero mentor (`ChannelPortalHeroHeader` onBookMentor) | Portal | same via `scheduleTierClick` |
| `WebsiteCalendlyButton` / `openWebsiteCalendly` | Marketing | always `channelId: website` + proxy href |
| **WebsiteCalendlyButton sites:** Navbar ×2, Home (hero + career + final CTAs), PMService ×4, FAQ, Certifications ×2, Compare, About, PathwayFeaturedCard, CertProgramHighlightsSection, PmpRoadmapCtaLink, PagePrimaryCta | Marketing | via shared button (themed proxy href + open) |
| **Direct popup:** SupportChatWidget, BottomCtaRotator ×2, LeadRecoveryDialog, OnboardingCalendlyCta | Marketing | `channelId: website` + `useProxy` |
| OnboardingCalendlyCta hosts: ProgramEnrollmentSuccess + membership checkout success | Marketing | inherits OnboardingCalendlyCta wiring |
| PathwayOfferingModal / OfferingCtaButtons → `openPathwayConsultationCalendly` | Marketing | `channelId: website` + mode + portalTheme |
| FloatingQuickActions | Dead (not mounted in PublicShell) | still wired if revived |
| `CalendlyInlineEmbed` / `buildCalendlyIframeEmbedUrl` | Unused orphan | **excluded from popup scope** — do not block ship |

## Non-goals

- Do not fix Instagram only then assume all slugs work
- Do not use `adjustHex(primary, +10)` drift
- Do not freeze `location.pathname` in proxy shim
- Do not leave cookie on global glass when portal theme is active
- Do not run long `next build` while `dev` is running if it corrupts `.next`
- Do not keep per-slug override tables (e.g. Snapchat `CALENDLY_POPUP_THEME_OVERRIDES`)

## Stop gate

Automated matrix green (41 × light/dark) + URL/proxy smoke green + **manual cohort click-through** pass. Do not mark visual gates done from HTML smoke alone (F5b).

### Automated commands

```bash
# Matrix: shell/slots/contrast for all published slugs × light/dark
cd frontend && npm test -- ../packages/booking-crm/src/channel-landing-pages/resolveSchedulerChrome.test.ts

# Matrix JSON report (writes packages/booking-crm/data/scheduler-chrome-matrix.json)
cd frontend && npm test -- ../packages/booking-crm/src/channel-landing-pages/schedulerChromeMatrix.report.test.ts

# Proxy URL smoke (unique event URLs × modes; needs network)
node scripts/calendly-proxy-smoke.mjs

# Live proxy (optional)
BASE_URL=http://localhost:3000 node scripts/calendly-proxy-smoke.mjs
```

### Manual cohort checklist (operator — required for F5)

For each page × light + dark, open discovery CTA and verify gates 1–10 above, plus cookie banner tokens:

| Cohort | Path | Notes |
|---|---|---|
| Snapchat / yellow | `/go/snapchat` | Hard yellow primary; dates before click |
| Instagram | `/go/instagram` | Full flow + cookie (not Instagram-only ship) |
| LinkedIn | `/go/linkedin` | Popup + cookie |
| YouTube | `/go/youtube` | Popup + cookie |
| Near-white / black primary | Matrix outliers (e.g. dark pages with `#fff`/`#000` primary) | Dark mode readability |
| google-podcasts | `/go/google-podcasts` | Extended palette hardened |
| Paid escape | Any executive/services tier | Themed calendar → escape to calendly.com |

Per page×mode: (1) shell bg (2) date numbers readable before click (3) time text readable (4) no missing date_full (5) avatar (6) reserve→date→time→Next→form (7) cookie matches (8) toggle updates popup+cookie.

### Post-deploy spot-check

After production deploy: sample one slug per family (website, webinar, publishing, social, podcast, messaging, syndicated) — confirm CSP allows CloudFront/Calendly CDN, avatars load, proxy `/api/calendly/scheduler` returns 200.

### Implementation status

| Gate | Status |
|---|---|
| A–E code (chrome, proxy, call sites, cookie) | Done |
| F1 / F1b matrix | Green — fails on white dark fills, contrast &lt; 3, shell drift |
| F2 / F2b URL/proxy smoke | Green — 19 unique URLs + family samples + inject unit smoke |
| F3 manual cohort | Checklist above — **operator click-through required** |
| F4 prod spot-check | Procedure above — run after deploy |
| F5 / F5b stop gate | Automated green; manual cohort remains operator-owned before production sign-off |
