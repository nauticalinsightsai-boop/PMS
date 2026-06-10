/**
 * Count runtime PMP FAQ surface tags (after PMP_SURFACE_EXTRA_TAGS applied).
 * Invoked from faq-check.mjs via tsx.
 */
import { PMP_2026_FAQS } from '../../frontend/content/faq/pmp-2026-faqs.ts';

const surfaceRoutes = [
  '/pmp',
  '/pmp-faq',
  '/pmp-exam-2026',
  '/pmp-current-vs-new-exam',
  '/pmp-before-8-july-2026',
  '/pmp-after-9-july-2026',
  '/pmp-exam-timeline-2026',
  '/pmp-new-exam-domain-weighting',
  '/pmp-business-environment-domain',
  '/pmp-people-domain',
  '/pmp-process-domain',
  '/pmp-ai-sustainability-value-delivery',
  '/pmp-agile-hybrid-predictive',
  '/pmp-study-plan-2026',
  '/pmp-foundation',
  '/pmp-professional',
  '/pmp-mastery',
  '/pmp-readiness-diagnostic',
  '/pmp-scenario-practice',
  '/pmp-mock-exam',
  '/pmp-q-and-a-support',
  '/pmp-enrollment',
];

function countTags(route) {
  return PMP_2026_FAQS.filter(
    (f) =>
      f.relatedPage === route ||
      f.relatedCourse === route ||
      f.relatedPages?.includes(route),
  ).length;
}

let failed = false;
for (const route of surfaceRoutes) {
  const total = countTags(route);
  if (total < 5 || total > 10) {
    console.error(`faq-surface FAIL: ${route} has ${total} tags (expected 5–10)`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`faq-surface OK (${surfaceRoutes.length} routes, 5–10 tags each)`);
