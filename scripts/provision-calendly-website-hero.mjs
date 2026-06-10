#!/usr/bin/env node
/**
 * Provision Calendly event type: Website Hero — Book Consultation
 *
 * Requires CALENDLY_API_TOKEN (Personal Access Token) in env or .env.local
 * Create token: Calendly → Integrations → API & Webhooks
 *
 * Usage:
 *   npm run calendly:provision-website-hero
 *   CALENDLY_API_TOKEN=xxx node scripts/provision-calendly-website-hero.mjs
 *
 * After API create, finish in Calendly UI (if API cannot set):
 *   - Daily limit: 2 meetings/day
 *   - Buffer: 10 min before / 10 min after
 *   - Guests: off
 *   - Invite-only / free
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const BOOKING_HANDLE = 'booking-sh3ikhmabz';
const EVENT_SLUG = 'go-website-hero-consultation';
const EVENT_NAME = 'Website Hero — Book Consultation';
const DURATION_MINUTES = 20;
const DESCRIPTION =
  'A focused consultation session for professionals, project teams, and collaborators visiting the PMStructure website. Use this session to discuss general project inquiries, delivery strategy, or certification guidance. Ideal for actionable and structured discussion.';

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
      answer_choices: ['0–2', '3–5', '6–10', '10+'],
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

async function findExistingEventType(userUri) {
  let pageToken;
  const matches = [];
  do {
    const qs = new URLSearchParams({ user: userUri, count: '100' });
    if (pageToken) qs.set('page_token', pageToken);
    const data = await calendlyFetch('GET', `/event_types?${qs}`);
    for (const et of data.collection ?? []) {
      if (
        et.slug === EVENT_SLUG ||
        et.slug === 'website-hero-book-consultation' ||
        et.slug?.startsWith('website-hero-book-consultation') ||
        et.name === EVENT_NAME
      ) {
        matches.push(et);
      }
    }
    pageToken = data.pagination?.next_page_token;
  } while (pageToken);
  return (
    matches.find((et) => et.slug === EVENT_SLUG) ??
    matches.find((et) => et.slug === 'website-hero-book-consultation') ??
    matches.find((et) => et.active !== false) ??
    matches[0] ??
    null
  );
}

async function main() {
  if (!TOKEN) {
    console.error(
      'Missing CALENDLY_API_TOKEN.\n' +
        'Add to .env.local:\n  CALENDLY_API_TOKEN=your_personal_access_token\n' +
        'Or create the event manually in Calendly with slug:',
      EVENT_SLUG,
    );
    process.exit(1);
  }

  console.log('Fetching Calendly user…');
  const me = await calendlyFetch('GET', '/users/me');
  const userUri = me.resource?.uri;
  const orgUri = me.resource?.current_organization;
  if (!userUri) throw new Error('Could not resolve user URI from /users/me');

  let eventType = await findExistingEventType(userUri);
  const payload = {
    owner: userUri,
    name: EVENT_NAME,
    slug: EVENT_SLUG,
    duration: DURATION_MINUTES,
    description_plain: DESCRIPTION,
    kind: 'solo',
    active: true,
    custom_questions: customQuestionsPayload(),
  };

  if (eventType) {
    console.log('Event type exists — updating…', eventType.uri);
    const updated = await calendlyFetch('PATCH', eventType.uri.replace('https://api.calendly.com', ''), {
      name: EVENT_NAME,
      description_plain: DESCRIPTION,
      duration: DURATION_MINUTES,
      custom_questions: customQuestionsPayload(),
    });
    eventType = updated.resource ?? eventType;
  } else {
    console.log('Creating event type…');
    const created = await calendlyFetch('POST', '/event_types', payload);
    eventType = created.resource;
  }

  const schedulingUrl =
    eventType.scheduling_url ||
    `https://calendly.com/${BOOKING_HANDLE}/${EVENT_SLUG}`;

  console.log('\n✓ Website Hero consultation event ready');
  console.log('  Name:    ', EVENT_NAME);
  console.log('  Slug:    ', EVENT_SLUG);
  console.log('  URL:     ', schedulingUrl);
  console.log('  API URI: ', eventType.uri);
  if (orgUri) console.log('  Org:     ', orgUri);
  console.log('\nFinish in Calendly UI (if not already set):');
  console.log('  • Daily limit: 2 meetings per day');
  console.log('  • Buffer: 10 min before / 10 min after');
  console.log('  • Guests: off');
  console.log('  • Payment: free / invite only');
  console.log('\nOptional .env.local override:');
  console.log(`  NEXT_PUBLIC_CALENDLY_EVENT_URL_WEBSITE_HERO=${schedulingUrl}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
