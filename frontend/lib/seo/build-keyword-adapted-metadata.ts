import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/site-metadata';
import {
  titleCaseKeyword,
  type KeywordArrivalContext,
} from '@/lib/seo/keyword-arrival-context';

/**
 * Hub-canonical metadata adapted from keyword arrival.
 * Document title uses the primary keyword (geo/intent specific);
 * meta description stays from the H1&Meta sheet; canonical stays on the hub.
 */
export function buildKeywordAdaptedMetadata(input: {
  hubPath: string;
  arrival: KeywordArrivalContext;
}): Metadata {
  const title =
    titleCaseKeyword(input.arrival.primaryKeyword) ||
    input.arrival.h1 ||
    input.arrival.primaryKeyword;
  return buildPageMetadata({
    title,
    description: input.arrival.metaDescription || undefined,
    path: input.hubPath,
  });
}
