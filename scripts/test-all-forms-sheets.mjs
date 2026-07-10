#!/usr/bin/env node
/**
 * Post one lead per public marketing form source/formId and report Sheets sync.
 *
 * Usage:
 *   node scripts/test-all-forms-sheets.mjs
 *   node scripts/test-all-forms-sheets.mjs --base=https://pmstructure.com
 *   node scripts/test-all-forms-sheets.mjs --base=http://localhost:3050
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const evidenceDir = path.join(root, 'docs/internal/evidence');

const baseArg = process.argv.find((a) => a.startsWith('--base='));
const base = (baseArg?.slice(7) ?? 'https://pmstructure.com').replace(/\/$/, '');
const stamp = Date.now();
const day = new Date().toISOString().slice(0, 10);
const testEmail = `forms-audit+${stamp}@pmstructure.com`;

/** One case per distinct marketing form path that uses POST /api/interactions. */
const cases = [
  {
    name: 'keyword_lead_popup',
    component: 'KeywordLeadPopup',
    body: {
      source: 'pmp_roadmap_lead',
      subject: `Audit: keyword lead popup ${stamp}`,
      email: testEmail,
      payload: {
        formId: 'keyword_lead_popup',
        formLabel: 'Keyword lead popup',
        placement: 'keyword_lead_popup',
        pagePath: '/certifications/pmp',
        fullName: 'Forms Audit',
        phoneFull: '+971 50 000 0001',
        jobExperienceYears: '3-5',
        fromSlug: 'pmp-certification-uae',
        keyword: 'pmp certification uae',
      },
    },
  },
  {
    name: 'pmp_roadmap_lead',
    component: 'PmpRoadmapLeadForm (home/PMP)',
    body: {
      source: 'pmp_roadmap_lead',
      subject: `Audit: PMP roadmap ${stamp}`,
      email: testEmail,
      payload: {
        formId: 'pmp_roadmap_lead',
        formLabel: 'PMP roadmap',
        placement: 'audit',
        pagePath: '/',
        fullName: 'Forms Audit',
        phoneFull: '+971 50 000 0002',
        jobExperienceYears: '5-10',
        siteCertId: 'pmp',
        certName: 'PMP',
      },
    },
  },
  {
    name: 'cert_roadmap_lead',
    component: 'PmpRoadmapLeadForm (cert page)',
    body: {
      source: 'cert_roadmap_lead',
      subject: `Audit: cert roadmap ${stamp}`,
      email: testEmail,
      payload: {
        formId: 'cert_roadmap_lead',
        formLabel: 'Certification roadmap',
        placement: 'audit',
        pagePath: '/certifications/pmp',
        fullName: 'Forms Audit',
        phoneFull: '+971 50 000 0003',
        jobExperienceYears: 'under-3',
        siteCertId: 'pmp',
        certName: 'PMP',
      },
    },
  },
  {
    name: 'contact_page',
    component: 'Contact',
    body: {
      source: 'contact',
      subject: `Audit: contact ${stamp}`,
      email: testEmail,
      payload: {
        formId: 'contact_page',
        formLabel: 'Contact page',
        placement: 'audit',
        pagePath: '/contact',
        fullName: 'Forms Audit',
        message: 'Connectivity audit',
      },
    },
  },
  {
    name: 'newsletter_hero_signup',
    component: 'NewsletterHeroSubscribeForm',
    body: {
      source: 'subscription',
      subject: `Audit: newsletter hero ${stamp}`,
      email: testEmail,
      payload: {
        formId: 'newsletter_hero_signup',
        formLabel: 'Newsletter hero signup',
        placement: 'audit',
        pagePath: '/newsletter',
        fullName: 'Forms Audit',
      },
    },
  },
  {
    name: 'newsletter_subscribe',
    component: 'NewsletterSubscribeForm',
    body: {
      source: 'subscription',
      subject: `Audit: newsletter subscribe ${stamp}`,
      email: testEmail,
      payload: {
        formId: 'newsletter_footer_subscribe',
        formLabel: 'Newsletter subscribe',
        placement: 'audit',
        pagePath: '/newsletter',
      },
    },
  },
  {
    name: 'community_waitlist',
    component: 'CommunityWaitlistForm',
    body: {
      source: 'waitlist',
      subject: `Audit: community waitlist ${stamp}`,
      email: testEmail,
      payload: {
        formId: 'community_waitlist',
        formLabel: 'Community waitlist',
        placement: 'audit',
        pagePath: '/community',
        fullName: 'Forms Audit',
        phoneFull: '+971 50 000 0004',
      },
    },
  },
  {
    name: 'pathway_waitlist',
    component: 'JoinWaitlistDialog / WaitlistForm',
    body: {
      source: 'waitlist',
      subject: `Audit: pathway waitlist ${stamp}`,
      email: testEmail,
      payload: {
        formId: 'pathway_waitlist',
        formLabel: 'Pathway waitlist',
        placement: 'audit',
        pagePath: '/certifications/pmp',
        fullName: 'Forms Audit',
        phoneFull: '+971 50 000 0005',
        offeringId: 'pmp-foundation',
      },
    },
  },
  {
    name: 'store_product_waitlist',
    component: 'JoinWaitlistDialog (store)',
    body: {
      source: 'waitlist',
      subject: `Audit: store waitlist ${stamp}`,
      email: testEmail,
      payload: {
        formId: 'store_product_waitlist',
        formLabel: 'Store product waitlist',
        placement: 'audit',
        pagePath: '/store',
        fullName: 'Forms Audit',
        phoneFull: '+971 50 000 0006',
      },
    },
  },
  {
    name: 'pm_service_advisory',
    component: 'PmServiceAdvisoryLeadForm',
    body: {
      source: 'consultation',
      subject: `Audit: PM service advisory ${stamp}`,
      email: testEmail,
      payload: {
        formId: 'pm_service_advisory',
        formLabel: 'PM service advisory',
        placement: 'audit',
        pagePath: '/pm-service',
        fullName: 'Forms Audit',
        phoneFull: '+971 50 000 0007',
      },
    },
  },
  {
    name: 'mastery_consultation',
    component: 'MasteryConsultationForm',
    body: {
      source: 'consultation',
      subject: `Audit: mastery consultation ${stamp}`,
      email: testEmail,
      payload: {
        formId: 'mastery_consultation',
        formLabel: 'Mastery consultation',
        placement: 'audit',
        pagePath: '/certifications/pmp',
        fullName: 'Forms Audit',
        offeringId: 'pmp-mastery',
      },
    },
  },
  {
    name: 'register_modal',
    component: 'RegisterModal / RegisterNowDialog',
    body: {
      source: 'register_modal',
      subject: `Audit: register modal ${stamp}`,
      email: testEmail,
      payload: {
        formId: 'community_event_register',
        formLabel: 'Community event register',
        placement: 'audit',
        pagePath: '/community',
        fullName: 'Forms Audit',
        phoneFull: '+971 50 000 0008',
      },
    },
  },
  {
    name: 'scholarship_review',
    component: 'ScholarshipReviewForm',
    body: {
      source: 'scholarship_review',
      subject: `Audit: scholarship review ${stamp}`,
      email: testEmail,
      payload: {
        formId: 'scholarship_review',
        formLabel: 'Scholarship review',
        placement: 'audit',
        pagePath: '/certifications/pmp',
        notes: 'Connectivity audit',
      },
    },
  },
  {
    name: 'lead_recovery',
    component: 'LeadRecoveryDialog / BottomCtaRotator',
    body: {
      source: 'lead_recovery',
      subject: `Audit: lead recovery ${stamp}`,
      email: testEmail,
      payload: {
        formId: 'lead_recovery',
        formLabel: 'Lead recovery',
        placement: 'audit',
        pagePath: '/',
        fullName: 'Forms Audit',
        phoneFull: '+971 50 000 0009',
      },
    },
  },
  {
    name: 'channel_landing',
    component: 'ChannelLandingPublicView',
    body: {
      source: 'contact',
      subject: `Audit: channel landing ${stamp}`,
      email: testEmail,
      payload: {
        formId: 'channel_landing',
        formLabel: 'Channel landing',
        placement: 'audit',
        pagePath: '/go/linkedin',
        fullName: 'Forms Audit',
        message: 'Connectivity audit',
      },
    },
  },
];

