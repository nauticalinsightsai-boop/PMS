# Title / H1 Alignment Notes (Run 6)

Safe cases where `<title>` and visible H1 differ intentionally:

| Route | `<title>` (metadata) | H1 (SSR / visible) | Notes |
|-------|----------------------|--------------------|-------|
| `/` | PMP & project management exam prep | HOME_COPY.heroTitle (sr-only + visual mirror) | Brand line in H1; title is SERP keyword |
| `/faq` | FAQ — Certifications, Pricing & Support | Same (sr-only server H1) | Aligned |
| `/certifications` | Certification pathways | Find your pathway | Acceptable — title is nav label |
| `/membership` | Membership plans | Invest in Your Future Self | CMS may override hero |

**Rule:** Do not change CMS-driven hero titles to match metadata without content review. New pages should use `buildPageMetadata` with `title` matching H1 where possible.
