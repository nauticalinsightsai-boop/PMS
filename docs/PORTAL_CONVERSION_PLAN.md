# Portal conversion & UX plan (Phase 7 — OPT-PORTAL)

Conversion-first redesign for all `/go/{channel}` public portals. See also [BOOKING_CRM_REPLICATION_MAP.md](./BOOKING_CRM_REPLICATION_MAP.md) and [booking-crm-platform-catalog.md](./booking-crm-platform-catalog.md).

## Goals

| Priority | Outcome |
|----------|---------|
| Primary | Calendly clicks on **free** `mentor-intro` (“Talk to a mentor”) |
| Secondary | Paid `career-pathway` (“Book pathway session”) |
| Explore | Pathway cards → main site (cohort dates, tuition, enrollment) |
| Quality | Booking notes cite channel evidence (webinar title, post URL, broadcast, etc.) |

## Brand & copy rules (all 42 slugs)

- **Hero brand:** Project Management Structure (`BRAND.fullName`) — not “PM Structure” as the headline product name.
- **Positioning:** Mentor-led certification preparation and career guidance.
- **Never in marketing copy:** “Independent” (Terms / legal only).
- **Remove from tier UI:** `Best for:` and `Outcome:` on public tier cards.
- **Rename globally:** “Clarity call” → Mentor intro / Free mentor intro.
- **Standard CTAs:** Free → Talk to a mentor; Paid → Book pathway session.

## Learner voices

- Story arc: website → pathway → mentor sessions → exam cleared → outcome.
- Attribution: **name** + **position** (not “Community member · study plan”).
- Curated quote bank in `portalLearnerCopy.ts`; optional channel clause inside quote only.

## Platform track record metrics (order)

1. Learners who cleared certifications — **1,284+** (`PLATFORM_LEARNERS_CLEARED`)
2. Issuing bodies covered — PMI · PRINCE2 · Six Sigma
3. Certification pathways — 55+ structured prep programs
4. Regional pricing — scholarship tiers by residence

## Tier model (template v4)

| Tier ID | Role | CTA |
|---------|------|-----|
| `mentor-intro` | Free on all channels | Talk to a mentor |
| `career-pathway` | Paid career / pathway depth | Book pathway session |
| `services-detail` | Paid services from website selection | Discuss services |

Tier 1 title: **Free Mentor Intro** (title case). Services are chosen on the main site, then discussed on tier 3.

## Section flow (implemented)

| Step | Block | Notes |
|------|--------|--------|
| 1 | Presence strip | Channel / site identity |
| 2 | Hero | Project Management Structure, Global learners, Store + Membership + region (once) |
| 3 | Context | One short paragraph; cite source |
| 4 | Webinar media | Webinar only |
| 5 | Trust | Secure calendar line |
| 6 | Explore certifications | PMP cards → main site (before tiers) |
| 7 | Session tiers | Free Mentor Intro + Career & Pathway + Services Discussion |
| 8 | Learner voices + metrics | Proof |
| 9 | FAQ | |
| 10 | Explore / Compare | Optional; end of page only; off by default in JSON |
| 11 | Final CTA | |

Removed: `PortalSiteChips`, hero card (website/webinar), hero “Talk to a mentor” when free tier exists.

Dashboard CTA admin: `http://localhost:3000/dashboard/booking-crm/cta` (no query params).

## Task IDs

| ID | Description |
|----|-------------|
| OPT-PORTAL-001 | Webinar section reorder + hide hero card |
| OPT-PORTAL-002 | Hero primary CTA button |
| OPT-PORTAL-003 | Hide bestFor/outcome on tier cards |
| OPT-PORTAL-004 | Trust row above tiers |
| OPT-PORTAL-005 | Soften free-tier spotlight styling |
| OPT-PORTAL-020–023 | Learner voices: name/title, curated quotes |
| OPT-PORTAL-024–026 | Metrics order + MAX_METRICS=4 |
| OPT-PORTAL-030–032 | Free mentor-intro all channels |
| OPT-PORTAL-040–043 | Remove services-detail tier |

## Validation

- [x] `/go/webinar` — video → 2 tiers → pathways → Calendly (code)
- [x] `/go/whatsapp` — human quotes with name + position (code)
- [x] Sample slugs — free intro; no View services tier (code + JSON migration)
- [x] Platform tab — 1,284+ cleared → issuing bodies → pathways
- [x] `portalConversionPacks.test.ts` passes

## Legal note

The **1,284+ learners who cleared certifications** metric is approved marketing copy for portals; keep aligned with homepage/network figures and pricing disclaimers.
