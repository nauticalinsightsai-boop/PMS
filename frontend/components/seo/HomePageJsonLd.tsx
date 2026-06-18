import { HOME_COPY } from '@/lib/brand-voice';
import { T169_SEO } from '@/content/pmp/flagship-t169';
import { buildWebPageSchema } from '@/lib/schema';

/** Homepage WebPage JSON-LD; Organization + WebSite ship from PublicShell. */
export function HomePageJsonLd() {
  const schema = buildWebPageSchema({
    path: '/',
    name: HOME_COPY.heroTitle,
    description: T169_SEO.homeDescription,
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}