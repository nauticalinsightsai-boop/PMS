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

function read(rel) {
  return fs.readFileSync(path.join(frontend, rel), 'utf8');
}

function fail(msg) {
  console.error(`audit-analytics FAIL: ${msg}`);
  return false;
}

function walkTsFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileDirs: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkTsFiles(full, acc);
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

// Fix typo - use withFileTypes
function walkTsFilesFixed(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkTsFilesFixed(full, acc);
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
  check(
    !offlineCsv.startsWith('lead_id,') || !offlineCsv.includes(',region,'),
    'offline template must not use legacy region column header',
  );

  return ok;
}

function runGaLoaderChecks() {
  let ok = true;
  const check = (cond, msg) => {
    if (!cond) ok = fail(msg) && ok;
  };

  const ga = read('components/analytics/GoogleAnalytics.tsx');
  check(ga.includes('hasAnalyticsConsent'), 'GoogleAnalytics must gate on consent');
  check(ga.includes('@next/third-parties/google'), 'GoogleAnalytics must use @next/third-parties/google');
  check(!ga.includes('send_page_view: false'), 'Custom send_page_view:false snippet must be removed');
  check(fs.existsSync(path.join(frontend, 'lib/analytics/send-ga-event.ts')), 'send-ga-event util must exist');
  check(fs.existsSync(path.join(frontend, 'components/analytics/MetaPixel.tsx')), 'MetaPixel component must exist');
  const meta = read('components/analytics/MetaPixel.tsx');
  check(meta.includes('hasMarketingConsent'), 'MetaPixel must gate on marketing consent');
  check(fs.existsSync(path.join(frontend, 'app/api/meta/conversions/route.ts')), 'Meta CAPI route must exist');

  const rootLayout = read('app/layout.tsx');
  check(rootLayout.includes('MarketingPixels'), 'Root layout must mount MarketingPixels');

  const publicShell = read('components/PublicShell.tsx');
  check(!publicShell.includes('GoogleAnalytics'), 'PublicShell must not mount a second GA install');

  const portalShell = read('app/go/[channel]/PortalRegionShell.tsx');
  check(!portalShell.includes('GoogleAnalytics'), 'PortalRegionShell must not mount a second GA install');

  const nextConfigContent = fs.readFileSync(path.join(frontend, 'next.config.ts'), 'utf8');
  check(
    !nextConfigContent.includes('GTM-') || nextConfigContent.includes('NEXT_PUBLIC_GTM'),
    'next.config must not hardcode GTM container ID',
  );
  const appSrc = walkTsFilesFixed(path.join(frontend, 'app'));
  const compSrc = walkTsFilesFixed(path.join(frontend, 'components'));
  const libSrc = walkTsFilesFixed(path.join(frontend, 'lib'));
  const allFiles = [...appSrc, ...compSrc, ...libSrc];

  for (const file of allFiles) {
    const rel = path.relative(frontend, file).replace(/\\/g, '/');
    if (rel.includes('/analytics/') && rel.endsWith('GoogleAnalytics.tsx')) continue;
    if (rel.includes('/analytics/') && rel.endsWith('MetaPixel.tsx')) continue;
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
    'lib/analytics/send-ga-event.ts',
    'lib/analytics/track-persisted-lead.ts',
    'lib/analytics/consent-cleanup.ts',
  ];
  for (const mod of modules) {
    check(fs.existsSync(path.join(frontend, mod)), `missing ${mod}`);
  }

  const booking = read('lib/analytics/track-booking-click.ts');
  check(booking.includes("select_content"), 'booking CTA must use select_content');

  const events = read('lib/analytics/pms-events.ts');
  check(events.includes("GENERATE_LEAD: 'generate_lead'"), 'canonical lead event must exist');
  check(events.includes("BOOKING_CONFIRMED: 'booking_confirmed'"), 'canonical booking event must exist');
  check(!events.includes('pms_roadmap_form_submit'), 'legacy roadmap submit event must be removed');
  check(!events.includes('pms_booking_click'), 'legacy booking click event must be removed');

  return ok;
}

