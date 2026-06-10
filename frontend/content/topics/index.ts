export * from './types';
export {
  TOPIC_HUBS,
  TOPIC_PATHS,
  TOPIC_SLUGS,
  getTopicHub,
} from './hubs';

import { TOPIC_HUBS } from './hubs';
import type { TopicHubContent } from './types';
import {
  FAQ_ENTRIES,
  isFaqPublished,
  resolveFaqShortAnswer,
} from '@/content/faq';

/** Default FAQ links per hub (Phase 12). Merged with hub.relatedFaqIds. */
export const TOPIC_RELATED_FAQ_IDS: Partial<Record<string, string[]>> = {
  'pmp-exam-preparation': ['pmp26-change-01', 'pmp26-tier-04', 'pmp26-gap-12'],
  'pmp-exam-2026': ['pmp26-change-01', 'pmp26-change-02', 'pmp26-gap-01', 'pmp26-gap-07'],
  'pmp-readiness': ['pmp26-dom-07', 'pmp26-gap-06', 'pmp26-study-13'],
  'pmp-scenario-practice': ['pmp26-dom-08', 'pmp26-study-12'],
  'business-environment-domain': ['pmp26-dom-04', 'pmp26-ai-01'],
  'value-delivery': ['pmp26-dom-04', 'pmp26-ai-02'],
  'pmp-domain-weighting': ['pmp26-dom-01', 'pmp26-dom-02', 'pmp26-change-04'],
  'pmp-people-domain': ['pmp26-dom-02', 'pmp26-dom-09'],
  'pmp-process-domain': ['pmp26-dom-03', 'pmp26-study-12'],
  'mock-exam-review': ['pmp26-study-13', 'pmp26-dom-10'],
  'pmp-study-plan': ['pmp26-before-03', 'pmp26-gap-06'],
  'agile-project-management': ['pmp26-after-03', 'pmp26-gap-09'],
  'hybrid-project-management': ['pmp26-gap-03', 'pmp26-gap-14'],
  'predictive-project-management': ['pmp26-gap-09', 'pmp26-gap-14'],
};

export const TOPIC_HUB_GROUPS: { h2: string; slugs: string[] }[] = [
  {
    h2: 'PMP exam preparation topics',
    slugs: [
      'pmp-exam-preparation',
      'pmp-study-plan',
      'project-management-certification',
      'exam-readiness',
    ],
  },
  {
    h2: 'PMP 2026 topics',
    slugs: ['pmp-exam-2026', 'pmp-domain-weighting', 'predictive-project-management'],
  },
  {
    h2: 'PMP readiness and scenario practice',
    slugs: [
      'pmp-readiness',
      'pmp-scenario-practice',
      'mock-exam-review',
      'project-delivery-readiness',
    ],
  },
  {
    h2: 'Business environment and value delivery',
    slugs: [
      'business-environment-domain',
      'value-delivery',
      'project-value-delivery',
      'sustainability-in-project-management',
    ],
  },
  {
    h2: 'Agile, hybrid and predictive delivery',
    slugs: [
      'agile-project-management',
      'hybrid-project-management',
      'predictive-project-management',
      'pmp-people-domain',
      'pmp-process-domain',
      'stakeholder-engagement',
    ],
  },
  {
    h2: 'Governance and project delivery',
    slugs: ['project-governance', 'risk-management', 'ai-in-project-management'],
  },
  {
    h2: 'Other certification topics',
    slugs: ['pmi-rmp-preparation', 'prince2-preparation', 'six-sigma-preparation'],
  },
];

export function isTopicPublished(hub: TopicHubContent): boolean {
  return hub.status !== 'draft' && hub.status !== 'planned';
}

export function getPublishedTopicHubs(): TopicHubContent[] {
  return TOPIC_HUBS.filter(isTopicPublished);
}

export function getPublishedTopicPaths(): string[] {
  return getPublishedTopicHubs().map((h) => h.path);
}

export function getTopicFaqsForHub(hub: TopicHubContent, limit = 6) {
  const ids = [
    ...(hub.relatedFaqIds ?? []),
    ...(TOPIC_RELATED_FAQ_IDS[hub.slug] ?? []),
  ];
  const seen = new Set<string>();
  const out: { question: string; answer: string }[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const entry = FAQ_ENTRIES.find((f) => f.id === id);
    if (!entry || !isFaqPublished(entry)) continue;
    out.push({ question: entry.question, answer: resolveFaqShortAnswer(entry) });
    if (out.length >= limit) break;
  }
  return out;
}

export function getTopicHubsForGroup(slugs: string[]): TopicHubContent[] {
  const published = getPublishedTopicHubs();
  return slugs
    .map((slug) => published.find((h) => h.slug === slug))
    .filter((h): h is TopicHubContent => !!h);
}
