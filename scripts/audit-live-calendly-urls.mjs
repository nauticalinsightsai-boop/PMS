#!/usr/bin/env node
/**
 * List live Calendly event types via API; fix manifest fallbacks to verified URLs.
 * Usage: npm run calendly:audit-live-urls
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(ROOT, '.env.local');

if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

const TOKEN = process.env.CALENDLY_API_TOKEN?.trim();
if (!TOKEN) {
  console.error('Missing CALENDLY_API_TOKEN');
  process.exit(1);
}

const PM = 'https://calendly.com/pm-structure';

/** Manifest slug → live fallback when API has no matching event. */
const MANUAL_FALLBACK = {
  'go-website-hero-consultation': `${PM}/talk-to-mentor`,
  'go-website-discovery': `${PM}/talk-to-mentor`,
  'go-website-executive': `${PM}/talk-to-advisor`,
  'go-website-services': `${PM}/talk-to-advisor`,
  'go-video-discovery': `${PM}/so-discovery-mentorship`,
  'go-video-executive': `${PM}/go-social-media-executive`,
  'go-video-design-review': `${PM}/go-social-media-design-review`,
  'go-linkedin-discovery': `${PM}/so-discovery-mentorship`,
  'go-linkedin-executive': `${PM}/go-social-media-executive`,
  'go-youtube-discovery': `${PM}/so-discovery-mentorship`,
  'go-youtube-executive': `${PM}/go-social-media-executive`,
  'go-email-discovery': `${PM}/go-messaging-discovery`,
  'go-email-executive': `${PM}/go-messaging-executive`,
  'go-rss-feeds-discovery': `${PM}/go-syndicated-discovery`,
  'go-rss-feeds-executive': `${PM}/go-syndicated-executive`,
};

async function api(pathname) {
  const res = await fetch(`https://api.calendly.com${pathname}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || json.title || res.statusText);
  return json;
}

const me = await api('/users/me');
const userUri = me.resource.uri;
const all = [];
let pageToken;
do {
  const qs = new URLSearchParams({ user: userUri, count: '100' });
  if (pageToken) qs.set('page_token', pageToken);
  const data = await api(`/event_types?${qs}`);
  all.push(...(data.collection ?? []));
  pageToken = data.pagination?.next_page_token;
} while (pageToken);

const liveByUrl = new Set(all.map((et) => et.scheduling_url));

console.log(`Live Calendly events: ${all.length}`);

const manifestPath = path.join(ROOT, 'data', 'calendly-events.manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let fixed = 0;
let stillBad = 0;

for (const event of manifest.events ?? []) {
  const resolved = event.urls?.fallback || event.urls?.primary || '';
  if (liveByUrl.has(resolved)) {
    console.log(`OK\t${event.slug}`);
    continue;
  }

  const replacement = MANUAL_FALLBACK[event.slug];
  if (replacement && liveByUrl.has(replacement)) {
    event.urls.fallback = replacement;
    event.urls.primary = replacement;
    console.log(`FIX\t${event.slug}\t→\t${replacement}`);
    fixed += 1;
    continue;
  }

  console.error(`STILL INVALID\t${event.slug}\t${resolved}`);
  stillBad += 1;
}

if (fixed > 0) {
  const pkgPath = path.join(ROOT, 'packages', 'booking-crm', 'data', 'calendly-events.manifest.json');
  const payload = `${JSON.stringify(manifest, null, 2)}\n`;
  fs.writeFileSync(manifestPath, payload);
  fs.writeFileSync(pkgPath, payload);
  console.log(`\nUpdated ${fixed} manifest URL(s).`);
}

if (stillBad > 0) {
  process.exit(1);
}
