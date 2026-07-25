import { buildArticleSchema, buildBreadcrumbSchema, buildWebPageSchema } from '@/lib/schema';
import { escapeJsonForScript } from '@pms/site-content/sanitize-html';

export function ArticleJsonLd({
  path,
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  breadcrumbs,
}: {
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
  breadcrumbs: { name: string; path: string }[];
}) {
  const graph = [
    buildWebPageSchema({ path, name: headline, description }),
    buildArticleSchema({
      path,
      headline,
      description,
      image,
      datePublished,
      dateModified,
      author,
    }),
    buildBreadcrumbSchema(breadcrumbs),
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: escapeJsonForScript(
          JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
        ),
      }}
    />
  );
}
