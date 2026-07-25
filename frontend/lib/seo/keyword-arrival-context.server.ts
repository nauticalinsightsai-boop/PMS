import { cookies, headers } from 'next/headers';
import {
  KEYWORD_ARRIVAL_COOKIE,
  KEYWORD_ARRIVAL_HEADER,
  buildKeywordArrivalContext,
  resolveKeywordArrivalSlug,
  type KeywordArrivalContext,
} from '@/lib/seo/keyword-arrival-context';

/** Server Components / generateMetadata: read header + cookie. */
export async function resolveKeywordArrivalFromRequest(
  fromQuery?: string | null,
): Promise<KeywordArrivalContext | null> {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const slug = resolveKeywordArrivalSlug({
    headerSlug: headerStore.get(KEYWORD_ARRIVAL_HEADER),
    cookieSlug: cookieStore.get(KEYWORD_ARRIVAL_COOKIE)?.value,
    fromQuery,
  });
  return slug ? buildKeywordArrivalContext(slug) : null;
}
