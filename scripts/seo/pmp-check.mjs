/**

 * Verify PMP cluster, course, and service routes exist and are in sitemap.

 */

import fs from 'fs';

import path from 'path';

import { fileURLToPath } from 'url';



const __dirname = path.dirname(fileURLToPath(import.meta.url));

const root = path.join(__dirname, '../..');

const siteApp = path.join(root, 'frontend/app/(site)');



const clusterRoutes = [

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

];



const pathwayRoutes = [

  '/pmp-foundation',

  '/pmp-professional',

  '/pmp-mastery',

  '/pmp-readiness-diagnostic',

  '/pmp-scenario-practice',

  '/pmp-mock-exam',

  '/pmp-q-and-a-support',

  '/pmp-enrollment',

];



const expected = [...clusterRoutes, ...pathwayRoutes];



let failed = false;



for (const route of expected) {

  const segment = route.slice(1);

  const pagePath =

    segment === 'pmp'

      ? path.join(siteApp, 'pmp', 'page.tsx')

      : path.join(siteApp, segment, 'page.tsx');

  if (!fs.existsSync(pagePath)) {

    console.error(`pmp-check FAIL: missing page for ${route} at ${pagePath}`);

    failed = true;

  }

}



const sitemap = fs.readFileSync(path.join(root, 'frontend/app/sitemap.ts'), 'utf8');

if (!sitemap.includes('PMP_CLUSTER_PATHS')) {

  console.error('pmp-check FAIL: sitemap.ts missing PMP_CLUSTER_PATHS');

  failed = true;

}

if (!sitemap.includes('PMP_COURSE_PATHS')) {

  console.error('pmp-check FAIL: sitemap.ts missing PMP_COURSE_PATHS');

  failed = true;

}

if (!sitemap.includes('PMP_SERVICE_PATHS')) {

  console.error('pmp-check FAIL: sitemap.ts missing PMP_SERVICE_PATHS');

  failed = true;

}



if (failed) process.exit(1);

console.log(`pmp-check OK (${expected.length} routes)`);

