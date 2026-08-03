import {
  PMS_LOGO_PATH,
  PMS_ORGANIZATION_SAME_AS,
  PMS_SITE_DESCRIPTION,
  PMS_SITE_NAME,
  PMS_SITE_URL,
  PMS_SUPPORT_EMAIL,
  PMS_WHATSAPP_DISPLAY,
  PMS_WHATSAPP_URL,
  isWhatsAppConfigured,
} from '@/config/pms-site';

export function organizationId(): string {
  return `${PMS_SITE_URL}/#organization`;
}

export function websiteId(): string {
  return `${PMS_SITE_URL}/#website`;
}

export function faqPageId(): string {
  return `${PMS_SITE_URL}/faq#faqpage`;
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'EducationalOrganization'],
    '@id': organizationId(),
    name: PMS_SITE_NAME,
    url: PMS_SITE_URL,
    logo: `${PMS_SITE_URL}${PMS_LOGO_PATH}`,
    description: PMS_SITE_DESCRIPTION,
    email: PMS_SUPPORT_EMAIL,
    knowsAbout: [
      'Project Management Professional (PMP)',
      'PRINCE2',
      'Lean Six Sigma',
      'Project management certification exam preparation',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: PMS_SUPPORT_EMAIL,
      ...(isWhatsAppConfigured() ? { telephone: PMS_WHATSAPP_DISPLAY, url: PMS_WHATSAPP_URL } : { url: `${PMS_SITE_URL}/contact` }),
    },
    sameAs: [...PMS_ORGANIZATION_SAME_AS],
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId(),
    name: PMS_SITE_NAME,
    url: PMS_SITE_URL,
    description: PMS_SITE_DESCRIPTION,
    publisher: { '@id': organizationId() },
  };
}

export function buildFaqPageSchema(
  items: { question: string; answer: string }[],
  pageUrl?: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': pageUrl ? `${pageUrl}#faqpage` : faqPageId(),
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(
  items: { name: string; path: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${PMS_SITE_URL}${item.path.startsWith('/') ? item.path : `/${item.path}`}`,
    })),
  };
}

export function buildWebPageSchema(input: {
  path: string;
  name: string;
  description: string;
}) {
  const url = `${PMS_SITE_URL}${input.path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    isPartOf: { '@id': websiteId() },
    publisher: { '@id': organizationId() },
  };
}

export function buildCourseSchema(input: {
  path: string;
  name: string;
  description: string;
}) {
  const url = `${PMS_SITE_URL}${input.path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${url}#course`,
    url,
    name: input.name,
    description: input.description,
    provider: { '@id': organizationId() },
  };
}

export function buildServiceSchema(input: {
  path: string;
  name: string;
  description: string;
}) {
  const url = `${PMS_SITE_URL}${input.path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    url,
    name: input.name,
    description: input.description,
    provider: { '@id': organizationId() },
  };
}

export function buildCollectionPageSchema(input: {
  path: string;
  name: string;
  description: string;
}) {
  const url = `${PMS_SITE_URL}${input.path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name: input.name,
    description: input.description,
    isPartOf: { '@id': websiteId() },
    publisher: { '@id': organizationId() },
  };
}

export function buildItemListSchema(
  items: { name: string; path: string }[],
  listId: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': listId,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `${PMS_SITE_URL}${item.path}`,
    })),
  };
}

export function buildArticleSchema(input: {
  path: string;
  headline: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    name: string;
    url?: string;
    personSchemaEligible?: boolean;
  };
}): Record<string, unknown> {
  const url = `${PMS_SITE_URL}${input.path}`;
  const image = absoluteSchemaUrl(input.image);
  const datePublished = validSchemaDate(input.datePublished);
  const dateModified = validSchemaDate(input.dateModified);
  const authorName = input.author?.name.trim();
  const authorUrl = absoluteSchemaUrl(input.author?.url);
  const author =
    input.author?.personSchemaEligible === true && authorName
      ? {
          '@type': 'Person',
          name: authorName,
          ...(authorUrl ? { url: authorUrl } : {}),
        }
      : authorName && authorUrl
        ? {
            '@type': 'Organization',
            name: authorName,
            url: authorUrl,
          }
      : { '@id': organizationId() };
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: input.headline,
    description: input.description,
    url,
    ...(image ? { image } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    author,
    publisher: { '@id': organizationId() },
    mainEntityOfPage: { '@id': `${url}#webpage` },
  };
}

function absoluteSchemaUrl(value?: string): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${PMS_SITE_URL}/${trimmed.replace(/^\/+/, '')}`;
}

function validSchemaDate(value?: string): string | undefined {
  const trimmed = value?.trim();
  const isoCompatible =
    /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:\d{2})?)?$/i;
  if (!trimmed || !isoCompatible.test(trimmed) || Number.isNaN(Date.parse(trimmed))) {
    return undefined;
  }
  return trimmed;
}
