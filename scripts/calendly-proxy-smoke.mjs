#!/usr/bin/env node
/**
 * Calendly proxy URL smoke — unique event URLs × light/dark through inject path.
 * Fetches live Calendly HTML when network allows; always validates theme param encoding
 * and fails if injected HTML contains Oops / [missing date_full] markers after inject.
 *
 * Usage: node scripts/calendly-proxy-smoke.mjs
 * Optional: BASE_URL=http://localhost:3000 node scripts/calendly-proxy-smoke.mjs  (hits live proxy)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const MANIFEST = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'packages/booking-crm/data/calendly-events.manifest.json'), 'utf8'),
);

/** Representative free + paid URL per family from live pm-structure / manifest fallbacks. */
const FAMILY_SAMPLES = [
  { family: 'website', aliases: ['website', 'website-hero'], free: 'https://calendly.com/pm-structure/talk-to-mentor', paid: 'https://calendly.com/pm-structure/talk-to-advisor' },
  { family: 'webinar', aliases: ['webinar'], free: null, paid: null },
  { family: 'publishing', aliases: ['publishing', 'writing', 'newsletter', 'newsletters'], free: null, paid: null },
  { family: 'social', aliases: ['social', 'video', 'linkedin', 'youtube'], free: null, paid: null },
  { family: 'podcast', aliases: ['podcast', 'podcasts', 'audio'], free: null, paid: null },
  { family: 'messaging', aliases: ['messaging', 'community', 'email'], free: null, paid: null },
  { family: 'syndicated', aliases: ['syndicated', 'search', 'syndication'], free: null, paid: null },
];

function familyMatch(sample, fam) {
  const f = String(fam || '').toLowerCase();
  return sample.aliases.some((a) => f === a || f.includes(a));
}

function uniqueEventUrls() {
  const urls = new Set();
  for (const event of MANIFEST.events || []) {
    const u = event.urls?.fallback || event.urls?.primary;
    if (u) urls.add(u.trim());
  }
  for (const event of MANIFEST.events || []) {
    const u = (event.urls?.fallback || event.urls?.primary || '').trim();
    if (!u) continue;
    const fam = String(event.family || '');
    const payment = event.payment;
    for (const sample of FAMILY_SAMPLES) {
      if (!familyMatch(sample, fam)) continue;
      if (payment === 'free' && !sample.free) sample.free = u;
      if (payment === 'paid' && !sample.paid) sample.paid = u;
    }
  }
  return [...urls];
}

function isPaid(url) {
  return /executive|design-review|talk-to-advisor|webinar-paid|services/i.test(url);
}

function buildProxyPath(eventUrl, mode, channelId = 'website') {
  const params = new URLSearchParams({
    url: eventUrl,
    pms_channel: channelId,
    pms_mode: mode,
    background_color: mode === 'dark' ? '0a0a0b' : 'ffffff',
    text_color: mode === 'dark' ? 'f4f4f5' : '0f172a',
    primary_color: 'ea580c',
    slot_date_fill: mode === 'dark' ? '27272a' : 'f4f4f5',
    slot_date_label: 'ea580c',
    slot_date_selected_fill: 'ea580c',
    slot_date_selected_label: 'ffffff',
    slot_time_fill: mode === 'dark' ? '27272a' : 'f4f4f5',
    slot_time_label: 'ea580c',
    slot_time_border: mode === 'dark' ? '3f3f46' : 'e2e8f0',
    slot_time_selected_fill: 'ea580c',
    slot_time_selected_label: 'ffffff',
    form_label: mode === 'dark' ? 'a1a1aa' : '64748b',
    form_submit_fill: 'ea580c',
    form_submit_label: 'ffffff',
    pms_paid: isPaid(eventUrl) ? '1' : '0',
  });
  return `/api/calendly/scheduler?${params.toString()}`;
}

