# PM Structure — Mixed Content / Insecure Content Audit

## Purpose

This document records PM Structure's mixed content and insecure URL rules.

This is an internal technical SEO and security document. Do not publish it as a public page.

**Related:** [`PMSTRUCTURE_REDIRECT_DEPLOYMENT_NOTE.md`](PMSTRUCTURE_REDIRECT_DEPLOYMENT_NOTE.md), [`PMSTRUCTURE_INDEXABILITY_SANDBOX_CHECK.md`](PMSTRUCTURE_INDEXABILITY_SANDBOX_CHECK.md), [`PMSTRUCTURE_TECHNICAL_HYGIENE.md`](PMSTRUCTURE_TECHNICAL_HYGIENE.md) (B09)

---

## Preferred Production Host

```txt
https://pmstructure.com
```

---

## Rule

Public HTTPS pages must not load resources through:

```txt
http://
```

This includes:

- images
- scripts
- stylesheets
- fonts
- iframes
- videos
- forms
- API endpoints
- metadata images
- schema URLs
- sitemap URLs
- robots sitemap references

**Not mixed content:** SVG namespace declarations such as `xmlns="http://www.w3.org/2000/svg"` (not a network request).

---

## Internal Link Rule

Use relative paths for normal internal links:

```txt
/certifications/pmp
/faq
/legal/privacy
```

Use absolute `https://pmstructure.com` only where required:

```txt
https://pmstructure.com/certifications/pmp
```

Do not use:

```txt
http://pmstructure.com
https://www.pmstructure.com
```

---

## Implementation (code)

| Item | Location |
| ---- | -------- |
| Site URL / metadata base | `frontend/config/pms-site.ts` → `PMS_SITE_URL` |
| Canonical host redirect | `frontend/middleware.ts`, `frontend/lib/canonical-host.ts` |
| Calendly URL hardening | `frontend/lib/calendly/host-allowlist.ts` (http → https) |
| Third-party scripts | GA4, Calendly widget, Stripe — all HTTPS in code |
| Repo audit | `npm run seo:audit-insecure-content` |
| Live audit | `npm run seo:audit-insecure-content -- --base=https://pmstructure.com` |

Dev-only `http://localhost:*` fallbacks in `site-config.ts`, `api-url.ts`, and backend checkout routes are intentional and not emitted on production builds when env is set correctly.

---

## Priority Pages to Test

```txt
https://pmstructure.com/
https://pmstructure.com/certifications
https://pmstructure.com/certifications/pmp
https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026
https://pmstructure.com/topics/pmp-exam-2026
https://pmstructure.com/faq
https://pmstructure.com/certifications/compare
https://pmstructure.com/community
https://pmstructure.com/membership
https://pmstructure.com/contact
```

---

## Manual Browser QA

After deployment:

1. Open Chrome.
2. Open DevTools.
3. Go to Console.
4. Visit each priority page.
5. Look for mixed content warnings.
6. Go to Network.
7. Filter by `http://`.
8. Confirm no insecure resources are loaded.
9. Confirm no resources are blocked as mixed content.
10. Confirm forms, CTAs, analytics, images, and embeds still work.

---

## Manual Curl / Search Checks

Search deployed HTML:

```bash
curl -L https://pmstructure.com/ | grep -E 'src="http://|href="http://|action="http://'
curl -L https://pmstructure.com/certifications/pmp | grep -E 'src="http://|href="http://'
curl -L https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026 | grep -E 'src="http://|href="http://'
curl -L https://pmstructure.com/robots.txt | grep -i "http://"
curl -L https://pmstructure.com/sitemap.xml | grep -i "http://"
```

Expected:

```txt
No insecure public asset URLs.
Robots/sitemap use https://pmstructure.com only.
```

Check headers:

```bash
curl -I https://pmstructure.com/
```

Expected:

```txt
HTTP 200
No redirect to www
HTTPS canonical host
```

Automated:

```bash
npm run seo:audit-insecure-content
npm run seo:audit-insecure-content -- --base=https://pmstructure.com
```

---

## Common Fixes

| Issue | Fix |
| ----- | --- |
| `http://pmstructure.com/page` | Use `/page` or `https://pmstructure.com/page` |
| `https://www.pmstructure.com/page` | Use `/page` or `https://pmstructure.com/page` |
| `http://calendly.com/...` in env | Use HTTPS; host-allowlist normalizes at runtime |
| `http://external.com/image.jpg` | Use HTTPS version if supported |
| HTTP provider does not support HTTPS | Replace provider or remove embed |
| `ws://` on production | Use `wss://` |
| HTTP form action | Use HTTPS endpoint |
| HTTP API endpoint | Use HTTPS endpoint |

---

## CSP / HSTS (document only)

- **Do not** use Content-Security-Policy or `upgrade-insecure-requests` as the only fix while source URLs remain HTTP.
- **Do not** add HSTS in the repo without owner approval.
- Optional hosting-level hardening: confirm with Railway/Vercel whether HSTS is already enabled at the edge.

---

## T-028 Agent Verification (18 June 2026)

| Check | Result |
| ----- | ------ |
| Live priority pages | No `src="http://` / `href="http://` asset patterns observed in Ask mode |
| Metadata / schema / sitemap / robots | Wired through `PMS_SITE_URL` (HTTPS apex) |
| Calendly allowlist | Hardened to normalize `http:` → `https:` |
| Repo audit script | `scripts/audit-insecure-content.mjs` added |

---

## Owner Inputs Required

| Input | Required For |
| ----- | ------------ |
| Hosting/CDN access | Fix redirects or headers if outside repo |
| Production environment variables | Confirm `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`, Calendly vars use `https://` |
| Railway/Vercel edge headers | Confirm whether HSTS is enabled (do not add blindly in repo) |
| Third-party provider access | Replace insecure embeds/scripts if any env misconfiguration found |
| Payment/scheduling provider confirmation | Avoid breaking checkout or booking after URL changes |
| Browser retest by Mahaa/developer | Confirm mixed content warnings are gone in Chrome DevTools |

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 18 June 2026
