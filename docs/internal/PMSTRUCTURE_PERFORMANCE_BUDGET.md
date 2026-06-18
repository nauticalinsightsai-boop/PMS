# PM Structure — Performance Budget

## Purpose

This document defines the performance budget for PM Structure's public website.

The first commercial funnel is the PMP 2026 Readiness Pathway. Performance improvements should prioritize pages that affect roadmap requests, lead capture, trust, and SEO/AEO/GEO visibility.

This is an internal technical document. Do not publish it as a public page.

---

## Priority Pages

| Page Type                      | Target                                     |
| ------------------------------ | ------------------------------------------ |
| Homepage                       | Fastest possible, primary conversion entry |
| PMP 2026 / PMP page            | Fastest possible, primary commercial page  |
| Roadmap / lead form page       | Fastest possible, conversion-critical      |
| PMP 2026 answer pages          | Fast, SEO/AEO/GEO-critical                 |
| Certification hub              | Fast, navigation and comparison            |
| FAQ page                       | Fast, trust and AI visibility              |
| Community / membership / store | Secondary priority unless used in campaign |

---

## Performance Targets

| Metric                         |                              Internal Target | Minimum Acceptable |
| ------------------------------ | -------------------------------------------: | -----------------: |
| Largest Contentful Paint       | 1.9s on key conversion pages where practical |               2.5s |
| Interaction to Next Paint      |                                200ms or less |              200ms |
| Cumulative Layout Shift        |                                  0.1 or less |                0.1 |
| Mobile Lighthouse Performance  |                                          90+ |                80+ |
| Desktop Lighthouse Performance |                                          95+ |                90+ |

---

## Implementation Rules

1. Optimize the homepage and PMP 2026 page before lower-priority pages.
2. Optimize the real LCP element, not random assets.
3. Use responsive image sizes.
4. Lazy-load below-fold media.
5. Preload only the real above-fold critical image and critical font.
6. Avoid duplicate analytics scripts.
7. Do not load chat, calendar, video, or heavy embeds globally unless required.
8. Keep lead forms and CTAs working.
9. Preserve SEO metadata, canonical tags, schema, sitemap, and robots rules.
10. Do not sacrifice trust/compliance copy for speed unless layout can be improved safely.

---

## Review Cadence

Review performance after every major homepage, PMP page, image, analytics, or third-party script change.

Owner: Developer
Marketing owner: Mahaa
Business owner: Sheikh M. Abdullah
Last updated: 18 June 2026
