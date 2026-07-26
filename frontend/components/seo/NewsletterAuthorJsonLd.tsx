import { PMS_SITE_URL } from '@/config/pms-site';
import { organizationId } from '@/lib/schema';
import type { NewsletterAuthor } from '@pms/site-content/newsletter-authors';

function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${PMS_SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** ProfilePage JSON-LD for newsletter author archives. Never invents Person fields. */
export function buildNewsletterAuthorProfileSchema(author: NewsletterAuthor): Record<string, unknown> {
  const pageUrl = absoluteUrl(`/newsletter/author/${author.slug}`);
  const pageId = `${pageUrl}#webpage`;

  if (author.bylineType === 'editorial_role' || author.personSchemaEligible !== true) {
    return {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': pageId,
      url: pageUrl,
      name: `${author.name} editorial desk`,
      description:
        author.bio ||
        `PM Structure editorial desk for ${author.name}. Transparent organisational byline, not a personal identity.`,
      about: {
        '@type': 'Organization',
        '@id': organizationId(),
        name: 'PM Structure',
      },
      mainEntity: {
        '@id': organizationId(),
      },
    };
  }

  const person: Record<string, unknown> = {
    '@type': 'Person',
    '@id': `${pageUrl}#person`,
    name: author.name,
    url: pageUrl,
  };
  if (author.title?.trim()) person.jobTitle = author.title.trim();
  if (author.bio?.trim()) person.description = author.bio.trim();
  if (author.avatarUrl?.trim()) person.image = absoluteUrl(author.avatarUrl.trim());

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': pageId,
    url: pageUrl,
    name: author.name,
    description: author.bio || `Articles by ${author.name} on The Structure Report.`,
    mainEntity: person,
    about: person,
  };
}

export function NewsletterAuthorJsonLd({ author }: { author: NewsletterAuthor }) {
  const schema = buildNewsletterAuthorProfileSchema(author);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
