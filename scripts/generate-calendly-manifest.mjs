#!/usr/bin/env node
/**
 * Generates data/calendly-events.manifest.json (29 channel Calendly events).
 * Run: node scripts/generate-calendly-manifest.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PRIMARY_HANDLE = 'booking-sh3ikhmabz';
const FALLBACK_HANDLE = 'pm-structure';

const STANDARD_QUESTIONS = [
  { name: 'Phone Number', type: 'phone_number', required: true },
  {
    name: 'Certification of Interest',
    type: 'multi_select',
    required: true,
    answerChoices: ['PMP', 'PRINCE2', 'Six Sigma'],
    includeOther: true,
  },
  {
    name: 'Years of Experience',
    type: 'single_select',
    required: true,
    answerChoices: ['0-2', '3-5', '6-10', '10+'],
  },
  {
    name: 'Please describe your specific question or concern',
    type: 'text',
    required: false,
    multiline: true,
  },
  { name: 'LinkedIn Profile URL', type: 'text', required: false },
];

const DISCOVERY_TEMPLATE = {
  durationMinutes: 20,
  ctaLabel: 'Reserve Your Session',
  payment: 'free',
  guestsAllowed: false,
  dailyLimit: 2,
  bufferBefore: 10,
  bufferAfter: 10,
};

const EXECUTIVE_TEMPLATE = {
  durationMinutes: 35,
  ctaLabel: 'Reserve Advisory Call',
  payment: 'paid',
  guestsAllowed: true,
  dailyLimit: 2,
  bufferBefore: 15,
  bufferAfter: 15,
};

const HERO_TEMPLATE = {
  durationMinutes: 20,
  ctaLabel: 'Reserve Your Consultation',
  payment: 'free',
  guestsAllowed: false,
  dailyLimit: 2,
  bufferBefore: 10,
  bufferAfter: 10,
};

const SERVICES_TEMPLATE = {
  durationMinutes: 45,
  ctaLabel: 'Talk to an Expert',
  payment: 'paid',
  guestsAllowed: true,
  dailyLimit: 2,
  bufferBefore: 15,
  bufferAfter: 15,
};

const FAMILY_CHANNELS = {
  website: ['website'],
  webinar: ['webinar'],
  writing: ['medium', 'substack', 'beehiiv', 'ghost', 'hashnode', 'notion-public'],
  social: [
    'linkedin',
    'twitter',
    'instagram',
    'facebook',
    'reddit',
    'quora',
    'threads',
    'bluesky',
    'mastodon',
    'pinterest',
    'vk',
  ],
  video: ['youtube', 'tiktok', 'snapchat', 'vimeo'],
  audio: ['spotify', 'apple-podcasts', 'google-podcasts', 'amazon-audible', 'podbean', 'soundcloud'],
  community: ['email', 'whatsapp', 'telegram', 'discord', 'slack'],
  search: ['google-search', 'youtube-search', 'podcast-directories', 'bing-search', 'ai-visibility'],
  syndicated: ['rss-feeds', 'content-aggregators', 'api-ai-fed'],
};

const FAMILY_LABELS = {
  website: 'Website',
  webinar: 'Webinar',
  writing: 'Writing / Publishing',
  social: 'Social Distribution',
  video: 'Video Platform',
  audio: 'Audio / Podcast',
  community: 'Community / Direct',
  search: 'Discovery / Search',
  syndicated: 'Other / Syndicated / RSS / Feeds',
};

function primaryUrl(slug) {
  return `https://calendly.com/${PRIMARY_HANDLE}/${slug}`;
}

function discoveryDescription(familyLabel) {
  return `A 20-minute introductory session for readers arriving from ${familyLabel.toLowerCase()} sources. Ideal for clarifying project inquiries, content-driven advisory, or preliminary consultation.`;
}

function executiveDescription(familyLabel) {
  return `A 35-minute advisory session for referrals from ${familyLabel.toLowerCase()} sources. Ideal for deeper project guidance, technical review, or structured consultation.`;
}

function buildEvent(id, spec) {
  const slug = spec.slug;
  return {
    id,
    name: spec.name,
    slug,
    family: spec.family,
    tierKind: spec.tierKind,
    durationMinutes: spec.durationMinutes,
    ctaLabel: spec.ctaLabel,
    payment: spec.payment,
    guestsAllowed: spec.guestsAllowed,
    dailyLimit: spec.dailyLimit,
    bufferBefore: spec.bufferBefore,
    bufferAfter: spec.bufferAfter,
    description: spec.description,
    standardQuestions: STANDARD_QUESTIONS,
    channelIds: spec.channelIds,
    portalTierIds: spec.portalTierIds,
    urls: {
      primary: primaryUrl(slug),
      fallback: spec.fallbackUrl ?? null,
    },
  };
}

function pair(family, idBase) {
  const label = FAMILY_LABELS[family];
  const channels = FAMILY_CHANNELS[family];
  const slugBase = family === 'search' ? 'go-search' : `go-${family}`;
  return [
    buildEvent(String(idBase).padStart(3, '0'), {
      name: `${label}. Discovery & Mentorship`,
      slug: `${slugBase}-discovery`,
      family,
      tierKind: 'discovery',
      ...DISCOVERY_TEMPLATE,
      description: discoveryDescription(label),
      channelIds: channels,
      portalTierIds: ['mentor-intro', 'discovery'],
    }),
    buildEvent(String(idBase + 1).padStart(3, '0'), {
      name: `${label}. Executive Discussion`,
      slug: `${slugBase}-executive`,
      family,
      tierKind: 'executive',
      ...EXECUTIVE_TEMPLATE,
      description: executiveDescription(label),
      channelIds: channels,
      portalTierIds: ['career-pathway', 'executive'],
    }),
  ];
}

const events = [];

events.push(
  buildEvent('001', {
    name: 'Website Hero. Book Consultation',
    slug: 'go-website-hero-consultation',
    family: 'website-hero',
    tierKind: 'hero',
    ...HERO_TEMPLATE,
    description:
      'A focused consultation session for professionals, project teams, and collaborators visiting the PMStructure website. Use this session to discuss general project inquiries, delivery strategy, or certification guidance. Ideal for actionable and structured discussion.',
    channelIds: [],
    portalTierIds: [],
    fallbackUrl: 'https://calendly.com/pm-structure/website-hero-book-consultation',
  }),
);

events.push(
  buildEvent('002', {
    name: 'Website. Discovery & Mentorship',
    slug: 'go-website-discovery',
    family: 'website',
    tierKind: 'discovery',
    ...DISCOVERY_TEMPLATE,
    description: discoveryDescription('the PMStructure website'),
    channelIds: ['website'],
    portalTierIds: ['mentor-intro', 'discovery'],
  }),
  buildEvent('003', {
    name: 'Website. Executive Discussion',
    slug: 'go-website-executive',
    family: 'website',
    tierKind: 'executive',
    ...EXECUTIVE_TEMPLATE,
    description: executiveDescription('the PMStructure website'),
    channelIds: ['website'],
    portalTierIds: ['career-pathway', 'executive'],
  }),
  buildEvent('004', {
    name: 'Website. Expert Services Discussion',
    slug: 'go-website-services',
    family: 'website',
    tierKind: 'services',
    ...SERVICES_TEMPLATE,
    description:
      'Principal advisory for pathways, governance, training, and exam readiness from the PMStructure website.',
    channelIds: ['website'],
    portalTierIds: ['services-detail', 'design-review'],
  }),
);

let id = 5;
for (const family of ['webinar', 'writing', 'social', 'video', 'audio', 'community', 'search']) {
  events.push(...pair(family, id));
  id += 2;
}

// 019-026: high-traffic channel pairs (LinkedIn, YouTube, Email, RSS)
events.push(
  buildEvent('019', {
    name: 'LinkedIn. Discovery & Mentorship',
    slug: 'go-linkedin-discovery',
    family: 'linkedin',
    tierKind: 'discovery',
    ...DISCOVERY_TEMPLATE,
    description: discoveryDescription('LinkedIn'),
    channelIds: ['linkedin'],
    portalTierIds: ['mentor-intro', 'discovery'],
  }),
  buildEvent('020', {
    name: 'LinkedIn. Executive Discussion',
    slug: 'go-linkedin-executive',
    family: 'linkedin',
    tierKind: 'executive',
    ...EXECUTIVE_TEMPLATE,
    description: executiveDescription('LinkedIn'),
    channelIds: ['linkedin'],
    portalTierIds: ['career-pathway', 'executive'],
  }),
  buildEvent('021', {
    name: 'YouTube. Discovery & Mentorship',
    slug: 'go-youtube-discovery',
    family: 'youtube',
    tierKind: 'discovery',
    ...DISCOVERY_TEMPLATE,
    description: discoveryDescription('YouTube'),
    channelIds: ['youtube'],
    portalTierIds: ['mentor-intro', 'discovery'],
  }),
  buildEvent('022', {
    name: 'YouTube. Executive Discussion',
    slug: 'go-youtube-executive',
    family: 'youtube',
    tierKind: 'executive',
    ...EXECUTIVE_TEMPLATE,
    description: executiveDescription('YouTube'),
    channelIds: ['youtube'],
    portalTierIds: ['career-pathway', 'executive'],
  }),
  buildEvent('023', {
    name: 'Email. Discovery & Mentorship',
    slug: 'go-email-discovery',
    family: 'email',
    tierKind: 'discovery',
    ...DISCOVERY_TEMPLATE,
    description: discoveryDescription('email'),
    channelIds: ['email'],
    portalTierIds: ['mentor-intro', 'discovery'],
  }),
  buildEvent('024', {
    name: 'Email. Executive Discussion',
    slug: 'go-email-executive',
    family: 'email',
    tierKind: 'executive',
    ...EXECUTIVE_TEMPLATE,
    description: executiveDescription('email'),
    channelIds: ['email'],
    portalTierIds: ['career-pathway', 'executive'],
  }),
  buildEvent('025', {
    name: 'RSS Feeds. Discovery & Mentorship',
    slug: 'go-rss-feeds-discovery',
    family: 'rss-feeds',
    tierKind: 'discovery',
    ...DISCOVERY_TEMPLATE,
    description: discoveryDescription('RSS feeds'),
    channelIds: ['rss-feeds'],
    portalTierIds: ['mentor-intro', 'discovery'],
  }),
  buildEvent('026', {
    name: 'RSS Feeds. Executive Discussion',
    slug: 'go-rss-feeds-executive',
    family: 'rss-feeds',
    tierKind: 'executive',
    ...EXECUTIVE_TEMPLATE,
    description: executiveDescription('RSS feeds'),
    channelIds: ['rss-feeds'],
    portalTierIds: ['career-pathway', 'executive'],
  }),
);

// 027: syndicated services tier (content-aggregators + api-ai-fed discovery alias)
events.push(
  buildEvent('027', {
    name: 'Syndicated. Expert Services Discussion',
    slug: 'go-syndicated-services',
    family: 'syndicated',
    tierKind: 'services',
    ...SERVICES_TEMPLATE,
    description:
      'Principal advisory for pathways, governance, training, and exam readiness from syndicated and API-fed content sources.',
    channelIds: ['content-aggregators', 'api-ai-fed'],
    portalTierIds: ['services-detail', 'design-review'],
  }),
);

// 028-029 syndicated (user-specified IDs)
events.push(
  buildEvent('028', {
    name: 'Syndicated / RSS / Feeds. Discovery & Mentorship',
    slug: 'go-syndicated-discovery',
    family: 'syndicated',
    tierKind: 'discovery',
    ...DISCOVERY_TEMPLATE,
    description:
      'A 20-minute introductory session for readers arriving from syndicated feeds, RSS, or other content sources. Ideal for clarifying project inquiries, content-driven advisory, or preliminary consultation.',
    channelIds: FAMILY_CHANNELS.syndicated,
    portalTierIds: ['mentor-intro', 'discovery'],
  }),
  buildEvent('029', {
    name: 'Syndicated / RSS / Feeds. Executive Discussion',
    slug: 'go-syndicated-executive',
    family: 'syndicated',
    tierKind: 'executive',
    ...EXECUTIVE_TEMPLATE,
    description:
      'A 35-minute advisory session for referrals from syndicated feeds, RSS, or other content sources. Ideal for deeper project guidance, technical review, or structured consultation.',
    channelIds: FAMILY_CHANNELS.syndicated,
    portalTierIds: ['career-pathway', 'executive'],
  }),
);

if (events.length !== 29) {
  console.error('Expected 29 events, got', events.length);
  process.exit(1);
}

const manifest = {
  meta: {
    version: 1,
    eventCount: 29,
    primaryHandle: PRIMARY_HANDLE,
    fallbackHandle: FALLBACK_HANDLE,
    generatedAt: new Date().toISOString(),
  },
  events,
};

const json = `${JSON.stringify(manifest, null, 2)}\n`;
const outPaths = [
  path.join(ROOT, 'data', 'calendly-events.manifest.json'),
  path.join(ROOT, 'packages', 'booking-crm', 'data', 'calendly-events.manifest.json'),
];
for (const outPath of outPaths) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, json, 'utf8');
  console.log('Wrote', outPath, `(${events.length} events)`);
}