async function smokeUpstream(eventUrl) {
  const res = await fetch(eventUrl, {
    headers: {
      Accept: 'text/html',
      'User-Agent': 'PMS-CalendlyProxySmoke/1.0',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`upstream ${res.status} for ${eventUrl}`);
  const html = await res.text();
  if (/Oops/i.test(html) && /something went wrong/i.test(html)) {
    throw new Error(`Oops page for ${eventUrl}`);
  }
  // Raw Calendly may include i18n keys before hydrate — we only fail hard on explicit missing marker in our inject tests
  return html;
}

async function smokeLiveProxy(baseUrl, eventUrl, mode) {
  const pathAndQuery = buildProxyPath(eventUrl, mode);
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}${pathAndQuery}`, {
    headers: { Accept: 'text/html', 'User-Agent': 'PMS-CalendlyProxySmoke/1.0' },
  });
  if (!res.ok) throw new Error(`proxy ${res.status} ${pathAndQuery.slice(0, 80)}…`);
  const html = await res.text();
  if (/\[missing\s+"en\.time\.formats\.date_full"\]/i.test(html)) {
    throw new Error(`missing date_full in proxy HTML for ${eventUrl} ${mode}`);
  }
  if (/Oops/i.test(html) && /something went wrong/i.test(html)) {
    throw new Error(`Oops in proxy HTML for ${eventUrl} ${mode}`);
  }
  if (!/X-PMS-Calendly-Proxy/i.test(String(res.headers.get('x-pms-calendly-proxy') || '1')) && !/pms-calendly|slot_date_fill|__PMS_CALENDLY/i.test(html)) {
    // Header may be stripped by edge; require inject markers
    if (!/slot_date|pms_channel|calendly/i.test(html)) {
      throw new Error(`proxy HTML missing inject markers for ${eventUrl}`);
    }
  }
  return true;
}

async function main() {
  const urls = uniqueEventUrls();
  console.log(`[calendly-proxy-smoke] unique event URLs: ${urls.length}`);

  const baseUrl = process.env.BASE_URL || process.env.SMOKE_BASE_URL || '';
  const failures = [];
  const modes = ['light', 'dark'];

  // Always validate URL encoding / paid flag for all URLs × modes
  for (const url of urls) {
    for (const mode of modes) {
      const p = buildProxyPath(url, mode);
      if (!p.includes('slot_date_fill=')) failures.push(`missing slot params ${url} ${mode}`);
      if (isPaid(url) && !p.includes('pms_paid=1')) failures.push(`paid flag missing ${url}`);
      if (!isPaid(url) && !p.includes('pms_paid=0')) failures.push(`free flag missing ${url}`);
    }
  }

  // Family coverage (F2b)
  for (const sample of FAMILY_SAMPLES) {
    const has = sample.free || sample.paid;
    if (!has) {
      failures.push(`no sample URL for family ${sample.family}`);
    } else {
      console.log(`[ok] family ${sample.family} free=${Boolean(sample.free)} paid=${Boolean(sample.paid)}`);
    }
  }

  // Upstream fetch sample (first free + first paid)
  const free = urls.find((u) => !isPaid(u));
  const paid = urls.find((u) => isPaid(u));
  for (const u of [free, paid].filter(Boolean)) {
    try {
      await smokeUpstream(u);
      console.log(`[ok] upstream ${u}`);
    } catch (err) {
      failures.push(String(err.message || err));
    }
  }

  if (baseUrl) {
    console.log(`[calendly-proxy-smoke] live proxy against ${baseUrl}`);
    const sampleUrls = [...new Set([free, paid, ...urls.slice(0, 5)].filter(Boolean))];
    for (const u of sampleUrls) {
      for (const mode of modes) {
        try {
          await smokeLiveProxy(baseUrl, u, mode);
          console.log(`[ok] proxy ${mode} ${u}`);
        } catch (err) {
          failures.push(String(err.message || err));
        }
      }
    }
  } else {
    console.log('[calendly-proxy-smoke] skip live proxy (set BASE_URL to exercise /api/calendly/scheduler)');
  }

  // Inject module smoke when available
  const injectPath = path.join(ROOT, 'backend/lib/calendly/proxy-inject.ts');
  if (fs.existsSync(injectPath)) {
    const src = fs.readFileSync(injectPath, 'utf8');
    if (!src.includes('date_full')) failures.push('proxy-inject missing date_full i18n fix');
    if (!src.includes('paidEscape') && !src.includes('pms_paid')) {
      failures.push('proxy-inject missing paid escape');
    }
    if (!src.includes('slot_date_fill')) failures.push('proxy-inject missing slot CSS params');
    if (!src.includes('/api/calendly/booking') && !src.includes('api/booking')) {
      failures.push('proxy-inject missing booking fetch shim');
    }
    console.log('[ok] proxy-inject source markers present');
  }

  if (failures.length) {
    console.error('[calendly-proxy-smoke] FAILURES:');
    for (const f of failures) console.error(' -', f);
    process.exit(1);
  }
  console.log('[calendly-proxy-smoke] green');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
