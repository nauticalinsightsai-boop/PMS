#!/usr/bin/env node
/**
 * PATCH Calendly event types with manifest description + duration.
 * (Custom questions, buffers, limits, payment = Calendly UI only.)
 *
 * Usage:
 *   npm run calendly:sync-event-details
 *   npm run calendly:sync-event-details -- --dry-run
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST_PATH = path.join(ROOT, 'data', 'calendly-events.manifest.json');
const AUDIT_PATH = path.join(ROOT, 'docs', 'reports', 'CALENDLY_AUDIT_REPORT.md');
const UI_CHECKLIST_PATH = path.join(ROOT, 'docs', 'reports', 'CALENDLY_UI_SETUP_CHECKLIST.md');

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
const dryRun = process.argv.includes('--dry-run');

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

function findEventForManifest(manifestEvent, existingTypes) {
  const fallback = manifestEvent.urls?.fallback;
  if (fallback) {
    const byUrl = existingTypes.find((et) => et.scheduling_url === fallback);
    if (byUrl) return byUrl;
  }
  return (
    existingTypes.find((et) => et.name === manifestEvent.name && et.active !== false) ??
    existingTypes.find((et) => et.slug === manifestEvent.slug) ??
    null
  );
}

function templateFor(event) {
  if (event.tierKind === 'hero') return 'hero';
  if (event.tierKind === 'services') return 'services';
  if (event.tierKind === 'executive') return 'executive';
  return 'discovery';
}

const UI_STEPS = {
  discovery: {
    limits: '2 meetings per day',
    buffer: '10 min before / 10 min after',
    guests: 'Off',
    payment: 'Free / invite only',
  },
  executive: {
    limits: '2 meetings per day',
    buffer: '15 min before / 15 min after',
    guests: 'On',
    payment: 'Paid — connect Stripe in Calendly UI',
  },
  services: {
    limits: '2 meetings per day',
    buffer: '15 min before / 15 min after',
    guests: 'On',
    payment: 'Paid — connect Stripe in Calendly UI',
  },
  hero: {
    limits: '2 meetings per day',
    buffer: '10 min before / 10 min after',
    guests: 'Off',
    payment: 'Free / invite only',
  },
};

const STANDARD_QUESTIONS = [
  'Phone Number — Required — Phone',
  'Certification of Interest — Required — Multi-select: PMP, PRINCE2, Six Sigma + Other text',
  'Years of Experience — Required — Single-select: 0–2, 3–5, 6–10, 10+',
  'Please describe your specific question or concern — Optional — Long text',
  'LinkedIn Profile URL — Optional — Short text',
];

function writeUiChecklist(events, existingTypes) {
  const lines = [
    '# Calendly UI setup checklist (manual)',
    '',
    'The Calendly API **cannot** set custom questions, buffers, daily limits, guests, or Stripe payment.',
    'Apply these in Calendly → **Scheduling** → each event → **More options**.',
    '',
    '## Standard invitee questions (all 29 events)',
    '',
    ...STANDARD_QUESTIONS.map((q) => `- ${q}`),
    '',
    'Remove the default question: *"Please share anything that will help prepare for our meeting."*',
    '',
    '## Per-event checklist',
    '',
    '| ID | Event | Template | Duration | Limits | Buffer | Guests | Payment | Edit URL |',
    '|----|-------|----------|----------|--------|--------|--------|---------|----------|',
  ];

  for (const event of events) {
    const tpl = templateFor(event);
    const ui = UI_STEPS[tpl];
    const live = findEventForManifest(event, existingTypes);
    const url = live?.scheduling_url ?? event.urls?.fallback ?? event.urls?.primary ?? '—';
    lines.push(
      `| ${event.id} | ${event.name.replace(/\|/g, '/')} | ${tpl} | ${event.durationMinutes} min | ${ui.limits} | ${ui.buffer} | ${ui.guests} | ${ui.payment} | [Open](${url}) |`,
    );
  }

  lines.push(
    '',
    '## Quick path in Calendly UI',
    '',
    '1. Open [Scheduling](https://calendly.com/app/scheduling/meeting_types/user/me)',
    '2. Click event → **Edit** → **More options**',
    '3. **Invitee questions** — add the 5 standard questions above',
    '4. **Limits and buffers** — set daily limit + buffer times',
    '5. **Payment** — executive + services tiers: enable Stripe',
    '6. **Guests** — off for discovery/hero, on for executive/services',
    '',
  );

  fs.mkdirSync(path.dirname(UI_CHECKLIST_PATH), { recursive: true });
  fs.writeFileSync(UI_CHECKLIST_PATH, `${lines.join('\n')}\n`, 'utf8');
}

async function main() {
  if (!TOKEN && !dryRun) {
    console.error('Missing CALENDLY_API_TOKEN in .env.local');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const events = manifest.events ?? [];

  const me = dryRun ? null : await calendlyFetch('GET', '/users/me');
  const userUri = me?.resource?.uri;
  const existingTypes = dryRun ? [] : await listAllEventTypes(userUri);

  const audit = [];
  let synced = 0;

  for (const event of events) {
    const live = dryRun ? null : findEventForManifest(event, existingTypes);
    if (!dryRun && !live) {
      audit.push({ id: event.id, slug: event.slug, issue: 'missing_on_calendly' });
      console.log(`  [missing] ${event.id} ${event.slug}`);
      continue;
    }

    const needsDesc = !dryRun && !(live.description_plain || '').trim();
    const needsDuration = !dryRun && live.duration !== event.durationMinutes;

    if (dryRun) {
      console.log(`  [would-sync] ${event.id} ${event.slug}`);
      synced += 1;
      continue;
    }

    if (needsDesc || needsDuration) {
      await calendlyFetch('PATCH', live.uri.replace('https://api.calendly.com', ''), {
        description: event.description,
        duration: event.durationMinutes,
      });
      console.log(`  [synced] ${event.id} ${event.slug}`);
      synced += 1;
    } else {
      console.log(`  [ok] ${event.id} ${event.slug}`);
    }

    const after = await calendlyFetch('GET', live.uri.replace('https://api.calendly.com', ''));
    const q = (after.resource?.custom_questions ?? []).filter((x) => x.enabled !== false);
    const hasStandard =
      q.some((x) => /phone/i.test(x.name)) &&
      q.some((x) => /certification/i.test(x.name)) &&
      q.some((x) => /experience/i.test(x.name));
    if (!hasStandard) {
      audit.push({
        id: event.id,
        slug: event.slug,
        issue: 'ui_custom_questions',
        url: live.scheduling_url,
      });
    }
    if (!(after.resource?.description_plain || '').trim()) {
      audit.push({ id: event.id, slug: event.slug, issue: 'description_still_empty', url: live.scheduling_url });
    }
  }

  if (!dryRun) writeUiChecklist(events, existingTypes);

  const report = [
    '# Calendly audit report',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    `- Events synced (description/duration): **${synced}**`,
    `- UI-only gaps remaining: **${audit.filter((a) => a.issue === 'ui_custom_questions').length}** events need custom questions/buffers/payment in Calendly UI`,
    '',
    '## API cannot configure (manual UI required)',
    '',
    '- Custom invitee questions (5 standard fields)',
    '- Daily meeting limits (2/day)',
    '- Buffer before/after',
    '- Guests allowed',
    '- Stripe payment on executive/services tiers',
    '',
    'See: `docs/reports/CALENDLY_UI_SETUP_CHECKLIST.md`',
    '',
    '## Gaps',
    '',
  ];

  if (!audit.length) {
    report.push('_No gaps detected via API audit._');
  } else {
    report.push('| ID | Slug | Issue | URL |');
    report.push('|----|------|-------|-----|');
    for (const row of audit) {
      report.push(`| ${row.id} | ${row.slug} | ${row.issue} | ${row.url ?? '—'} |`);
    }
  }

  fs.mkdirSync(path.dirname(AUDIT_PATH), { recursive: true });
  fs.writeFileSync(AUDIT_PATH, `${report.join('\n')}\n`, 'utf8');

  console.log(`\nAudit: ${AUDIT_PATH}`);
  if (!dryRun) console.log(`UI checklist: ${UI_CHECKLIST_PATH}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
