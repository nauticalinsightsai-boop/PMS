import { PMP_HUB_CARDS } from '@/content/pmp/pages';
import { ANSWER_PAGES } from './pages';

const PATH_IN_TEXT = /(\/[a-z0-9][a-z0-9/-]*)/gi;

export function labelForInternalPath(href: string): string {
  const hub = PMP_HUB_CARDS.find((c) => c.path === href);
  if (hub) return hub.title;

  const answer = ANSWER_PAGES.find((p) => p.path === href);
  if (answer) return answer.question;

  const slug = href.split('/').filter(Boolean).pop();
  if (!slug) return href;

  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function isBareInternalPath(step: string): boolean {
  return /^\/[^\s]+$/.test(step);
}

export function splitStepWithPaths(step: string): string[] {
  return step.split(PATH_IN_TEXT).filter((part) => part.length > 0);
}

export function stepContainsInternalPath(step: string): boolean {
  PATH_IN_TEXT.lastIndex = 0;
  return PATH_IN_TEXT.test(step);
}
