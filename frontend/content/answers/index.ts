export * from './types';
export {
  ANSWER_PAGES,
  ANSWER_PATHS,
  ANSWER_SLUGS,
  getAnswerPage,
} from './pages';

import { ANSWER_PAGES } from './pages';
import type { AnswerPageContent } from './types';
import { FAQ_ENTRIES, isFaqPublished, resolveFaqShortAnswer } from '@/content/faq';

export function isAnswerPublished(page: AnswerPageContent): boolean {
  return page.status !== 'draft' && page.status !== 'planned';
}

export function getPublishedAnswerPages(): AnswerPageContent[] {
  return ANSWER_PAGES.filter(isAnswerPublished);
}

export function getPublishedAnswerPaths(): string[] {
  return getPublishedAnswerPages().map((p) => p.path);
}

export function getAnswerFaqsForPage(page: AnswerPageContent) {
  if (!page.relatedFaqIds?.length) return [];
  return page.relatedFaqIds
    .map((id) => FAQ_ENTRIES.find((f) => f.id === id))
    .filter((f): f is NonNullable<typeof f> => !!f && isFaqPublished(f))
    .map((f) => ({ question: f.question, answer: resolveFaqShortAnswer(f) }));
}
