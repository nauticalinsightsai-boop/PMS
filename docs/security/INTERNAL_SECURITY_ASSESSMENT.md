# PM Structure — Internal Security Assessment Report

---

## Confidentiality Notice

This document is classified **Internal Confidential** and is intended solely for authorized stakeholders of PM Structure and parties under a valid non-disclosure or customer due-diligence request. Unauthorized distribution, reproduction, or publication is prohibited. Recipients must not present this document as an independent third-party penetration test, accreditation letter, or compliance certification.

---

## Document Information

| Field | Value |
|-------|-------|
| **Project** | PM Structure (marketing site + admin dashboard + Supabase) |
| **Assessment Type** | Internal application security assessment (code review + remediation verification) |
| **Assessment Date** | 12 July 2026 |
| **Report Version** | 1.0 |
| **Assessment Status** | Complete — PASS WITH RESIDUAL RISK |
| **Assessor** | Cursor automated security review + engineer remediation |
| **Repository** | `https://github.com/nauticalinsightsai-boop/PMS.git` |
| **Classification** | Internal Confidential |
| **Codebase refs** | Hardening `ae7e68c`, wiring `1d0d537`, follow-up export/redirect/SVG fixes `50c6baf` |

**Document type:** Internal application security assessment (code review + remediation verification)

**Not:** A third-party penetration test, CREST/OSCP firm attestation, or legal certification

---

## 1. Executive Summary

An automated security review identified **critical** authentication and data-exposure issues. Those issues were remediated in code, and a Supabase RLS hardening migration was applied by the project owner.

A **retest** confirmed the primary criticals are closed in source. One remaining critical (unauthenticated interactions CSV export) was fixed during this assessment package, along with login open-redirect hardening and SVG upload leftovers.

### Verdict for internal use

**PASS WITH RESIDUAL RISK** — suitable as internal due diligence evidence that high-severity code defects were found, fixed, and rechecked.

### Verdict for external / sales / insurance / enterprise procurement

**NOT equivalent to a formal pentest clearance.** Buyers and auditors typically require an independent firm report + attestation letter. This document must not be presented as that.

### Executive Metrics

| Metric | Value (from this assessment only) |
|--------|-----------------------------------|
| Initial Critical Findings | 5 (C1–C5) |
| Additional Critical Found on Retest | 1 (C6) |
| Resolved Critical Findings | 6 (C1–C6) |
| Remaining Critical Findings | 0 |
| High Findings Identified | 4 (H1, H2 remediated; R1, R2 residual) |
| Medium Findings Identified | 5 (M1–M3 remediated; R3, R4 residual) |
| Overall Risk Before Remediation | Critical |
| Overall Risk After Remediation | Residual risk (High/Medium deferred items remain) |
| Assessment Result | **PASS WITH RESIDUAL RISK** |

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

## 3. Assessment Methodology

This Internal Security Assessment used a structured application-security review process appropriate for source-available web applications.

### Activities performed

| Activity | Description |
|----------|-------------|
| Static source-code review | Manual review of authentication, authorization, API, CMS, and rendering paths |
| Authentication flow review | Session cookies, Bearer tokens, demo login paths, signed session HMAC |
| Authorization review | Admin allowlists, mutation guards, IDOR checks on profile updates |
| API endpoint review | Admin, CMS, interactions, profile, checkout, and webhook routes |
| Supabase RLS review | Migration SQL, policy breadth, schema exposure, storage policies |
| Configuration review | `config.toml` schemas, env-gated demo login, media MIME allowlists |
| Manual remediation verification | Confirm fixes exist in source at cited files/commits |
| Regression verification | Retest of prior criticals after remediation; discovery of C6 and follow-up fixes |

### Explicitly not included

This assessment **DID NOT** include:

- Infrastructure testing (cloud console, host hardening, network segmentation)
- Production exploitation or live attack simulations against hosted systems
- Network scanning or vulnerability scanning as a paid/external service
- Social engineering
- Wireless testing
- Denial-of-service testing
- Independent firm penetration testing
- Compliance certification audits (ISO 27001, SOC 2, PCI DSS, HIPAA, CREST, OSCP, or similar)

---

## 4. Risk Rating Definitions

| Rating | Definition |
|--------|------------|
| **Critical** | Direct, high-impact exposure of privileged access or sensitive data with low attack complexity (e.g., unauthenticated admin/PII access). Immediate remediation required. |
| **High** | Significant confidentiality or integrity risk; exploitation may require limited conditions (e.g., misconfigured env, authenticated non-admin user, or client-only UI gate with strong API reliance). |
| **Medium** | Meaningful weakness that increases risk under specific conditions or improves attacker foothold; should be scheduled for remediation. |
| **Low** | Limited impact or primarily defense-in-depth / configuration hygiene. |
| **Informational** | Observation or process gap that does not itself constitute an exploitable defect (e.g., absence of a third-party pentest). |

---

## 5. Findings Timeline

### 5.1 Initial critical findings (remediated)

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

### 5.2 Retest — closed in code

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

### 5.3 Issues found on retest and fixed in this package

| ID | Severity | Finding | Fix |
|----|----------|---------|-----|
| C6 | Critical | `GET /api/interactions/export` dumped all form submissions with no auth | Added `requireInteractionAdmin` |
| M2 | Medium | Login `?next=//evil` open redirect | Reject `//`, schemes, backslashes |
| M3 | Medium | Bucket bootstrap / UI still allowed SVG | Removed SVG from ensure-bucket + file accept attrs |

