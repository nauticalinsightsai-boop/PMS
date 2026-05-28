# Booking CRM platform catalog (42 channels)

Public portals: `http://localhost:3000/go/{slug}` (production: `https://www.pmstructure.com/go/{slug}`).

| Category | Channel ID | Public slug | Notes |
|----------|------------|-------------|-------|
| Owned | website | website | Primary site |
| Owned | webinar | webinar | |
| Social | linkedin | linkedin | |
| Social | facebook | facebook | |
| Social | instagram | instagram | |
| Social | x | x | Alias: `twitter` |
| Social | youtube | youtube | |
| Social | tiktok | tiktok | |
| Social | pinterest | pinterest | |
| Social | bluesky | bluesky | |
| Social | threads | threads | |
| Social | mastodon | mastodon | |
| Social | vk | vk | Added in PMS seed migration |
| Community | discord | discord | |
| Community | slack | slack | |
| Community | telegram | telegram | |
| Community | whatsapp | whatsapp | |
| Publishing | medium | medium | |
| Publishing | substack | substack | |
| Publishing | beehiiv | beehiiv | |
| Publishing | ghost | ghost | |
| Publishing | notion | notion | Alias: `notion-public` |
| Podcast | spotify | spotify | |
| Podcast | apple-podcasts | apple-podcasts | |
| Podcast | google-podcasts | google-podcasts | |
| Podcast | amazon-audible | amazon-audible | |
| Podcast | podbean | podbean | |
| Search | google-search | google-search | |
| Search | bing-search | bing-search | |
| Search | ai-visibility | ai-visibility | |
| Search | podcast-directories | podcast-directories | |
| Professional | github | github | |
| Professional | gitlab | gitlab | |
| Professional | behance | behance | |
| Professional | dribbble | dribbble | |
| Ads | google-ads | google-ads | |
| Ads | meta-ads | meta-ads | |
| Ads | linkedin-ads | linkedin-ads | |
| Partner | partner-referral | partner-referral | |
| Partner | affiliate | affiliate | |
| Partner | event | event | |
| Other | custom | custom | Admin-created channels |

**Slug aliases:** `twitter` → `x`, `notion-public` → `notion` (see `CHANNEL_PUBLIC_SLUG` in `@pms/booking-crm`).

**Default portal template (v2):** PMP + PMI-RMP featured cards, three tiers (`mentor-intro`, `career-pathway`, `services-detail`), Community / Membership / Store chips.
