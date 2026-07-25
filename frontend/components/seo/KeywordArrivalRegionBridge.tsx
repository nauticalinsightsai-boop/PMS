'use client';

import * as React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRegion } from '@/contexts/RegionContext';
import {
  buildKeywordArrivalContext,
  readKeywordArrivalSlugFromDocumentCookie,
  resolveKeywordArrivalSlug,
} from '@/lib/seo/keyword-arrival-context';
import {
  getKeywordRewriteByPath,
  isKeywordLeadHubPath,
} from '@/content/seo/keyword-redirect-map';

/**
 * Applies market→region affinity once per keyword soft-lander arrival.
 * Keyword hint wins over default Global/US; IP/geo still apply when no keyword hint.
 */
export function KeywordArrivalRegionBridge() {
  const pathname = usePathname() ?? '/';
  const searchParams = useSearchParams();
  const { setRegionFromKeyword } = useRegion();
  const appliedSlug = React.useRef<string | null>(null);

  React.useEffect(() => {
    const pathNorm = pathname.replace(/\/$/, '') || '/';
    const rewrite = getKeywordRewriteByPath(pathNorm);
    const onSurface = Boolean(rewrite) || isKeywordLeadHubPath(pathNorm);
    if (!onSurface) return;

    const slug = resolveKeywordArrivalSlug({
      cookieSlug: readKeywordArrivalSlugFromDocumentCookie(),
      fromQuery: rewrite?.slug || searchParams.get('from'),
    });
    const effectiveSlug = rewrite?.slug || slug;
    if (!effectiveSlug) return;
    if (appliedSlug.current === effectiveSlug) return;

    const arrival = buildKeywordArrivalContext(effectiveSlug);
    if (!arrival?.regionHint) return;

    appliedSlug.current = effectiveSlug;
    setRegionFromKeyword(arrival.regionHint.regionId, arrival.regionHint.gccCountry);
  }, [pathname, searchParams, setRegionFromKeyword]);

  return null;
}
