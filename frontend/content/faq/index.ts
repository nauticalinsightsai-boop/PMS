import { FAQ_CLUSTERS, FAQ_ENTRIES } from './data';
import type { FaqClusterId, FaqEntry } from './types';
import type { PmpCategoryId } from './pmp-categories';
import { LEGACY_PMP_CATEGORY_MAP } from './pmp-categories';
import {
  visibleFaqItems,
  type FaqPageConfig,
} from '@pms/site-content';

export * from './types';
export * from './pmp-categories';
export { FAQ_CLUSTERS, FAQ_ENTRIES };
export { PMP_2026_FAQS } from './pmp-2026-faqs';
export { FAQ_HUB_SECTIONS, getFaqHubSectionForCluster } from './hub-sections';
export type { FaqHubSection } from './hub-sections';

const PMP_FAQ_CANONICAL = 'https://pmstructure.com/pmp-faq';

function normalizeFaqQuestion(question: string): string {
  return question.trim().replace(/\s+/g, ' ').toLowerCase();
}

function dedupeFaqEntries(entries: FaqEntry[]): FaqEntry[] {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    const key = normalizeFaqQuestion(entry.question);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const DEDUPED_FAQ_ENTRIES = dedupeFaqEntries(FAQ_ENTRIES);

export function getAllFaqs(): FaqEntry[] {
  return DEDUPED_FAQ_ENTRIES;
}

export function getFaqsByCluster(clusterId: FaqClusterId): FaqEntry[] {
  return DEDUPED_FAQ_ENTRIES.filter((f) => f.clusterId === clusterId);
}

/** Authoritative visible FAQ list for /faq, including CMS overrides and built-in visibility. */
export function getVisibleFaqPageEntries(
  config: FaqPageConfig | null | undefined,
): FaqEntry[] {
  const customEntries: FaqEntry[] = visibleFaqItems(config).map((item) => ({
    id: `cms-${item.id}`,
    clusterId: 'about',
    question: item.question,
    answer: item.answer,
  }));
  const hiddenBuiltInIds = new Set(config?.hiddenBuiltInIds ?? []);
  const builtInEntries = FAQ_ENTRIES.filter((entry) => !hiddenBuiltInIds.has(entry.id));
  return dedupeFaqEntries([...customEntries, ...builtInEntries]);
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
  return dedupeFaqEntries(FAQ_ENTRIES.filter((f) => f.clusterId === 'pmp2026'));
}

export function getPmpFaqsPublished(): FaqEntry[] {
  return getPmpFaqs().filter(isFaqPublished);
}

export function getFaqsByPmpCategory(categoryId: PmpCategoryId): FaqEntry[] {
  return getPmpFaqsPublished().filter((f) => resolvePmpCategoryId(f) === categoryId);
}

export function getFaqForSchema(): { question: string; answer: string }[] {
  return DEDUPED_FAQ_ENTRIES.filter(isFaqSchemaEligible).map((f) => ({
    question: f.question,
    answer: stripMarkdownLinks(resolveFaqFullAnswer(f)),
  }));
}

function faqEntriesToSchema(
  entries: FaqEntry[],
): { question: string; answer: string }[] {
  return entries.filter(isFaqSchemaEligible).map((f) => ({
    question: f.question,
    answer: stripMarkdownLinks(resolveFaqShortAnswer(f)),
  }));
}

export function getFaqsForSchemaByPath(
  path: string,
  faqPageConfig?: FaqPageConfig | null,
): { question: string; answer: string }[] {
  if (path === '/pmp-faq') {
    return faqEntriesToSchema(getPmpFaqsPublished());
  }
  if (path === '/faq') {
    return faqEntriesToSchema(getVisibleFaqPageEntries(faqPageConfig));
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
  const seenQuestions = new Set<string>();
  const merged: FaqEntry[] = [];
  for (const entry of [
    ...getFaqsByRelatedPage(relatedPage),
    ...(relatedCourse ? getFaqsByRelatedCourse(relatedCourse) : []),
  ]) {
    const questionKey = normalizeFaqQuestion(entry.question);
    if (seen.has(entry.id) || seenQuestions.has(questionKey)) continue;
    seen.add(entry.id);
    seenQuestions.add(questionKey);
    merged.push(entry);
    if (merged.length >= limit) break;
  }
  return merged;
}

export function getPmpFaqCanonicalUrl(entry: FaqEntry): string {
  return entry.canonicalUrl ?? PMP_FAQ_CANONICAL;
}

export const FAQ_COUNT_MIN = 130;
