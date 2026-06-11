# PM Structure. Topic Hubs Map

**Run:** 13 (Phase 12)  
**Route:** `/topics/[slug]`  
**Status:** 26 live (v2 Phase 12)

| Slug | H1 pattern | Status |
|------|------------|--------|
| `pmp-exam-preparation` | PMP exam preparation: knowledge hub | **live** |
| `pmp-exam-2026` | PMP exam 2026: knowledge hub | **live** |
| `pmp-readiness` | PMP readiness: knowledge hub | **live** |
| `pmp-scenario-practice` | PMP scenario practice: knowledge hub | **live** |
| `business-environment-domain` | Business Environment domain: knowledge hub | **live** |
| `value-delivery` | Value delivery: knowledge hub | **live** |
| `ai-in-project-management` | AI in project management: knowledge hub | **live** |
| `sustainability-in-project-management` | Sustainability in PM: knowledge hub | **live** |
| `agile-project-management` | Agile project management: knowledge hub | **live** |
| `hybrid-project-management` | Hybrid project management: knowledge hub | **live** |
| `project-governance` | Project governance: knowledge hub | **live** |
| `project-management-certification` | PM certification: knowledge hub | **live** |
| `risk-management` | Risk management: knowledge hub | **live** |
| `pmi-rmp-preparation` | PMI-RMP preparation: knowledge hub | **live** |
| `prince2-preparation` | PRINCE2 preparation: knowledge hub | **live** |
| `six-sigma-preparation` | Six Sigma preparation: knowledge hub | **live** |
| `exam-readiness` | Exam readiness: knowledge hub | **live** |
| `pmp-domain-weighting` | PMP domain weighting: knowledge hub | **live** |
| `pmp-people-domain` | PMP People domain: knowledge hub | **live** |
| `pmp-process-domain` | PMP Process domain: knowledge hub | **live** |
| `stakeholder-engagement` | Stakeholder engagement: knowledge hub | **live** |
| `project-delivery-readiness` | Project delivery readiness: knowledge hub | **live** |
| `mock-exam-review` | Mock exam review: knowledge hub | **live** |
| `pmp-study-plan` | PMP study plan: knowledge hub | **live** |
| `predictive-project-management` | Predictive project management: knowledge hub | **live** |
| `project-value-delivery` | Project value delivery: knowledge hub | **live** |

## Template (v2 Phase 12)

H2 sections: What is · Why it matters · How it appears in exam readiness · Viewpoint · Related PMP pages · Related questions · Related FAQs · Recommended next step · References

Helpers: `getPublishedTopicHubs()`, `getTopicFaqsForHub()`, `TOPIC_HUB_GROUPS` in `content/topics/index.ts`

## Schema

CollectionPage + ItemList + FAQPage (inline + `relatedFaqIds`) | published hubs only in sitemap