function runFormChecks() {
  let ok = true;
  const check = (cond, msg) => {
    if (!cond) ok = fail(msg) && ok;
  };
  const submitPublic = read('lib/interactions/submit-public.ts');
  check(
    submitPublic.includes('trackPersistedLeadSuccess'),
    'public submissions must use the shared persisted-lead tracker',
  );
  check(
    /res\.status\s*===\s*201[\s\S]*trackPersistedLeadSuccess/.test(submitPublic),
    'generate_lead must be owned by the authoritative 201 persistence boundary',
  );

  const publicLeadForms = [
    'components/conversion-recovery/BottomCtaRotator.tsx',
    'components/conversion-recovery/LeadRecoveryDialog.tsx',
    'components/forms/WaitlistForm.tsx',
    'components/forms/ScholarshipReviewForm.tsx',
    'components/forms/RegisterNowDialog.tsx',
    'components/forms/PmServiceAdvisoryLeadForm.tsx',
    'components/channel-landing/ChannelLandingPublicView.tsx',
    'components/forms/PmpRoadmapLeadForm.tsx',
    'components/forms/NewsletterSubscribeForm.tsx',
    'components/forms/NewsletterHeroSubscribeForm.tsx',
    'components/forms/MasteryConsultationForm.tsx',
    'components/forms/JoinWaitlistDialog.tsx',
    'components/forms/CommunityWaitlistForm.tsx',
    'components/RegisterModal.tsx',
    'components/pages/Contact.tsx',
    'components/seo/KeywordLeadPopup.tsx',
  ];
  for (const rel of publicLeadForms) {
    const source = read(rel);
    check(source.includes('submitPublicInteraction('), `${rel} must use submitPublicInteraction`);
    check(!/\btrackGenerateLead\s*\(/.test(source), `${rel} must not duplicate generate_lead`);
    check(
      !/\btrackPmpQualificationFormSubmit\s*\(/.test(source),
      `${rel} must not duplicate PMP submit conversions`,
    );
    check(
      !/\btrackRoadmapLeadSubmit\s*\(/.test(source),
      `${rel} must not use the legacy roadmap lead helper`,
    );
  }

  const bookingConfirmed = read('app/(site)/booking-confirmed/BookingConfirmedClient.tsx');
  check(
    bookingConfirmed.includes("trackGaEvent('booking_confirmed'"),
    'confirmed bookings must use booking_confirmed',
  );
  check(
    bookingConfirmed.includes('trackMetaSchedule'),
    'confirmed bookings must use Meta Schedule',
  );
  return ok;
}

function runRawGtagChecks() {
  let ok = true;
  const approved = new Set([
    'components/analytics/GoogleAnalytics.tsx',
    'components/analytics/MetaPixel.tsx',
    'lib/analytics/gtag.ts',
    'lib/analytics/send-ga-event.ts',
    'lib/analytics/meta-browser.ts',
  ]);
  const files = [
    ...walkTsFilesFixed(path.join(frontend, 'app')),
    ...walkTsFilesFixed(path.join(frontend, 'components')),
    ...walkTsFilesFixed(path.join(frontend, 'lib')),
  ];
  for (const file of files) {
    const rel = path.relative(frontend, file).replace(/\\/g, '/');
    if (approved.has(rel)) continue;
    const content = fs.readFileSync(file, 'utf8');
    if (/googletagmanager\.com\/gtag\/js/.test(content)) {
      ok = fail(`raw gtag.js loader in ${rel} — use MarketingPixels / @next/third-parties`) && ok;
    }
  }
  if (ok) console.log('audit-analytics raw gtag scan OK');
  return ok;
}

const docOk = runRepoDocChecks();
const gaOk = runGaLoaderChecks();
const modOk = runModuleChecks();
const formOk = runFormChecks();
const gtagOk = runRawGtagChecks();

if (docOk && gaOk && modOk && formOk && gtagOk) {
  console.log('audit-analytics OK');
  process.exit(0);
}
process.exit(1);
