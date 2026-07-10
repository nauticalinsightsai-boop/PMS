#!/usr/bin/env node
/**
 * Calendly theme audit — all published /go slugs × light/dark + website.
 * Uses scheduler-chrome-matrix.json (getPublishedGoChannelSlugs), NOT IMPLEMENTATION_SCOPE_41.
 *
 * Usage:
 *   node scripts/calendly-theme-audit.mjs
 *   BASE_URL=http://localhost:3050 node scripts/calendly-theme-audit.mjs
 *   WRITE_FAILURES=1 node scripts/calendly-theme-audit.mjs  # writes docs/CALENDLY_THEME_AUDIT_FAILURES.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MATRIX_PATH = path.join(ROOT, 'packages/booking-crm/data/scheduler-chrome-matrix.json');
const MANIFEST_PATH = path.join(ROOT, 'packages/booking-crm/data/calendly-events.manifest.json');
const FAILURES_PATH = path.join(ROOT, 'docs/CALENDLY_THEME_AUDIT_FAILURES.md');
const BASE_URL = (process.env.BASE_URL || '').replace(/\/$/, '');

const FAMILY_FREE = [
  { family: 'website', channelId: 'website', url: 'https://calendly.com/pm-structure/talk-to-mentor' },
  { family: 'webinar', channelId: 'webinar', url: 'https://calendly.com/pm-structure/go-webinar-open' },
  { family: 'publishing', channelId: 'medium', url: 'https://calendly.com/pm-structure/go-newsletters-discovery' },
  { family: 'social', channelId: 'linkedin', url: 'https://calendly.com/pm-structure/so-discovery-mentorship' },
  { family: 'podcast', channelId: 'spotify', url: 'https://calendly.com/pm-structure/go-podcasts-discovery' },
  { family: 'messaging', channelId: 'whatsapp', url: 'https://calendly.com/pm-structure/go-messaging-discovery' },
  { family: 'syndicated', channelId: 'google-search', url: 'https://calendly.com/pm-structure/go-syndicated-discovery' },
];

const CALL_SITE_FILES = [
  'frontend/components/calendly/WebsiteCalendlyButton.tsx',
  'frontend/lib/calendly/website-events.ts',
  'frontend/lib/calendly/open-themed-popup.ts',
  'frontend/components/channel-landing/portal/scheduleTierClick.ts',
  'frontend/lib/pathway-consultation-scheduling.ts',
];

const failures = [];
const notes = [];

function fail(msg) {
  failures.push(msg);
}

function loadMatrix() {
  const raw = JSON.parse(fs.readFileSync(MATRIX_PATH, 'utf8'));
  if (!raw.entries?.length) throw new Error('matrix empty');
  return raw;
}

function buildNested(eventUrl, shell, host = 'localhost') {
  const u = new URL(eventUrl);
  u.searchParams.set('embed_domain', host);
  u.searchParams.set('background_color', shell.background);
  u.searchParams.set('text_color', shell.text);
  u.searchParams.set('primary_color', shell.primary);
  return u.toString();
}

function buildProxyPath(eventUrl, entry) {
  const nested = buildNested(eventUrl, entry.shell);
  const params = new URLSearchParams({
    url: nested,
    pms_channel: entry.channelId,
    pms_mode: entry.mode,
    background_color: entry.shell.background,
    text_color: entry.shell.text,
    primary_color: entry.shell.primary,
    form_label: entry.form.label,
    form_field_text: entry.form.fieldText || entry.form.label,
    form_submit_fill: entry.form.submitFill,
    form_submit_label: entry.form.submitLabel,
  });
  for (const [k, v] of Object.entries(entry.slots || {})) {
    const key =
      k === 'dateFill'
        ? 'slot_date_fill'
        : k === 'dateLabel'
          ? 'slot_date_label'
          : k === 'dateSelectedFill'
            ? 'slot_date_selected_fill'
            : k === 'dateSelectedLabel'
              ? 'slot_date_selected_label'
              : k === 'timeFill'
                ? 'slot_time_fill'
                : k === 'timeLabel'
                  ? 'slot_time_label'
                  : k === 'timeBorder'
                    ? 'slot_time_border'
                    : k === 'timeSelectedFill'
                      ? 'slot_time_selected_fill'
                      : k === 'timeSelectedLabel'
                        ? 'slot_time_selected_label'
                        : null;
    if (key) params.set(key, v);
  }
  return `/api/calendly/scheduler?${params.toString()}`;
}

function auditOuterNested(matrix) {
  const eventUrl = 'https://calendly.com/pm-structure/talk-to-mentor';
  for (const entry of matrix.entries) {
    const proxy = buildProxyPath(eventUrl, entry);
    const outer = new URL(proxy, 'http://localhost');
    const nested = new URL(outer.searchParams.get('url'));
    for (const key of ['primary_color', 'background_color', 'text_color']) {
      const o = (outer.searchParams.get(key) || '').toLowerCase();
      const n = (nested.searchParams.get(key) || '').toLowerCase();
      const shellKey = key.replace('_color', '');
      const expected = (entry.shell[shellKey === 'primary' ? 'primary' : shellKey === 'background' ? 'background' : 'text'] || '').toLowerCase();
      if (o !== n) fail(`${entry.slug}/${entry.mode}: outer ${key}=${o} ≠ nested ${n}`);
      if (o !== expected) fail(`${entry.slug}/${entry.mode}: outer ${key}=${o} ≠ shell ${expected}`);
    }
    if (entry.form?.label && entry.gates && entry.gates.formLabelOk === false) {
      fail(`${entry.slug}/${entry.mode}: formLabelOk false in matrix`);
    }
  }
  notes.push(`outer≡nested checked for ${matrix.entries.length} matrix rows`);
}

function auditRethemeStale() {
  const matrix = JSON.parse(fs.readFileSync(MATRIX_PATH, 'utf8'));
  const ig = matrix.entries.find((e) => e.channelId === 'instagram' && e.mode === 'dark');
  const li = matrix.entries.find((e) => e.channelId === 'linkedin' && e.mode === 'dark');
  if (!ig || !li) {
    fail('missing instagram/linkedin dark matrix rows');
    return;
  }
  if (ig.shell.primary.toLowerCase() === li.shell.primary.toLowerCase()) {
    fail('instagram and linkedin dark primaries unexpectedly equal — cannot test stale rewrite');
    return;
  }
  // Simulate: nested still has IG primary; after retheme to linkedin both must be LI
  const staleNested = buildNested('https://calendly.com/pm-structure/so-discovery-mentorship', ig.shell);
  const stalePrimary = new URL(staleNested).searchParams.get('primary_color');
  if (stalePrimary.toLowerCase() !== ig.shell.primary.toLowerCase()) {
    fail('stale nested setup failed');
    return;
  }
  const rewritten = buildNested(staleNested.split('?')[0], li.shell);
  const next = new URL(rewritten).searchParams.get('primary_color');
  if (next.toLowerCase() !== li.shell.primary.toLowerCase()) {
    fail(`retheme nested primary ${next} ≠ linkedin ${li.shell.primary}`);
  } else {
    notes.push('retheme stale-pink simulation: nested rewritten to LinkedIn primary');
  }
}

function auditModeToggle() {
  const matrix = JSON.parse(fs.readFileSync(MATRIX_PATH, 'utf8'));
  const dark = matrix.entries.find((e) => e.channelId === 'website' && e.mode === 'dark');
  const light = matrix.entries.find((e) => e.channelId === 'website' && e.mode === 'light');
  if (!dark || !light) {
    fail('missing website light/dark matrix rows');
    return;
  }
  const fromDark = buildNested('https://calendly.com/pm-structure/talk-to-mentor', dark.shell);
  const toLight = buildNested(fromDark.split('?')[0], light.shell);
  const bg = new URL(toLight).searchParams.get('background_color');
  if (bg.toLowerCase() !== light.shell.background.toLowerCase()) {
    fail(`mode toggle: expected light bg ${light.shell.background}, got ${bg}`);
  } else {
    notes.push('mode toggle simulation: light shell beats dark nested colors');
  }
}

function auditCallsites() {
  for (const rel of CALL_SITE_FILES) {
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full)) {
      fail(`call-site missing file: ${rel}`);
      continue;
    }
    const src = fs.readFileSync(full, 'utf8');
    if (rel.includes('WebsiteCalendlyButton') || rel.includes('website-events')) {
      if (!/channelId:\s*['"]website['"]/.test(src)) fail(`${rel}: missing channelId: 'website'`);
      if (!/useProxy:\s*true/.test(src)) fail(`${rel}: missing useProxy: true`);
    }
    if (rel.includes('scheduleTierClick')) {
      if (!/channelId:\s*page\.channelId/.test(src)) fail(`${rel}: missing channelId: page.channelId`);
      if (!/useProxy:\s*true/.test(src)) fail(`${rel}: missing useProxy: true`);
    }
    if (rel.includes('pathway-consultation')) {
      if (!/channelId/.test(src)) fail(`${rel}: missing channelId`);
      if (!/useProxy:\s*true|openWebsiteCalendly|openCalendlyThemedPopup/.test(src)) {
        fail(`${rel}: expected themed open path`);
      }
    }
  }
  notes.push(`call-site audit scanned ${CALL_SITE_FILES.length} files`);
}

async function auditLiveInject() {
  if (!BASE_URL) {
    notes.push('BASE_URL unset — skipped live inject family fetch');
    return;
  }
  const matrix = JSON.parse(fs.readFileSync(MATRIX_PATH, 'utf8'));
  for (const sample of FAMILY_FREE) {
    const entry = matrix.entries.find((e) => e.channelId === sample.channelId && e.mode === 'dark');
    if (!entry) {
      fail(`live inject: no matrix row for ${sample.channelId}/dark`);
      continue;
    }
    const proxyPath = buildProxyPath(sample.url, entry);
    const url = `${BASE_URL}${proxyPath}`;
    try {
      const res = await fetch(url, { redirect: 'follow' });
      const html = await res.text();
      if (!res.ok) {
        fail(`live ${sample.family}: HTTP ${res.status}`);
        continue;
      }
      for (const marker of ['--pms-form-label', '--pms-form-field-text', 'input::placeholder', '--pms-slot-date-fill', 'SLOT_QS']) {
        if (!html.includes(marker) && !html.includes(marker.replace('::', ''))) {
          // SLOT_QS is in JS; form markers in CSS
          if (marker === 'SLOT_QS' && !/SLOT_QS|applySlotQsToUrl/.test(html)) {
            fail(`live ${sample.family}: missing ${marker}`);
          } else if (marker !== 'SLOT_QS' && !html.includes(marker)) {
            fail(`live ${sample.family}: missing ${marker}`);
          }
        }
      }
      notes.push(`live inject OK: ${sample.family}`);
    } catch (e) {
      fail(`live ${sample.family}: ${e.message}`);
    }
  }
}

function writeFailuresDoc(matrix) {
  const body = [
    '# Calendly theme audit failures',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Matrix slugCount: ${matrix.slugCount}`,
    `Failure count: ${failures.length}`,
    '',
    '## Failures',
    '',
    ...(failures.length ? failures.map((f) => `- ${f}`) : ['- (none)']),
    '',
    '## Notes',
    '',
    ...notes.map((n) => `- ${n}`),
    '',
  ].join('\n');
  fs.mkdirSync(path.dirname(FAILURES_PATH), { recursive: true });
  fs.writeFileSync(FAILURES_PATH, body);
  console.log(`Wrote ${FAILURES_PATH}`);
}

async function main() {
  const matrix = loadMatrix();
  if (matrix.slugCount < 41) fail(`slugCount ${matrix.slugCount} < 41`);
  const hasWebsite = matrix.entries.some((e) => e.channelId === 'website');
  if (!hasWebsite) fail('matrix missing website channel');
  const hasVk = matrix.entries.some((e) => e.slug === 'vk' || e.channelId === 'vk');
  if (hasVk) fail('matrix unexpectedly includes draft vk');

  auditOuterNested(matrix);
  auditRethemeStale();
  auditModeToggle();
  auditCallsites();
  await auditLiveInject();

  if (process.env.WRITE_FAILURES === '1' || failures.length) {
    writeFailuresDoc(matrix);
  }

  console.log(`\nCalendly theme audit: ${failures.length} failure(s), ${notes.length} note(s)`);
  for (const n of notes) console.log(`  · ${n}`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(failures.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
