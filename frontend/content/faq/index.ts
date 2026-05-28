import { FAQ_CLUSTERS, FAQ_ENTRIES } from './data';
import type { FaqClusterId, FaqEntry } from './types';

export * from './types';
export { FAQ_CLUSTERS, FAQ_ENTRIES };
export { FAQ_HUB_SECTIONS, getFaqHubSectionForCluster } from './hub-sections';
export type { FaqHubSection } from './hub-sections';

export function getAllFaqs(): FaqEntry[] {
  return FAQ_ENTRIES;
}

export function getFaqsByCluster(clusterId: FaqClusterId): FaqEntry[] {
  return FAQ_ENTRIES.filter((f) => f.clusterId === clusterId);
}

export function getFaqForSchema(): { question: string; answer: string }[] {
  return FAQ_ENTRIES.map((f) => ({
    question: f.question,
    answer: f.answer.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'),
  }));
}

export const FAQ_COUNT_MIN = 65;
