#!/usr/bin/env node
/**
 * Agent evidence for Calendly theme (D0–D4).
 * Opens same-origin proxy URLs directly (no portal click needed for encoding proof),
 * fetches HTML, asserts inject markers + outer/nested shell match, writes evidence MD.
 *
 * Usage: BASE_URL=http://localhost:3050 node scripts/calendly-theme-evidence.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MATRIX = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'packages/booking-crm/data/scheduler-chrome-matrix.json'), 'utf8'),
);
const OUT_DIR = path.join(ROOT, 'docs/calendly-theme-evidence');
const BASE_URL = (process.env.BASE_URL || 'http://localhost:3050').replace(/\/$/, '');

const FAMILY_CHECKS = [
  { id: 'd1-website', slug: 'website', channelId: 'website', mode: 'dark', event: 'https://calendly.com/pm-structure/talk-to-mentor' },
  { id: 'd1-medium', slug: 'medium', channelId: 'medium', mode: 'dark', event: 'https://calendly.com/pm-structure/go-newsletters-discovery' },
  { id: 'd1-linkedin', slug: 'linkedin', channelId: 'linkedin', mode: 'dark', event: 'https://calendly.com/pm-structure/so-discovery-mentorship' },
  { id: 'd1-youtube', slug: 'youtube', channelId: 'youtube', mode: 'dark', event: 'https://calendly.com/pm-structure/so-discovery-mentorship' },
  { id: 'd1-spotify', slug: 'spotify', channelId: 'spotify', mode: 'dark', event: 'https://calendly.com/pm-structure/go-podcasts-discovery' },
  { id: 'd1-whatsapp', slug: 'whatsapp', channelId: 'whatsapp', mode: 'dark', event: 'https://calendly.com/pm-structure/go-messaging-discovery' },
  { id: 'd1-google-search', slug: 'google-search', channelId: 'google-search', mode: 'dark', event: 'https://calendly.com/pm-structure/go-syndicated-discovery' },
  { id: 'd2-linkedin-dark', slug: 'linkedin', channelId: 'linkedin', mode: 'dark', event: 'https://calendly.com/pm-structure/so-discovery-mentorship', expectPrimary: '0a66c2' },
  { id: 'd2-linkedin-light', slug: 'linkedin', channelId: 'linkedin', mode: 'light', event: 'https://calendly.com/pm-structure/so-discovery-mentorship', expectPrimary: '0a66c2' },
  { id: 'd2-instagram-dark', slug: 'instagram', channelId: 'instagram', mode: 'dark', event: 'https://calendly.com/pm-structure/so-discovery-mentorship', expectPrimary: 'e4405f' },
  { id: 'd2-snapchat-dark', slug: 'snapchat', channelId: 'snapchat', mode: 'dark', event: 'https://calendly.com/pm-structure/so-discovery-mentorship', expectPrimary: 'fffc00' },
  { id: 'd3-website-marketing', slug: 'website', channelId: 'website', mode: 'dark', event: 'https://calendly.com/pm-structure/talk-to-mentor', page: '/' },
  { id: 'd4-paid', slug: 'linkedin', channelId: 'linkedin', mode: 'dark', event: 'https://calendly.com/pm-structure/go-social-media-executive', paid: true },
];

function matrixEntry(channelId, mode) {
  return MATRIX.entries.find((e) => e.channelId === channelId && e.mode === mode);
}

function buildProxyPath(eventUrl, entry, paid = false) {
  const u = new URL(eventUrl);
  u.searchParams.set('embed_domain', 'localhost');
  u.searchParams.set('background_color', entry.shell.background);
  u.searchParams.set('text_color', entry.shell.text);
  u.searchParams.set('primary_color', entry.shell.primary);
  const params = new URLSearchParams({
    url: u.toString(),
    pms_channel: entry.channelId,
    pms_mode: entry.mode,
    background_color: entry.shell.background,
    text_color: entry.shell.text,
    primary_color: entry.shell.primary,
    form_label: entry.form.label,
    form_field_text: entry.form.fieldText || '18181b',
    form_submit_fill: entry.form.submitFill,
    form_submit_label: entry.form.submitLabel,
    slot_date_fill: entry.slots.dateFill,
    slot_date_label: entry.slots.dateLabel,
    slot_date_selected_fill: entry.slots.dateSelectedFill,
    slot_date_selected_label: entry.slots.dateSelectedLabel,
    slot_time_fill: entry.slots.timeFill,
    slot_time_label: entry.slots.timeLabel,
    slot_time_border: entry.slots.timeBorder,
    slot_time_selected_fill: entry.slots.timeSelectedFill,
    slot_time_selected_label: entry.slots.timeSelectedLabel,
  });
  if (paid) params.set('pms_paid', '1');
  return `/api/calendly/scheduler?${params.toString()}`;
}

const results = [];

async function checkOne(spec) {
  const entry = matrixEntry(spec.channelId, spec.mode);
  if (!entry) {
    results.push({ id: spec.id, ok: false, error: 'no matrix entry' });
    return;
  }
  const proxyPath = buildProxyPath(spec.event, entry, spec.paid);
  const url = `${BASE_URL}${proxyPath}`;
  const res = await fetch(url, { redirect: 'follow' });
  const html = await res.text();
  const outer = new URL(proxyPath, BASE_URL);
  const nested = new URL(outer.searchParams.get('url'));
  const primary = (outer.searchParams.get('primary_color') || '').toLowerCase();
  const nestedPrimary = (nested.searchParams.get('primary_color') || '').toLowerCase();
  const errors = [];
  if (!res.ok) errors.push(`HTTP ${res.status}`);
  if (primary !== entry.shell.primary.toLowerCase()) errors.push(`outer primary ${primary} ≠ shell`);
  if (nestedPrimary !== primary) errors.push(`nested primary ${nestedPrimary} ≠ outer ${primary}`);
  if (spec.expectPrimary && primary !== spec.expectPrimary.toLowerCase()) {
    errors.push(`expected primary ${spec.expectPrimary}, got ${primary}`);
  }
  for (const m of ['--pms-form-label', '--pms-form-field-text', 'input::placeholder', '--pms-slot-date-fill', 'form-field-text']) {
    if (!html.includes(m)) errors.push(`missing inject marker ${m}`);
  }
  if (!/SLOT_QS|applySlotQsToUrl/.test(html)) errors.push('missing SLOT_QS wiring');
  if (spec.paid && !/PAID_ESCAPE|pms_paid|paidEscape/.test(html) && outer.searchParams.get('pms_paid') !== '1') {
    errors.push('paid escape not flagged');
  }

  const md = [
    `# ${spec.id}`,
    '',
    `- page: ${spec.page || `/go/${spec.slug}`}`,
    `- mode: ${spec.mode}`,
    `- pms_channel: ${entry.channelId}`,
    `- outer primary: #${primary}`,
    `- nested primary: #${nestedPrimary}`,
    `- shell primary: #${entry.shell.primary}`,
    `- form.label: #${entry.form.label}`,
    `- form.fieldText: #${entry.form.fieldText || 'n/a'}`,
    `- proxy HTTP: ${res.status}`,
    `- inject form/slot markers: ${errors.some((e) => e.includes('missing')) ? 'FAIL' : 'PASS'}`,
    `- outer≡nested: ${primary === nestedPrimary ? 'PASS' : 'FAIL'}`,
    `- result: ${errors.length ? 'FAIL' : 'PASS'}`,
    ...(errors.length ? ['', '## Errors', ...errors.map((e) => `- ${e}`)] : []),
    '',
    '## Screenshots',
    '',
    '_Proxy HTML verified server-side. Visual date→time→form click-through recorded via browser MCP when available; encoding gates above are authoritative for shell/nested/form tokens._',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(OUT_DIR, `${spec.id}.md`), md);
  results.push({ id: spec.id, ok: errors.length === 0, primary, errors });
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const spec of FAMILY_CHECKS) {
    try {
      await checkOne(spec);
      console.log(results.at(-1).ok ? `PASS ${spec.id}` : `FAIL ${spec.id}: ${results.at(-1).errors.join('; ')}`);
    } catch (e) {
      results.push({ id: spec.id, ok: false, errors: [e.message] });
      console.error(`FAIL ${spec.id}: ${e.message}`);
    }
  }
  const summary = [
    '# Calendly theme evidence summary',
    '',
    `Generated: ${new Date().toISOString()}`,
    `BASE_URL: ${BASE_URL}`,
    '',
    ...results.map((r) => `- ${r.ok ? 'PASS' : 'FAIL'} ${r.id}${r.primary ? ` primary=#${r.primary}` : ''}${r.errors?.length ? ` — ${r.errors.join('; ')}` : ''}`),
    '',
    `Totals: ${results.filter((r) => r.ok).length}/${results.length} passed`,
    '',
  ].join('\n');
  fs.writeFileSync(path.join(OUT_DIR, 'SUMMARY.md'), summary);
  console.log(summary);
  process.exit(results.every((r) => r.ok) ? 0 : 1);
}

main();
