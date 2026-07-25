import type { GccCountryCode, RegionId } from '@/types/regional-catalogue';
import {
  getKeywordRedirectRowByFromSlug,
  isKeywordLeadHubPath,
  type KeywordIntent,
} from '@/content/seo/keyword-redirect-map';
import { getKeywordH1MetaByFromSlug } from '@/content/seo/keyword-h1-meta';

export const KEYWORD_ARRIVAL_COOKIE = 'pms_kw_arrival';
export const KEYWORD_ARRIVAL_HEADER = 'x-pms-keyword-slug';
/** 30 minutes */
export const KEYWORD_ARRIVAL_COOKIE_MAX_AGE = 30 * 60;

export type KeywordRegionHint = {
  regionId: RegionId;
  gccCountry: GccCountryCode | null;
};

export type KeywordArrivalContext = {
  slug: string;
  sourcePath: string;
  hubPath: string;
  primaryKeyword: string;
  h1: string;
  metaDescription: string;
  cta: string;
  intent: KeywordIntent | string;
  market: string;
  regionHint: KeywordRegionHint | null;
};

/** Map H1&Meta sheet `market` labels to catalogue region affinity. */
export function marketToRegionHint(market: string | undefined | null): KeywordRegionHint | null {
  const raw = (market ?? '').trim().toLowerCase();
  if (!raw) return null;

  if (raw === 'uae' || raw === 'ae' || raw.includes('united arab')) {
    return { regionId: 'gcc', gccCountry: 'AE' };
  }
  if (raw.includes('saudi')) {
    return { regionId: 'gcc', gccCountry: 'SA' };
  }
  if (raw.includes('qatar')) {
    return { regionId: 'gcc', gccCountry: 'QA' };
  }
  if (raw.includes('kuwait')) {
    return { regionId: 'gcc', gccCountry: 'KW' };
  }
  if (raw.includes('bahrain')) {
    return { regionId: 'gcc', gccCountry: 'BH' };
  }
  if (raw.includes('oman')) {
    return { regionId: 'gcc', gccCountry: 'OM' };
  }
  if (raw === 'india' || raw.includes('india')) {
    return { regionId: 'india', gccCountry: null };
  }
  if (raw === 'pakistan' || raw.includes('pakistan')) {
    return { regionId: 'pakistan', gccCountry: null };
  }
  // Egypt: no RegionId today — keep market label only (no forced override)
  if (raw.includes('egypt')) {
    return null;
  }
  // GCC / Global / mixed — do not force
  if (raw === 'gcc' || raw.includes('global') || raw.includes('gcc')) {
    return null;
  }

  return null;
}

export function normalizeKeywordSlug(raw: string | null | undefined): string {
  return (raw ?? '').trim().replace(/^\/+|\/+$/g, '');
}

export function buildKeywordArrivalContext(slugRaw: string): KeywordArrivalContext | null {
  const slug = normalizeKeywordSlug(slugRaw);
  if (!slug) return null;

  const row = getKeywordRedirectRowByFromSlug(slug);
  const h1Meta = getKeywordH1MetaByFromSlug(slug);
  if (!row && !h1Meta) return null;

  const sourcePath = row?.source ?? h1Meta?.source ?? `/${slug}`;
  const hubPath = (row?.destination ?? sourcePath).split('?')[0] || sourcePath;
  const primaryKeyword =
    h1Meta?.primaryKeyword?.trim() || row?.keyword?.trim() || slug.replace(/-/g, ' ');
  const h1 = h1Meta?.h1?.trim() || titleCaseKeyword(primaryKeyword);
  const metaDescription = h1Meta?.metaDescription?.trim() || '';
  const cta = h1Meta?.cta?.trim() || '';
  const intent = row?.intent ?? h1Meta?.intent ?? 'Commercial';
  const market = h1Meta?.market?.trim() || '';

  return {
    slug,
    sourcePath,
    hubPath,
    primaryKeyword,
    h1,
    metaDescription,
    cta,
    intent,
    market,
    regionHint: marketToRegionHint(market),
  };
}

/**
 * Resolve arrival slug: header → cookie → legacy ?from= (caller may pass searchParam).
 */
export function resolveKeywordArrivalSlug(input: {
  headerSlug?: string | null;
  cookieSlug?: string | null;
  fromQuery?: string | null;
}): string {
  return (
    normalizeKeywordSlug(input.headerSlug) ||
    normalizeKeywordSlug(input.cookieSlug) ||
    normalizeKeywordSlug(input.fromQuery) ||
    ''
  );
}

/** Client: read arrival cookie (document.cookie). */
export function readKeywordArrivalSlugFromDocumentCookie(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${KEYWORD_ARRIVAL_COOKIE}=([^;]*)`),
  );
  return normalizeKeywordSlug(match?.[1] ? decodeURIComponent(match[1]) : '');
}

export function titleCaseKeyword(keyword: string): string {
  return keyword
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLowerCase();
      if (['uae', 'ksa', 'pmp', 'pdu', 'gcc', 'ae', 'sa', 'qa', 'bh', 'kw', 'om'].includes(lower)) {
        return lower.toUpperCase();
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

export function arrivalAppliesToHub(
  arrival: KeywordArrivalContext | null | undefined,
  hubPath: string,
): arrival is KeywordArrivalContext {
  if (!arrival) return false;
  const hub = hubPath.replace(/\/$/, '') || '/';
  const arrivalHub = arrival.hubPath.replace(/\/$/, '') || '/';
  return arrivalHub === hub && isKeywordLeadHubPath(hub);
}
