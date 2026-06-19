# PM Structure — 302 Redirect Audit

## Purpose

This document defines how PM Structure audits and fixes temporary redirects.

This is an internal technical SEO document. Do not publish it as a public page.

**Related docs:** [`PMSTRUCTURE_REDIRECT_DEPLOYMENT_NOTE.md`](PMSTRUCTURE_REDIRECT_DEPLOYMENT_NOTE.md) (T-009 canonical host), [`pmstructure-302-redirect-audit.csv`](pmstructure-302-redirect-audit.csv), [`PMSTRUCTURE_SITE_ARCHITECTURE.md`](PMSTRUCTURE_SITE_ARCHITECTURE.md) (T-032).

---

## Preferred Host

```txt
https://pmstructure.com
```

---

## Rule

Not every 302 is bad.

Temporary redirects are correct for temporary, dynamic, session-based, or editable flows.

Permanent redirects are required for canonical host enforcement, old URLs with permanent replacements, and stable moved content.

---

## Redirect Decision Table

| Redirect Type                     | Recommended Status                                 |
| --------------------------------- | -------------------------------------------------- |
| HTTP to HTTPS canonical redirect  | 301 or permanent framework redirect                |
| www to non-www canonical redirect | 301 or permanent framework redirect                |
| Old slug to new permanent page    | 301 or permanent framework redirect                |
| Login/auth redirect               | Usually 302/temporary                              |
| Checkout/payment/session redirect | Usually 302/temporary                              |
| Form success redirect             | Usually 302/temporary unless static                |
| `/go` marketing shortlink         | Usually 302 unless stable and approved             |
| A/B test or campaign redirect     | 302/temporary                                      |
| Maintenance redirect              | 302/temporary                                      |
| Spam/irrelevant old URL           | Leave 404 or consider 410, do not redirect blindly |

---

## In-repo redirect inventory (T-037)

| Layer | Location | Role |
| ----- | -------- | ---- |
| Middleware | `frontend/middleware.ts` + `frontend/lib/canonical-host.ts` | **301** to apex HTTPS (exempt localhost, Vercel/Railway previews) |
| Next.js config | `frontend/next.config.ts` | www backup, legacy slugs, admin entry, 89 `/go` slug aliases |
| App Router pages | `app/go/page.tsx`, `app/(site)/compare/page.tsx`, `app/(site)/store/page.tsx` | `permanentRedirect()` fallbacks aligned with config |
| Dev only | `scripts/dev-gateway.mjs` | Local **308** for `/login`, `/dashboard`, `/admin` |
| Checkout | Stripe API + client navigation | Session/dynamic — **do not convert** |

### T-037 code fix applied

| Source | Before | After | Reason |
| ------ | ------ | ----- | ------ |
| `/go` | **307** (`redirect()`) | **308** (`permanentRedirect()` + `next.config`) | Stable default portal entry |
| `/compare`, `/store` page fallbacks | **307** if config missed | **308** (`permanentRedirect()`) | Align with permanent config rules |

### Kept temporary (intentional)

| Source | Status | Reason |
| ------ | ------ | ------ |
| `/admin` → `/admin/login` | **307** (`permanent: false`) | Auth entry — not a permanent SEO move |
| Admin middleware CRM/CTA cleanup | **307** | Admin-only query/path normalization |
| Stripe checkout success/cancel | Provider **302/303** | Session/cart state |
| `/go/{channel}` external booking CTAs | Client navigation | Editable marketing destinations — not HTTP redirects |

---

## Canonical Redirects

These should be permanent:

```txt
http://pmstructure.com/* → https://pmstructure.com/*
http://www.pmstructure.com/* → https://pmstructure.com/*
https://www.pmstructure.com/* → https://pmstructure.com/*
```

Implemented in middleware (**301**) and `next.config.ts` www rule (**308**). Vercel domain settings should mirror www → apex.

---

## Quality Rules

A good permanent redirect:

1. Points to the closest relevant final page.
2. Avoids redirect chains.
3. Avoids redirect loops.
4. Preserves user intent.
5. Preserves useful query strings where relevant.
6. Does not redirect to homepage unless homepage is genuinely the best target.
7. Does not redirect to noindex/private/payment/thank-you pages.
8. Does not redirect to a 404.

---

## `/go` Rule

PM Structure `/go` routes may be used for marketing, analytics, external platforms, meetings, or campaign routing.

- **89 legacy slug aliases** → canonical `/go/{slug}` are **permanent (308)** — keep.
- **`/go` index** → `/go/website` is now **permanent (308)** after T-037.
- **Portal pages** render HTML; external booking links are in-page CTAs — do not HTTP-convert without owner approval.

---

## Sitemap rule

Old redirected URLs (`/compare`, `/store`, legacy `/go` slugs) are **not** in sitemap. Sitemap includes final canonical URLs only (`/certifications/compare`, canonical `/go/*` slugs).

---

## Validation

```bash
npm run seo:audit-redirects
npm run seo:audit-redirects -- --base=https://pmstructure.com
npm run seo:sitemap-check
npm run seo:canonical-check
npm run build -w @pms/frontend
```

---

## Manual Verification Commands

```bash
curl -IL http://pmstructure.com/
curl -IL http://www.pmstructure.com/
curl -IL https://www.pmstructure.com/
curl -IL https://pmstructure.com/
curl -IL https://pmstructure.com/go
curl -IL https://pmstructure.com/compare
curl -IL https://pmstructure.com/admin
curl -IL https://pmstructure.com/go/website-pages
```

**Expected after T-037 deploy:**

- `/go` → **308** → `/go/website` → **200**
- `/compare`, `/store`, `/privacy` → **308** → final target → **200**
- `/admin` → **307** → `/admin/login` (temporary — keep)
- HTTP/www variants → **301/308** → `https://pmstructure.com` → **200**
- One hop where possible; no loop

---

## Owner Inputs Required

| Input                             | Required For                     |
| --------------------------------- | -------------------------------- |
| Crawl redirect report             | Full 302 inventory               |
| Search Console data               | Prioritize redirect fixes        |
| Bing data                         | Prioritize redirect fixes        |
| Server/CDN logs                   | Identify live redirect hits      |
| Final canonical host              | Confirm non-www preferred        |
| `/go` destination policy          | Decide 301 vs 302 for shortlinks |
| Payment/booking flow confirmation | Avoid breaking dynamic redirects |
| Redirect map approval             | Prevent bad permanent redirects  |
| Live www DNS verification         | Confirm www → apex in production |

No Screaming Frog / Sitebulb / Ahrefs redirect export was found in repo at audit time.

---

## Follow-Up

After deployment:

1. Re-crawl site.
2. Export remaining 302s.
3. Confirm permanent redirects are no longer temporary.
4. Confirm valid temporary redirects are documented.
5. Confirm internal links point to final URLs.
6. Confirm sitemap includes only final canonical URLs.
7. Monitor Search Console for redirect/indexing issues.

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 18 June 2026
