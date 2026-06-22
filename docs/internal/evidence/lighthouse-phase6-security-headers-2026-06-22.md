# Phase 6 — Security headers (p6-04)

**Shipped in** `frontend/next.config.ts` (2026-06-22):

| Header | Value |
|--------|--------|
| Strict-Transport-Security | `max-age=31536000; includeSubDomains; preload` |
| X-Frame-Options | `SAMEORIGIN` |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Cross-Origin-Opener-Policy | `same-origin-allow-popups` (Calendly popups) |
| Permissions-Policy | `camera=(), microphone=(), geolocation=()` |

## Deferred to Cloudflare edge (optional hardening)

- Content-Security-Policy enforcement (requires allowlist for GA, Calendly, Stripe, Supabase)
- Trusted Types
- COEP / CORP if third-party embeds break

Verify post-deploy: `curl -sI https://pmstructure.com/ | grep -i strict-transport`
