/**
 * B03 analytics audit (read-only).
 * Usage: npm run seo:audit-analytics
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const frontend = path.join(root, 'frontend');
const docsInternal = path.join(root, 'docs/internal');

const APPROVED_GTAG_FILES = [
  'components/analytics/GoogleAnalytics.tsx',
  'lib/analytics/gtag.ts',
];

function read(rel) {
  return fs.readFileSync(path.join(frontend, rel), 'utf8');
}

function fail(msg) {
  console.error(`audit-analytics FAIL: ${msg}`);
  return false;
}

function walkTsFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkTsFiles(full, acc);
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

function runRepoDocChecks() {
  let ok = true;
  const check = (cond, msg) => {
    if (!cond) ok = fail(msg) && ok;
  };

  check(
    fs.existsSync(path.join(docsInternal, 'PMSTRUCTURE_ANALYTICS_CONVERSION_SYSTEM.md')),
    'PMSTRUCTURE_ANALYTICS_CONVERSION_SYSTEM.md must exist',
  );
  check(
    fs.existsSync(path.join(docsInternal, 'PMSTRUCTURE_GA4_GSC_REPORTING_QA.md')),
    'PMSTRUCTURE_GA4_GSC_REPORTING_QA.md must exist',
  );
  check(
    fs.existsSync(path.join(docsInternal, 'pmstructure-event-map.csv')),
    'pmstructure-event-map.csv must exist',
  );
  check(
    fs.existsSync(path.join(docsInternal, 'pmstructure-offline-conversion-template.csv')),
    'pmstructure-offline-conversion-template.csv must exist',
  );

  const offlineCsv = fs.readFileSync(
    path.join(docsInternal, 'pmstructure-offline-conversion-template.csv'),
    'utf8',
  );
  check(
    offlineCsv.includes('region_group'),
    'offline conversion template must use region_group column',
  );
  check(!offlineCsv.startsWith('lead_id,') || !offlineCsv.includes(',region,'), 'offline template must not use legacy region column header');

  return ok;
}

function runGaLoaderChecks() {
  let ok = true;
  const check = (cond, msg) => {
    if (!cond) ok = fail(msg) && ok;
  };

  const ga = read('components/analytics/GoogleAnalytics.tsx');
  check(ga.includes('hasAnalyticsConsent'), 'GoogleAnalytics must gate on consent');
  check(ga.includes('send_page_view: false'), 'GoogleAnalytics must disable auto page_view');
  check(ga.includes('trackPageView'), 'GoogleAnalytics must send manual SPA page_view');

  const nextConfigContent = fs.readFileSync(path.join(frontend, 'next.config.ts'), 'utf8');
  check(
    !nextConfigContent.includes('GTM-') || nextConfigContent.includes('NEXT_PUBLIC_GTM'),
    'next.config must not hardcode GTM container ID',
  );
  const appSrc = walkTsFiles(path.join(frontend, 'app'));
  const compSrc = walkTsFiles(path.join(frontend, 'components'));
  const libSrc = walkTsFiles(path.join(frontend, 'lib'));
  const allFiles = [...appSrc, ...compSrc, ...libSrc];

  for (const file of allFiles) {
    const rel = path.relative(frontend, file).replace(/\\/g, '/');
    if (rel.includes('/analytics/') && rel.endsWith('GoogleAnalytics.tsx')) continue;
    const content = fs.readFileSync(file, 'utf8');
    if (/googletagmanager\.com\/gtm\.js\?id=GTM-/.test(content)) {
      check(false, `GTM container loader found in ${rel} — direct GA4 only`);
    }
  }

  return ok;
}

function runModuleChecks() {
  let ok = true;
  const check = (cond, msg) => {
    if (!cond) ok = fail(msg) && ok;
  };

  const modules = [
    'lib/analytics/push-event.ts',
    'lib/analytics/track-roadmap-cta.ts',
    'lib/analytics/track-roadmap-lead.ts',
    'lib/analytics/track-booking-click.ts',
    'lib/analytics/track-contact-click.ts',
    'lib/analytics/track-purchase-once.ts',
    'lib/analytics/lead-tracking-context.ts',
  ];
  for (const mod of modules) {
    check(fs.existsSync(path.join(frontend, mod)), `${mod} must exist`);
  }

  const pushEvent = read('lib/analytics/push-event.ts');
  check(pushEvent.includes("'email'"), 'push-event.ts must strip PII keys (email)');
  check(pushEvent.includes('PII_KEYS'), 'push-event.ts must define PII denylist');

  return ok;
}

function runFormWiringChecks() {
  let ok = true;
  const check = (cond, msg) => {
    if (!cond) ok = fail(msg) && ok;
  };

  const roadmapForm = read('components/forms/PmpRoadmapLeadForm.tsx');
  check(
    /if \(res\.ok\)[\s\S]*trackRoadmapLeadSubmit/.test(roadmapForm),
    'PmpRoadmapLeadForm must call trackRoadmapLeadSubmit only after res.ok',
  );
  check(roadmapForm.includes('formStartedRef'), 'PmpRoadmapLeadForm must fire form start once');

  const newsletter = read('components/forms/NewsletterSubscribeForm.tsx');
  check(
    newsletter.includes('sign_up') || newsletter.includes("pushAnalyticsEvent('sign_up'"),
    'NewsletterSubscribeForm must fire sign_up on success',
  );

  const membershipSuccess = read('app/(site)/membership/checkout/success/page.tsx');
  check(
    membershipSuccess.includes('trackPurchaseOnce'),
    'membership checkout success must fire verified purchase',
  );

  const membershipCheckout = read('components/pages/MembershipCheckout.tsx');
  check(
    membershipCheckout.includes('BEGIN_CHECKOUT') || membershipCheckout.includes('begin_checkout'),
    'MembershipCheckout must fire begin_checkout',
  );

  const trackLead = read('lib/analytics/track-roadmap-lead.ts');
  check(trackLead.includes('region_group'), 'track-roadmap-lead must use region_group param');

  return ok;
}

function runRawGtagChecks() {
  let ok = true;
  const scanDirs = ['components', 'app', 'lib'];
  for (const dir of scanDirs) {
    for (const file of walkTsFiles(path.join(frontend, dir))) {
      const rel = path.relative(frontend, file).replace(/\\/g, '/');
      if (APPROVED_GTAG_FILES.some((a) => rel === a)) continue;
      const content = fs.readFileSync(file, 'utf8');
      if (/\bgtag\s*\(/.test(content) && !content.includes('window.gtag')) {
        ok = fail(`raw gtag( call in ${rel} — use pushAnalyticsEvent`) && ok;
      }
    }
  }
  if (ok) console.log('audit-analytics raw gtag scan OK');
  return ok;
}

const docOk = runRepoDocChecks();
const gaOk = runGaLoaderChecks();
const modOk = runModuleChecks();
const formOk = runFormWiringChecks();
const gtagOk = runRawGtagChecks();

if (docOk && gaOk && modOk && formOk && gtagOk) {
  console.log('audit-analytics repo checks OK');
} else {
  process.exit(1);
}

console.log('Tip: post-deploy use Tag Assistant + GA4 DebugView (see PMSTRUCTURE_GA4_GSC_REPORTING_QA.md)');
