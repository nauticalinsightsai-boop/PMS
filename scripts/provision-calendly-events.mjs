#!/usr/bin/env node
/**
 * Bulk-provision Calendly event types from data/calendly-events.manifest.json
 *
 * Requires CALENDLY_API_TOKEN in env or .env.local
 *
 * Usage:
 *   npm run calendly:provision-events
 *   npm run calendly:provision-events -- --dry-run
 *   npm run calendly:provision-events -- --only=028,029
 *   npm run calendly:provision-events -- --skip-existing
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'data', 'calendly-events.manifest.json');
const PACKAGE_MANIFEST_PATH = path.join(
  ROOT,
  'packages',
  'booking-crm',
  'data',
  'calendly-events.manifest.json',
);
const REPORT_PATH = path.join(ROOT, 'docs', 'reports', 'CALENDLY_PROVISION_REPORT.md');

function loadEnvLocal() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return;
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

loadEnvLocal();

const TOKEN = process.env.CALENDLY_API_TOKEN?.trim();
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const skipExisting = args.includes('--skip-existing');
const onlyArg = args.find((a) => a.startsWith('--only='));
const onlyIds = onlyArg
  ? new Set(
      onlyArg
        .slice('--only='.length)
        .split(',')
        .map((s) => s.trim().padStart(3, '0')),
    )
  : null;

function customQuestionsPayload() {
  return [
    {
      name: 'Phone Number',
      type: 'phone_number',
      position: 0,
      enabled: true,
      required: true,
    },
    {
      name: 'Certification of Interest',
      type: 'multi_select',
      position: 1,
      enabled: true,
      required: true,
      answer_choices: ['PMP', 'PRINCE2', 'Six Sigma'],
      include_other: true,
    },
    {
      name: 'Years of Experience',
      type: 'single_select',
      position: 2,
      enabled: true,
      required: true,
      answer_choices: ['0-2', '3-5', '6-10', '10+'],
    },
    {
      name: 'Please describe your specific question or concern',
      type: 'text',
      position: 3,
      enabled: true,
      required: false,
    },
    {
      name: 'LinkedIn Profile URL',
      type: 'text',
      position: 4,
      enabled: true,
      required: false,
    },
  ];
}

async function calendlyFetch(method, apiPath, body) {
  const res = await fetch(`https://api.calendly.com${apiPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const msg = json?.message || json?.title || res.statusText;
    throw new Error(`${method} ${apiPath} → ${res.status}: ${msg}\n${text}`);
  }
  return json;
}

async function listAllEventTypes(userUri) {
  const all = [];
  let pageToken;
  do {
    const qs = new URLSearchParams({ user: userUri, count: '100' });
    if (pageToken) qs.set('page_token', pageToken);
    const data = await calendlyFetch('GET', `/event_types?${qs}`);
    all.push(...(data.collection ?? []));
    pageToken = data.pagination?.next_page_token;
  } while (pageToken);
  return all;
}

function findExistingEvent(existing, event) {
  const slugMatches = existing.filter(
    (et) =>
      et.slug === event.slug ||
      et.name === event.name ||
      et.slug?.replace(/^go-/, '') === event.slug.replace(/^go-/, ''),
  );
  return (
    slugMatches.find((et) => et.slug === event.slug) ??
    slugMatches.find((et) => et.active !== false) ??
    slugMatches[0] ??
    null
  );
}

function writeManifest(manifest) {
  const json = `${JSON.stringify(manifest, null, 2)}\n`;
  fs.writeFileSync(MANIFEST_PATH, json, 'utf8');
  fs.writeFileSync(PACKAGE_MANIFEST_PATH, json, 'utf8');
}

function writeReport(lines) {
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${lines.join('\n')}\n`, 'utf8');
}

async function provisionEvent(event, existingTypes, userUri) {
  const found = findExistingEvent(existingTypes, event);
  if (found && skipExisting) {
    return {
      id: event.id,
      slug: event.slug,
      status: 'skipped',
      schedulingUrl: found.scheduling_url,
      apiSlug: found.slug,
    };
  }

  const payload = {
    owner: userUri,
    name: event.name,
    slug: event.slug,
    duration: event.durationMinutes,
    description: event.description,
    kind: 'solo',
    active: true,
  };

  const patchPayload = {
    name: event.name,
    description: event.description,
    duration: event.durationMinutes,
  };

  if (dryRun) {
    return {
      id: event.id,
      slug: event.slug,
      status: found ? 'would-update' : 'would-create',
      schedulingUrl: found?.scheduling_url ?? event.urls.primary,
      apiSlug: found?.slug ?? event.slug,
    };
  }

  let resource;
  if (found) {
    const updated = await calendlyFetch('PATCH', found.uri.replace('https://api.calendly.com', ''), patchPayload);
    resource = updated.resource ?? found;
  } else {
    const created = await calendlyFetch('POST', '/event_types', payload);
    resource = created.resource;
  }

  return {
    id: event.id,
    slug: event.slug,
    status: found ? 'updated' : 'created',
    schedulingUrl: resource.scheduling_url,
    apiSlug: resource.slug,
    uri: resource.uri,
  };
}

async function main() {
  if (!TOKEN && !dryRun) {
    console.error(
      'Missing CALENDLY_API_TOKEN.\nAdd to .env.local:\n  CALENDLY_API_TOKEN=your_personal_access_token',
    );
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  let events = manifest.events ?? [];
  if (onlyIds) {
    events = events.filter((e) => onlyIds.has(e.id));
  }

  console.log(`Provisioning ${events.length} Calendly event(s)${dryRun ? ' (dry run)' : ''}…`);

  let userUri = null;
  let existingTypes = [];
  if (!dryRun) {
    const me = await calendlyFetch('GET', '/users/me');
    userUri = me.resource?.uri;
    if (!userUri) throw new Error('Could not resolve user URI from /users/me');
    existingTypes = await listAllEventTypes(userUri);
  }

  const results = [];
  for (const event of events) {
    try {
      const result = await provisionEvent(event, existingTypes, userUri);
      results.push(result);
      if (!dryRun && result.schedulingUrl) {
        const row = manifest.events.find((e) => e.id === event.id);
        if (row) row.urls.fallback = result.schedulingUrl;
      }
      console.log(`  [${result.status}] ${event.id} ${event.slug} → ${result.schedulingUrl ?? '. '}`);
    } catch (err) {
      results.push({
        id: event.id,
        slug: event.slug,
        status: 'error',
        error: err.message || String(err),
      });
      console.error(`  [error] ${event.id} ${event.slug}:`, err.message || err);
    }
  }

  if (!dryRun) {
    manifest.meta.lastProvisionedAt = new Date().toISOString();
    writeManifest(manifest);
  }

  const created = results.filter((r) => r.status === 'created').length;
  const updated = results.filter((r) => r.status === 'updated').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;
  const errors = results.filter((r) => r.status === 'error').length;

  const report = [
    '# Calendly provision report',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    `| Metric | Count |`,
    `|--------|------:|`,
    `| Created | ${created} |`,
    `| Updated | ${updated} |`,
    `| Skipped | ${skipped} |`,
    `| Errors | ${errors} |`,
    '',
    '## Events',
    '',
    '| ID | Slug | Status | Scheduling URL | API slug |',
    '|----|------|--------|----------------|----------|',
    ...results.map(
      (r) =>
        `| ${r.id} | ${r.slug} | ${r.status} | ${r.schedulingUrl ?? '. '} | ${r.apiSlug ?? '. '} |`,
    ),
    '',
    '## Post-provision UI checklist (per event template)',
    '',
    'Calendly API may not apply limits, buffers, guests, or Stripe payment. Verify in Calendly UI:',
    '',
    '- **Discovery** (20 min): 2/day, 10/10 buffer, guests off, free, standard 5 custom questions',
    '- **Executive** (35 min): 2/day, 15/15 buffer, guests on, paid/Stripe, same questions',
    '- **Services** (45 min): 2/day, 15/15 buffer, guests on, paid/Stripe',
    '- **Hero** (20 min): 2/day, 10/10 buffer, guests off, free/invite-only',
    '',
  ];
  writeReport(report);
  console.log(`\nReport: ${REPORT_PATH}`);
  if (errors) process.exit(1);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});