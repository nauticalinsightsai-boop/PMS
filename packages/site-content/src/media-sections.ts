import { FIELD_KEYS } from './keys';

/** Human labels for CMS documents that contain images. */
export const CMS_FIELD_LABELS: Record<string, string> = {
  [FIELD_KEYS.HOME_PAGE_CONFIG]: 'Home page',
  [FIELD_KEYS.CERTIFICATIONS_HUB_CONFIG]: 'Certifications hub',
  [FIELD_KEYS.CERTIFICATIONS_REGISTRY]: 'Certifications',
  [FIELD_KEYS.SERVICES_PAGE_CONFIG]: 'PM Service',
  [FIELD_KEYS.STORE_CATALOG]: 'Store',
  [FIELD_KEYS.COMMUNITY_PAGE_CONFIG]: 'Community',
  [FIELD_KEYS.MEMBERSHIP_PAGE_CONFIG]: 'Membership',
  [FIELD_KEYS.ABOUT_PAGE_CONFIG]: 'About',
  [FIELD_KEYS.NEWSLETTER_HUB_CONFIG]: 'Newsletter hub',
  [FIELD_KEYS.GLOBAL_CONTENT]: 'Global snippets',
  [FIELD_KEYS.CMS_POSTS_REGISTRY]: 'Blog posts',
  [FIELD_KEYS.CMS_TOPICS_REGISTRY]: 'Topics',
  [FIELD_KEYS.NEWSLETTER_POSTS_REGISTRY]: 'Newsletters',
  [FIELD_KEYS.SITE_SETTINGS]: 'Site settings',
};

const STATIC_CATEGORY_LABELS: Record<string, string> = {
  brand: 'Brand assets',
  images: 'Marketing images',
  marketing: 'Marketing images',
  icons: 'Icons',
  root: 'Site assets',
};

function tokenizeJsonPath(path: string): string[] {
  const tokens: string[] = [];
  const re = /([^[\].]+)|\[(\d+)\]/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(path)) !== null) {
    tokens.push(match[1] ?? match[2]!);
  }
  return tokens;
}

function humanizeSegment(segment: string): string {
  const map: Record<string, string> = {
    heroSlides: 'Hero slides',
    hero: 'Hero',
    featuredImage: 'Featured image',
    featuredImageMobileUrl: 'Mobile hero',
    image: 'Image',
    imageUrl: 'Image',
    imageMobile: 'Mobile image',
    logo: 'Logo',
    thumbnail: 'Thumbnail',
    products: 'Products',
    items: 'Items',
    posts: 'Posts',
    articles: 'Articles',
  };
  if (map[segment]) return map[segment];
  return segment
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/** Turn `home_page_config.heroSlides[0].imageUrl` into readable section text. */
export function humanizeCmsContext(context: string): { page: string; section: string; fieldKey: string } {
  const fieldKey = context.split(/[.[]/)[0] ?? context;
  const page = CMS_FIELD_LABELS[fieldKey] ?? fieldKey.replace(/_/g, ' ');
  const rest = context.slice(fieldKey.length).replace(/^\./, '');
  if (!rest) return { page, section: 'General', fieldKey };

  const tokens = tokenizeJsonPath(rest);
  const parts: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!;
    const prev = tokens[i - 1];
    if (/^\d+$/.test(token) && prev) {
      parts.push(`${humanizeSegment(prev)} ${Number(token) + 1}`);
      continue;
    }
    if (/^\d+$/.test(token)) continue;
    parts.push(humanizeSegment(token));
  }
  return { page, section: parts.join(' · ') || 'General', fieldKey };
}

export function cmsSectionTabId(fieldKey: string): string {
  return `cms-${fieldKey}`;
}

export function staticSectionTabId(category: string): string {
  return `site-${category || 'other'}`;
}

export function staticCategoryLabel(category: string): string {
  return STATIC_CATEGORY_LABELS[category] ?? category.replace(/-/g, ' ');
}

export function parseCmsContext(context: string): { fieldKey: string; path: string } | null {
  const fieldKey = context.split(/[.[]/)[0]?.trim();
  if (!fieldKey) return null;
  const path = context.slice(fieldKey.length).replace(/^\./, '');
  if (!path) return null;
  return { fieldKey, path };
}

export function setValueAtJsonPath(root: unknown, path: string, value: string): boolean {
  const tokens = tokenizeJsonPath(path);
  if (tokens.length === 0) return false;

  let cursor: unknown = root;
  for (let i = 0; i < tokens.length - 1; i++) {
    const key = tokens[i]!;
    const nextKey = tokens[i + 1]!;
    const nextIsIndex = /^\d+$/.test(nextKey);

    if (cursor === null || typeof cursor !== 'object') return false;

    if (Array.isArray(cursor)) {
      const index = Number(key);
      if (!Number.isFinite(index) || cursor[index] === undefined) return false;
      cursor = cursor[index];
      continue;
    }

    const record = cursor as Record<string, unknown>;
    if (!(key in record)) return false;
    const next = record[key];
    if (nextIsIndex && !Array.isArray(next)) return false;
    cursor = next;
  }

  const last = tokens[tokens.length - 1]!;
  if (Array.isArray(cursor) && /^\d+$/.test(last)) {
    cursor[Number(last)] = value;
    return true;
  }
  if (cursor && typeof cursor === 'object' && !Array.isArray(cursor)) {
    (cursor as Record<string, unknown>)[last] = value;
    return true;
  }
  return false;
}
