import { buildOrganizationSchema, buildWebSiteSchema } from '@/lib/schema';

export function OrganizationJsonLd() {
  const graph = [buildOrganizationSchema(), buildWebSiteSchema()];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}
