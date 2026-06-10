/**
 * Mark completed implementation todos in the Cursor master plan.
 * Usage: node scripts/seo/mark-plan-todos.mjs
 */
import fs from 'fs';

const planPath = 'c:/Users/Sh3ik/.cursor/plans/seo_aeo_master_docs_37e5bd87.plan.md';
let s = fs.readFileSync(planPath, 'utf8').replace(/\r\n/g, '\n');

const completePrefixes = [
  'pmp8-',
  'pmp9-',
  'faq10-',
  'ans11-',
  'topic12-',
  'reg13-',
  'conv14-',
  'legal15-',
];

const completeIds = new Set([
  'doc-13-conversion-flows',
  'doc-14-regional-pricing',
  'doc-15-legal-compliance',
  'val16-00-read-docs',
  'val16-01-seo-audit',
  'val16-02-render-check',
  'val16-03-noindex-check',
  'val16-04-faq-check',
  'val16-05-internal-links',
  'val16-06-course-check',
  'val16-07-pmp-check',
  'val16-08-seo-all',
  'val16-09-ci-integration',
  'val16-10-doc',
  'deploy17-02-pre-seo-all',
  'doc-13-conversion-flows',
  'doc-17-deployment',
  'doc-18-gsc-bing',
  'doc-19-ai-testing',
  'deploy17-00-read-docs',
  'deploy17-04-pre-sitemap',
  'deploy17-05-pre-schema-ai',
  'deploy17-06-pre-noindex',
  'deploy17-09-doc',
  'gsc18-00-read-docs',
  'gsc18-01-gsc-properties',
  'gsc18-06-gate-warning',
  'gsc18-07-doc',
  'aitest19-00-read-docs',
  'aitest19-01-sheet',
  'aitest19-02-pmp-queries',
  'aitest19-03-platforms',
  'aitest19-04-tracking-columns',
  'head-02-homepage',
  'schema-13-homepage-webpage',
  'schema-14-homepage-bundle',
  'schema-15-about-page',
  'schema-16-webpage-helper',
  'schema-17-refactor-course',
  'schema-18-course-cert-pages',
  'schema-19-course-no-lms',
  'schema-20-course-no-invent',
  'schema-21-course-pmp-todo',
  'val16-11-report',
  'deploy17-10-report',
  'idx-02-shared-helper',
  'idx-03-public-index',
  'idx-04-private-noindex',
  'idx-05-payment-noindex',
  'idx-06-sitemap-filter',
  'idx-07-robots-txt',
  'idx-08-indexing-matrix-doc',
  'smap-02-shared-helpers',
  'smap-04-robots',
  'smap-05-validation',
  'canon-02-helper',
  'canon-03-integrate-metadata',
  'canon-06-sitemap-sync',
  'canon-07-validation',
  'impl-01-root-cause',
  'impl-02-refactor-gate',
  'impl-05-fallback-defaults',
  'impl-06-homepage-ssr',
  'impl-10-validate',
]);

let count = 0;
s = s.replace(
  /^  - id: ([\w-]+)\n    content:([\s\S]*?)\n    status: (pending|in_progress)/gm,
  (m, id, content, status) => {
    const should =
      completePrefixes.some((p) => id.startsWith(p)) || completeIds.has(id);
    if (should && status !== 'completed') {
      count++;
      return `  - id: ${id}\n    content:${content}\n    status: completed`;
    }
    return m;
  },
);

fs.writeFileSync(planPath, s.replace(/\n/g, '\r\n'));
console.log(`Marked ${count} todos completed in master plan`);
