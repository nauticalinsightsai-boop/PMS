# PM Structure — Redirect and Canonical Host Deployment Note

Internal only. Preferred public canonical host:

```txt
https://pmstructure.com
```

All variants must redirect permanently to this host with path and query string preserved.

---

## Required redirect behavior

| Source | Target |
|--------|--------|
| `http://pmstructure.com/*` | `https://pmstructure.com/*` |
| `http://www.pmstructure.com/*` | `https://pmstructure.com/*` |
| `https://www.pmstructure.com/*` | `https://pmstructure.com/*` |
| `https://pmstructure.com/*` | **200** (no redirect to www) |

Prefer **one-hop** redirects where the CDN allows it.

---

## In-repo enforcement (T-009)

1. **`frontend/middleware.ts`** — 301 to `https://pmstructure.com` when host is not apex or `x-forwarded-proto` is `http` (skips `localhost` and `*.vercel.app` previews).
2. **`frontend/next.config.ts`** — backup 301 when host is `www.pmstructure.com`.
3. **`frontend/config/pms-site.ts`** — `PMS_SITE_URL` from `NEXT_PUBLIC_SITE_URL` (default apex).
4. Canonical, sitemap, robots, Open Graph, and JSON-LD use `PMS_SITE_URL`.

---

## Vercel (marketing project) — operator checklist

1. **Domains**
   - Primary: `pmstructure.com`
   - Redirect alias: `www.pmstructure.com` → `pmstructure.com` (Vercel domain settings)
   - Enable HTTPS on both; Vercel terminates TLS and sets `x-forwarded-proto`

2. **Environment variable (required)**

   ```env
   NEXT_PUBLIC_SITE_URL=https://pmstructure.com
   ```

   Do **not** set this to `https://www.pmstructure.com`. Wrong value breaks canonical tags, sitemap, and schema at build time.

3. **Redeploy** after changing `NEXT_PUBLIC_*` (values are baked into the client bundle).

4. See also: [`docs/DEPLOYMENT_VERCEL.md`](../DEPLOYMENT_VERCEL.md)

---

## Post-deploy curl verification

```bash
curl -I http://pmstructure.com
curl -I http://www.pmstructure.com
curl -I https://www.pmstructure.com
curl -I https://pmstructure.com
curl -I "https://www.pmstructure.com/certifications/pmp?source=test"
```

**Expected**

- First three: `301` or `308` with `Location: https://pmstructure.com/...`
- Apex: `200` (or app response), not redirecting to www
- Path test: query string `source=test` preserved

---

## Search Console

Use one property aligned with the apex host (`https://pmstructure.com`) and submit:

```txt
https://pmstructure.com/sitemap.xml
```

Full checklist, submission log, and post-submit URL inspections: `PMSTRUCTURE_SEARCH_CONSOLE_SUBMISSION.md` (T-016).

---

Status: Internal only  
Last updated: 18 June 2026
