import { FAQ_CLUSTERS, FAQ_ENTRIES } from './data';
import type { FaqClusterId, FaqEntry } from './types';
import type { PmpCategoryId } from './pmp-categories';
import { LEGACY_PMP_CATEGORY_MAP } from './pmp-categories';

export * from './types';
export * from './pmp-categories';
export { FAQ_CLUSTERS, FAQ_ENTRIES };
export { PMP_2026_FAQS } from './pmp-2026-faqs';
export { FAQ_HUB_SECTIONS, getFaqHubSectionForCluster } from './hub-sections';
export type { FaqHubSection } from './hub-sections';

const PMP_FAQ_CANONICAL = 'https://pmstructure.com/pmp-faq';

export function getAllFaqs(): FaqEntry[] {
  return FAQ_ENTRIES;
}

export function getFaqsByCluster(clusterId: FaqClusterId): FaqEntry[] {
  return FAQ_ENTRIES.filter((f) => f.clusterId === clusterId);
}

export function isFaqPublished(entry: FaqEntry): boolean {
  return entry.status !== 'draft' && entry.status !== 'planned';
}

export function isFaqSchemaEligible(entry: FaqEntry): boolean {
  return isFaqPublished(entry) && entry.schemaEligible !== false;
}

function stripMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

function firstSentences(text: string, max = 2): string {
  const plain = stripMarkdownLinks(text);
  const parts = plain.match(/[^.!?]+[.!?]+/g);
  if (!parts?.length) return plain.slice(0, 280);
  return parts.slice(0, max).join(' ').trim();
}

export function resolveFaqShortAnswer(entry: FaqEntry): string {
  if (entry.shortAnswer?.trim()) return stripMarkdownLinks(entry.shortAnswer);
  if (entry.fullAnswer?.trim()) return firstSentences(entry.fullAnswer);
  return firstSentences(entry.answer);
}

export function resolveFaqFullAnswer(entry: FaqEntry): string {
  if (entry.fullAnswer?.trim()) return entry.fullAnswer;
  return entry.answer;
}

export function resolvePmpCategoryId(entry: FaqEntry): PmpCategoryId | undefined {
  if (!entry.pmpCategory) return undefined;
  if (entry.pmpCategory in LEGACY_PMP_CATEGORY_MAP) {
    return LEGACY_PMP_CATEGORY_MAP[entry.pmpCategory];
  }
  return entry.pmpCategory as PmpCategoryId;
}

export function getPmpFaqs(): FaqEntry[] {
  return FAQ_ENTRIES.filter((f) => f.clusterId === 'pmp2026');
}

export function getPmpFaqsPublished(): FaqEntry[] {
  return getPmpFaqs().filter(isFaqPublished);
}

export function getFaqsByPmpCategory(categoryId: PmpCategoryId): FaqEntry[] {
  return getPmpFaqsPublished().filter((f) => resolvePmpCategoryId(f) === categoryId);
}

export function getFaqForSchema(): { question: string; answer: string }[] {
  return FAQ_ENTRIES.filter(isFaqSchemaEligible).map((f) => ({
    question: f.question,
    answer: stripMarkdownLinks(resolveFaqFullAnswer(f)),
  }));
}

export function getFaqsForSchemaByPath(path: string): { question: string; answer: string }[] {
  if (path === '/pmp-faq') {
    return getPmpFaqsPublished()
      .filter(isFaqSchemaEligible)
      .map((f) => ({
        question: f.question,
        answer: stripMarkdownLinks(resolveFaqShortAnswer(f)),
      }));
  }
  if (path === '/faq') {
    return FAQ_ENTRIES.filter(isFaqSchemaEligible).map((f) => ({
      question: f.question,
      answer: stripMarkdownLinks(resolveFaqShortAnswer(f)),
    }));
  }
  return getFaqForSchema();
}

export function getFaqsByRelatedPage(path: string): FaqEntry[] {
  return FAQ_ENTRIES.filter(
    (f) =>
      isFaqPublished(f) &&
      (f.relatedPage === path || f.relatedPages?.includes(path)),
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

export function getPmpFaqCanonicalUrl(entry: FaqEntry): string {
  return entry.canonicalUrl ?? PMP_FAQ_CANONICAL;
}

export const FAQ_COUNT_MIN = 130;
