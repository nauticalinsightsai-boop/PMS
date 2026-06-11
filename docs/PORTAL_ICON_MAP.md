# Portal icon map (`/go/{slug}`)

43 published CTA channel portals. Icons resolve via `AdminChannelMark` → custom PNG in `frontend/public/images/logo/` → Lucide fallback from `channelGroups.ts`.

## How it works

| Layer | Role |
| --- | --- |
| **Slug** | Public URL: `/go/{slug}` (e.g. `/go/linkedin`) |
| **Channel ID** | Internal key in `packages/booking-crm/src/constants/channelGroups.ts` and `data/channel-landing-pages.json` |
| **Custom PNG** | `public/images/logo/{name}-mark.png` (or `-light` / `-dark` pairs) |
| **Fallback** | Lucide icon from `channelGroups.ts` via `PlatformChannelIcon` |
| **Resolver** | `frontend/components/admin/AdminChannelMark.tsx` + `channelMarkAssets.ts` |

**Scope:** 41 slugs in `IMPLEMENTATION_SCOPE_41` (`platformBrandSources.ts`). CMS publishes 43 slugs (includes legacy `google-podcasts`).

**Slug aliases:** `/go/notion` → `notion-public`; `/go/x` → `twitter`.

**Cache bust:** bump `CHANNEL_MARK_ASSET_VERSION` in `packages/booking-crm/src/channel-landing-pages/channelMarkAssets.ts` after replacing PNGs.

## Install / refresh PNGs

```bash
node scripts/install-portal-channel-marks.mjs
```

Sources: Cursor workspace assets (`~/.cursor/projects/d-My-Websites-PMS/assets/`). Override with `PORTAL_MARK_ASSETS_DIR`.

## Naming rules

| Pattern | Example |
| --- | --- |
| Single mark | `linkedin-mark.png` |
| Light/dark pair | `medium-mark-light.png`, `medium-mark-dark.png` |
| X (channel `twitter`) | `x-mark-light.png`, `x-mark-dark.png` |
| Notion (`notion-public`) | `notion-mark-light.png`, `notion-mark-dark.png` |
| Website (`website`) | `/brand/pms-icon.png`, `/brand/pms-icon-dark.png` (not under `/images/logo/`) |

**Specs:** PNG, square, min 256×256; transparent background preferred. UI display ~40px (admin) / ~24px (portal strip).

## Status in this repo

### Custom PNG (installed)

`ghost-mark.png` is **not** in the asset batch yet: still Lucide.

| Channel ID | Label | PNG file(s) |
| --- | --- | --- |
| website | Website | `/brand/pms-icon.png`, `/brand/pms-icon-dark.png` |
| medium | Medium | `medium-mark-light.png`, `medium-mark-dark.png` |
| substack | Substack | `substack-mark.png` |
| beehiiv | Beehiiv | `beehiiv-mark-light.png`, `beehiiv-mark-dark.png` |
| hashnode | Hashnode | `hashnode-mark.png` |
| notion-public | Notion | `notion-mark-light.png`, `notion-mark-dark.png` |
| linkedin | LinkedIn | `linkedin-mark.png` |
| twitter | X | `x-mark-light.png`, `x-mark-dark.png` |
| instagram | Instagram | `instagram-mark.png` |
| reddit | Reddit | `reddit-mark.png` |
| quora | Quora | `quora-mark.png` |
| bluesky | Bluesky | `bluesky-mark.png` |
| mastodon | Mastodon | `mastodon-mark.png` |
| pinterest | Pinterest | `pinterest-mark.png` |
| vk | VK | `vk-mark.png` |
| tiktok | TikTok | `tiktok-mark.png` |
| snapchat | Snapchat | `snapchat-mark.png` |
| vimeo | Vimeo | `vimeo-mark.png` |
| spotify | Spotify | `spotify-mark.png` |
| apple-podcasts | Apple Podcasts | `apple-podcasts-mark.png` |
| amazon-audible | Amazon / Audible | `amazon-audible-mark.png` |
| google-podcasts | Google Podcasts (legacy) | `google-podcasts-mark.png` |
| podbean | Podbean | `podbean-mark.png` |
| soundcloud | SoundCloud | `soundcloud-mark.png` |
| whatsapp | WhatsApp | `whatsapp-mark.png` |
| telegram | Telegram | `telegram-mark.png` |
| discord | Discord | `discord-mark.png` |
| slack | Slack | `slack-mark.png` |
| google-search | Google Search | `google-search-mark.png` |
| bing-search | Bing Search | `bing-search-mark.png` |
| ai-visibility | AI Visibility | `ai-visibility-mark.png` |
| api-ai-fed | API / AI-fed | `api-ai-fed-mark-light.png`, `api-ai-fed-mark-dark.png` |

### Still Lucide fallback (upload PNG to close gap)

| Channel ID | Label | Lucide | Brand color |
| --- | --- | --- | --- |
| webinar | Webinar | Video | `#0A0A0A` |
| meeting | Meeting | Users | `#004B8E` |
| ghost | Ghost | FileText | `#15171A` |
| facebook | Facebook | Facebook | `#1877F2` |
| threads | Threads | AtSign | `#000000` |
| youtube | YouTube | Youtube | `#FF0000` |
| email | Email | Mail | `#4A90A4` |
| youtube-search | YouTube Search | Search | `#FF0000` |
| podcast-directories | Podcast Directories | List | `#6B7280` |
| rss-feeds | RSS Feeds | Rss | `#F26522` |
| content-aggregators | Content Aggregators | Layers | `#6B7280` |

After adding a PNG, register the channel in `channelMarkAssets.ts` and bump `CHANNEL_MARK_ASSET_VERSION`.

## Key files

| File | Purpose |
| --- | --- |
| `data/channel-landing-pages.json` | Published portal copy per slug |
| `packages/booking-crm/src/constants/channelGroups.ts` | Labels, colors, Lucide names |
| `packages/booking-crm/src/channel-landing-pages/platformBrandSources.ts` | Brand URLs + scope |
| `packages/booking-crm/src/channel-landing-pages/channelMarkAssets.ts` | PNG path registry |
| `frontend/components/admin/AdminChannelMark.tsx` | Icon resolver (PNG → Lucide) |
| `frontend/public/images/logo/*` | Uploaded marks |
| Dashboard CTA editor | `/admin/dashboard/booking-crm/cta` |

## Handoff prompt (other CTA site)

Use the same slug table and naming rules. Already covered in this repo for the channels listed above. Still need official PNGs for: **webinar, meeting, ghost, facebook, threads, youtube, email, youtube-search, podcast-directories, rss-feeds, content-aggregators**.