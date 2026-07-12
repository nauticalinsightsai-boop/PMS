# PM Structure — Internal Security Assessment Report

**Document type:** Internal application security assessment (code review + remediation verification)  
**Not:** A third-party penetration test, CREST/OSCP firm attestation, or legal certification  
**Project:** PM Structure (marketing site + admin dashboard + Supabase)  
**Assessment date:** 12 July 2026  
**Assessor:** Cursor automated security review + engineer remediation  
**Codebase refs:** hardening `ae7e68c`, wiring `1d0d537`, follow-up export/redirect/SVG fixes (this report package)

---

## 1. Executive summary

An automated security review identified **critical** authentication and data-exposure issues. Those issues were remediated in code, and a Supabase RLS hardening migration was applied by the project owner.

A **retest** confirmed the primary criticals are closed in source. One remaining critical (unauthenticated interactions CSV export) was fixed during this assessment package, along with login open-redirect hardening and SVG upload leftovers.

**Verdict for internal use:**  
**PASS WITH RESIDUAL RISK** — suitable as internal due diligence evidence that high-severity code defects were found, fixed, and rechecked.  

**Verdict for external / sales / insurance / enterprise procurement:**  
**NOT equivalent to a formal pentest clearance.** Buyers and auditors typically require an independent firm report + attestation letter. This document must not be presented as that.

---

## 2. Scope

| In scope | Out of scope |
|----------|----------------|
| Dashboard backend/frontend auth & admin APIs | Physical security, social engineering |
| Public marketing site XSS / CMS HTML | Full infrastructure / cloud IAM review |
| Supabase RLS policies (as defined in repo SQL) | Live exploit against production without owner consent |
| Stripe webhook signature presence | Mobile apps, third-party SaaS configs |
| Storage upload MIME controls | Legal compliance (GDPR DPIA, etc.) |

**Method:** Static code review, auth-path tracing, SQL/RLS review, fix verification. No paid external scanner subscription; no independent firm staff.

---

## 3. Findings timeline

### 3.1 Initial critical findings (remediated)

| ID | Severity | Finding | Remediation |
|----|----------|---------|-------------|
| C1 | Critical | Unauthenticated `/api/admin/*` (orders, consultations, approve, etc.) | `requireAdminRoute` on all admin routes |
| C2 | Critical | Bearer tokens accepted unsigned JWT email decode | HMAC-only `verifySignedSessionToken` |
| C3 | Critical | Profile region IDOR via client `userId` | Bind upsert to `supabase.auth.getUser` JWT subject |
| C4 | Critical | `dashboard_one` exposed / no RLS | Migration + remove from Data API schemas; FORCE RLS |
| C5 | Critical | Authenticated-wide CMS / form PII RLS | Drop broad authenticated manage/read policies |
| H1 | High | Stored XSS via raw CMS HTML | `sanitizeArticleHtml` on public render |
| H2 | High | Authenticated storage writes / orders read | Migration drops policies; uploads via service-role APIs |
| M1 | Medium | Demo cookie treated as admin session | Demo cookies ignored for API auth |

### 3.2 Retest — closed in code

| Check | Result |
|-------|--------|
| Admin routes gated | Pass |
| Unsigned Bearer forgery path removed | Pass |
| Demo cookie ignored for API auth | Pass |
| Profile region JWT-bound | Pass |
| Article HTML sanitized | Pass |
| Media API rejects SVG | Pass |
| `config.toml` excludes `dashboard_one` | Pass |
| RLS harden migration present | Pass (owner confirmed applied in SQL Editor) |

### 3.3 Issues found on retest and fixed in this package

| ID | Severity | Finding | Fix |
|----|----------|---------|-----|
| C6 | Critical | `GET /api/interactions/export` dumped all form submissions with no auth | Added `requireInteractionAdmin` |
| M2 | Medium | Login `?next=//evil` open redirect | Reject `//`, schemes, backslashes |
| M3 | Medium | Bucket bootstrap / UI still allowed SVG | Removed SVG from ensure-bucket + file accept attrs |

### 3.4 Residual risks (accepted or deferred)

| ID | Severity | Item | Owner action |
|----|----------|------|--------------|
| R1 | High | Dashboard UI is client-gated; rely on API auth | Keep APIs locked; consider middleware session check later |
| R2 | High | `NEXT_PUBLIC_ALLOW_DEMO_LOGIN=true` enables demo passwords in UI | Ensure **unset** in production |
| R3 | Medium | Regex sanitizer ≠ DOMPurify | Consider isomorphic-dompurify later |
| R4 | Medium | Most JSON-LD scripts lack `</script>` escaping | Escape if CMS strings flow into them |
| R5 | Low | Live hosted “Exposed schemas” must exclude `dashboard_one` | Confirm in Supabase Dashboard settings |
| R6 | Info | Formal firm pentest not performed | Budget when required by enterprise deals |

---

## 4. Production configuration checklist (owner)

Confirm on live project:

1. `AUTH_SESSION_SECRET` is set (signed admin sessions).
2. `NEXT_PUBLIC_ALLOW_DEMO_LOGIN` is **not** `true`.
3. Supabase **Exposed schemas** = `public`, `storage`, `graphql_public` only (no `dashboard_one`).
4. RLS migration `20260712120000_security_harden_rls.sql` applied (owner: done).
5. Unauthenticated `GET /api/interactions/export` returns **401** after deploy of this package.
6. Stripe webhook secret configured; webhook rejects unsigned payloads.

---

## 5. Attestation language (honest)

### What this document asserts

The undersigned assessment process:

- Reviewed the PM Structure repository for common web/API/auth/RLS vulnerabilities.
- Documented critical findings.
- Verified remediation of those findings in source control.
- Retested and closed an additional critical export exposure.

### What this document does **not** assert

- It is **not** a formal penetration test by an independent accredited firm.
- It does **not** certify that the system is free of vulnerabilities.
- It does **not** replace SOC 2, ISO 27001, CREST, or customer security questionnaires that require third-party letters.
- It does **not** guarantee future security after new code is shipped.

### Suggested external wording (if asked)

> “We completed an internal application security review and remediation cycle in July 2026 covering auth, admin APIs, RLS, and XSS. Critical findings were fixed and retested in code. A formal third-party penetration test has not yet been commissioned.”

---

## 6. Sign-off (internal)

| Role | Name / process | Date |
|------|----------------|------|
| Assessment execution | Cursor security review agents + remediation commits | 12 Jul 2026 |
| Migration apply | Project owner (SQL Editor) | 12 Jul 2026 |
| Formal firm pentest | **Not commissioned** | — |

---

*End of internal security assessment report.*