/** Not Sheets-backed lead forms (payment / Stripe). */
const excluded = [
  {
    name: 'CheckoutForm',
    reason: 'Stripe checkout session — not a lead form; no /api/interactions',
  },
  {
    name: 'ProgramEnrollmentForm / StripeEmbeddedSeatCheckout',
    reason: 'Stripe seat deposit / tuition — payment pipeline, not Sheets leads',
  },
];

const results = [];

async function post(caseDef) {
  const res = await fetch(`${base}/api/interactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: base },
    body: JSON.stringify({
      ...caseDef.body,
      website: '',
      company: '',
      metadata: { clientSubmittedAt: new Date().toISOString(), audit: 'test-all-forms-sheets' },
    }),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

console.log(`test-all-forms-sheets: ${base}`);
console.log(`test email: ${testEmail}`);
console.log('Note: production rate-limits ~12 POSTs / 15 min / IP — spacing requests.\n');

for (let i = 0; i < cases.length; i++) {
  const c = cases[i];
  if (i > 0) {
    // Stay under production limit (12 / 15 min / IP) when running large batches.
    await new Promise((r) => setTimeout(r, i % 12 === 0 ? 16 * 60 * 1000 : 3000));
  }
  try {
    const { status, json } = await post(c);
    const ok = status === 201 && (json.success === true || Boolean(json.id));
    const sheets =
      json.sheetsSynced === true
        ? 'synced'
        : json.sheetsSyncPending === true
          ? 'pending'
          : json.sheetsWarning
            ? `warn:${String(json.sheetsWarning).slice(0, 80)}`
            : 'NOT_CONFIGURED';
    const detail = ok
      ? `id=${json.id ?? 'n/a'} sheets=${sheets}`
      : JSON.stringify(json).slice(0, 200);
    results.push({
      form: c.name,
      component: c.component,
      ok,
      status,
      sheets,
      sheetsSynced: json.sheetsSynced === true,
      sheetsSyncPending: json.sheetsSyncPending === true,
      id: json.id ?? null,
      detail,
    });
    console.log(`${ok ? 'OK' : 'FAIL'}  ${c.name.padEnd(28)} HTTP ${status}  ${detail}`);
  } catch (err) {
    results.push({ form: c.name, component: c.component, ok: false, error: err.message });
    console.log(`FAIL  ${c.name.padEnd(28)} ${err.message}`);
  }
}

const passed = results.filter((r) => r.ok);
const failed = results.filter((r) => !r.ok);
const sheetsOk = results.filter((r) => r.sheetsSynced || r.sheetsSyncPending);
const sheetsMissing = results.filter((r) => r.ok && !r.sheetsSynced && !r.sheetsSyncPending);

console.log('\n--- excluded (not lead→Sheets) ---');
for (const e of excluded) {
  console.log(`SKIP  ${e.name}: ${e.reason}`);
}

console.log('\n--- summary ---');
console.log(`API accepted: ${passed.length}/${results.length}`);
console.log(`Sheets synced or pending: ${sheetsOk.length}/${results.length}`);
if (sheetsMissing.length) {
  console.log(`Sheets NOT configured for: ${sheetsMissing.map((r) => r.form).join(', ')}`);
}
if (failed.length) {
  console.log(`Failed: ${failed.map((r) => r.form).join(', ')}`);
}

const outPath = path.join(evidenceDir, `forms-sheets-audit-${day}.json`);
fs.mkdirSync(evidenceDir, { recursive: true });
fs.writeFileSync(
  outPath,
  JSON.stringify(
    {
      base,
      testEmail,
      capturedAt: new Date().toISOString(),
      results,
      excluded,
      summary: {
        accepted: passed.length,
        total: results.length,
        sheetsOk: sheetsOk.length,
        sheetsMissing: sheetsMissing.map((r) => r.form),
        failed: failed.map((r) => r.form),
      },
    },
    null,
    2,
  ),
);
console.log(`\nWrote ${path.relative(root, outPath)}`);

process.exit(failed.length ? 1 : 0);
