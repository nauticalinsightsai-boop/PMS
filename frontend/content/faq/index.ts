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

export function isFaqPublished(entry: FaqEntry): boolean {
  return entry.status !== 'draft';
}

export function isFaqSchemaEligible(entry: FaqEntry): boolean {
  return isFaqPublished(entry) && entry.schemaEligible !== false;
}

export function getFaqForSchema(): { question: string; answer: string }[] {
  return FAQ_ENTRIES.filter(isFaqSchemaEligible).map((f) => ({
    question: f.question,
    answer: f.answer.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'),
  }));
}

export function getFaqsByRelatedPage(path: string): FaqEntry[] {
  return FAQ_ENTRIES.filter(
    (f) => isFaqPublished(f) && f.relatedPage === path,
  );
}

export function getFaqsByRelatedCourse(path: string): FaqEntry[] {
  return FAQ_ENTRIES.filter(
    (f) => isFaqPublished(f) && f.relatedCourse === path,
  );
}

/** Merge page- and course-tagged FAQs for PMP surfaces (deduped, capped). */
export function getFaqsForPmpSurface(
  relatedPage: string,
  relatedCourse?: string,
  limit = 5,
): FaqEntry[] {
  const seen = new Set<string>();
  const merged: FaqEntry[] = [];
  for (const entry of [
    ...getFaqsByRelatedPage(relatedPage),
    ...(relatedCourse ? getFaqsByRelatedCourse(relatedCourse) : []),
  ]) {
    if (seen.has(entry.id)) continue;
    seen.add(entry.id);
    merged.push(entry);
    if (merged.length >= limit) break;
  }
  return merged;
}

export const FAQ_COUNT_MIN = 130;