### 5.4 Residual risks (accepted or deferred)

| ID | Severity | Item | Owner action |
|----|----------|------|--------------|
| R1 | High | Dashboard UI is client-gated; rely on API auth | Keep APIs locked; consider middleware session check later |
| R2 | High | `NEXT_PUBLIC_ALLOW_DEMO_LOGIN=true` enables demo passwords in UI | Ensure **unset** in production |
| R3 | Medium | Regex sanitizer ≠ DOMPurify | Consider isomorphic-dompurify later |
| R4 | Medium | Most JSON-LD scripts lack `</script>` escaping | Escape if CMS strings flow into them |
| R5 | Low | Live hosted “Exposed schemas” must exclude `dashboard_one` | Confirm in Supabase Dashboard settings |
| R6 | Info | Formal firm pentest not performed | Budget when required by enterprise deals |

---

## 6. Production Configuration Checklist (Owner)

Confirm on live project:

1. `AUTH_SESSION_SECRET` is set (signed admin sessions).
2. `NEXT_PUBLIC_ALLOW_DEMO_LOGIN` is **not** `true`.
3. Supabase **Exposed schemas** = `public`, `storage`, `graphql_public` only (no `dashboard_one`).
4. RLS migration `20260712120000_security_harden_rls.sql` applied (owner: done).
5. Unauthenticated `GET /api/interactions/export` returns **401** after deploy of this package.
6. Stripe webhook secret configured; webhook rejects unsigned payloads.

---

## 7. Attestation Language (Honest)

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

## 8. Security Standards Reference (Informational Only)

The following mappings are **informational guidance only**. This Internal Security Assessment does **not** constitute certification, attestation, or validated compliance against any of these frameworks.

| Reviewed area | Related guidance (informational) |
|---------------|----------------------------------|
| Authn / session integrity | OWASP ASVS (Authentication / Session Management) |
| Admin API access control / IDOR | OWASP API Security Top 10 (Broken Object Level Authorization, Broken Authentication) |
| Stored XSS / HTML rendering | OWASP Top 10 (Injection / XSS) |
| RLS / least-privilege data access | Principle of Least Privilege; OWASP ASVS (Access Control) |
| Sensitive export endpoints | OWASP API Security Top 10 (Security Misconfiguration / Excessive Data Exposure) |

**Explicit statement:** Reference to OWASP ASVS, OWASP API Security Top 10, OWASP Top 10, or least privilege does **not** imply ISO 27001, SOC 2, PCI DSS, HIPAA, CREST, OSCP, or any other compliance certification.

---

## 9. Security Improvement Roadmap

Recommendations only — derived from residual risks already documented in this report. Not a commitment schedule and not additional vulnerability claims.

| Priority | Recommendation | Related residual |
|----------|----------------|------------------|
| Near-term | Ensure `NEXT_PUBLIC_ALLOW_DEMO_LOGIN` remains unset in production | R2 |
| Near-term | Confirm hosted Supabase Exposed schemas exclude `dashboard_one` | R5 |
| Short-term | Add middleware (or equivalent) session checks for dashboard HTML routes | R1 |
| Short-term | Replace regex HTML sanitizer with a maintained library such as isomorphic-dompurify | R3 |
| Short-term | Apply `escapeJsonForScript` (or equivalent) to remaining JSON-LD components if CMS strings can flow in | R4 |
| Medium-term | Review Content-Security-Policy (CSP) and security headers on marketing + dashboard apps | Defense-in-depth |
| Annual / deal-driven | Commission an independent third-party penetration test when budget or enterprise procurement requires it | R6 |

---

## 10. Sign-off (Internal)

| Role | Name / process | Date |
|------|----------------|------|
| Assessment execution | Cursor security review agents + remediation commits | 12 Jul 2026 |
| Migration apply | Project owner (SQL Editor) | 12 Jul 2026 |
| Formal firm pentest | **Not commissioned** | — |

---

## Appendix A — Evidence References

| ID | Evidence | Reference |
|----|----------|-----------|
| E-01 | Authentication / RLS / XSS hardening commit | `ae7e68c` — *Harden critical auth, RLS, and CMS XSS surfaces.* |
| E-02 | Admin route protection & signed Bearer enforcement | Implemented under `dashboard/backend/app/api/admin/*` and `dashboard/backend/lib/auth/*` in E-01 |
| E-03 | RLS migration | `supabase/migrations/20260712120000_security_harden_rls.sql` (owner applied in SQL Editor, 12 Jul 2026) |
| E-04 | Export endpoint fix + open-redirect/SVG follow-ups | `50c6baf` — *Close residual export leak and publish internal security assessment.* |
| E-05 | Configuration review | `supabase/config.toml` schemas exclude `dashboard_one`; demo-login / session secret checklist in §6 |

Related non-security wiring commit retained for codebase context only: `1d0d537` — *Wire About, newsletter hub, and Settings CMS editors end-to-end.*

---

## Appendix B — Version History

| Version | Date | Summary | Author |
|---------|------|---------|--------|
| 1.0 | 12 July 2026 | Initial Internal Security Assessment Report: findings, remediations, retest, residual risks, and honest attestation language | Cursor security review + engineer remediation |

---

*End of Internal Security Assessment Report.*
