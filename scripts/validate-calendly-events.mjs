#!/usr/bin/env node
/**
 * Validate calendly-events.manifest.json and channel URL resolution.
 *
 * Usage:
 *   npm run calendly:validate-events
 *   npm run calendly:validate-events -- --check-urls
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST_PATH = path.join(ROOT, 'data', 'calendly-events.manifest.json');
const checkUrls = process.argv.includes('--check-urls');

const PORTAL_TIER_TO_KIND = {
  'mentor-intro': 'discovery',
  discovery: 'discovery',
  'career-pathway': 'executive',
  executive: 'executive',
};

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`✓ ${msg}`);
}

function eventMatchesChannel(event, channelId) {
  return event.channelIds?.length && event.channelIds.includes(channelId);
}

function getEventForChannelTier(events, channelId, tierId) {
  const tierKind = PORTAL_TIER_TO_KIND[tierId] ?? 'discovery';
  const candidates = events.filter(
    (event) => event.tierKind === tierKind && eventMatchesChannel(event, channelId),
  );
  if (!candidates.length) return null;
  const specific = candidates.filter(
    (event) => event.channelIds.length === 1 && event.channelIds[0] === channelId,
  );
  if (specific.length) return specific[0];
  return candidates.sort((a, b) => a.channelIds.length - b.channelIds.length)[0];
}

function resolveUrl(event) {
  return event.urls?.fallback || event.urls?.primary || '';
}

async function headCheck(url) {
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow' });
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const events = manifest.events ?? [];

  if (events.length !== 29) {
    fail(`Expected 29 events, found ${events.length}`);
  } else {
    ok('Manifest has 29 events');
  }

  const slugs = events.map((e) => e.slug);
  const uniqueSlugs = new Set(slugs);
  if (uniqueSlugs.size !== slugs.length) {
    fail('Duplicate slugs in manifest');
  } else {
    ok('All slugs are unique');
  }

  if (!events.some((e) => e.slug === 'go-website-hero-consultation')) {
    fail('Missing hero event go-website-hero-consultation');
  } else {
    ok('Hero event present');
  }

  if (!events.some((e) => e.slug === 'go-syndicated-discovery')) {
    fail('Missing go-syndicated-discovery');
  } else {
    ok('Syndicated discovery event present');
  }

  if (!events.some((e) => e.slug === 'go-syndicated-executive')) {
    fail('Missing go-syndicated-executive');
  } else {
    ok('Syndicated executive event present');
  }

  let channelGroups;
  try {
    channelGroups = require(path.join(
      ROOT,
      'packages/booking-crm/src/constants/channelGroups.ts',
    ));
  } catch {
    channelGroups = null;
  }

  const cgSource = fs.readFileSync(
    path.join(ROOT, 'packages/booking-crm/src/constants/channelGroups.ts'),
    'utf8',
  );
  const channelIdMatches = [...cgSource.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1]);
  const activeChannels = channelIdMatches;
  let unresolved = 0;
  for (const channelId of activeChannels) {
    for (const tierId of ['mentor-intro', 'career-pathway']) {
      const event = getEventForChannelTier(events, channelId, tierId);
      const url = event ? resolveUrl(event) : '';
      if (!url) {
        fail(`No URL for channel ${channelId} tier ${tierId}`);
        unresolved += 1;
      }
    }
  }
  if (!unresolved) {
    ok(`All ${activeChannels.length} channels resolve mentor-intro + career-pathway URLs`);
  }

  if (checkUrls) {
    console.log('\nChecking scheduling URLs (best-effort GET)…');
    let bad = 0;
    for (const event of events) {
      const url = resolveUrl(event);
      if (!url) continue;
      const good = await headCheck(url);
      if (good) {
        ok(`${event.slug}`);
      } else {
        fail(`${event.slug} → ${url} (non-200 or unreachable)`);
        bad += 1;
      }
    }
    if (!bad) ok('All checked URLs responded OK');
  }

  if (process.exitCode) {
    process.exit(process.exitCode);
  }
}

main();
