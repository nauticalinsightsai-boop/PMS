import { PMS_SITE_DESCRIPTION } from '@/config/pms-site';
import { HOME_COPY } from '@/lib/brand-voice';
import { buildWebPageSchema } from '@/lib/schema';

/** Homepage WebPage JSON-LD; Organization + WebSite ship from PublicShell. */
export function HomePageJsonLd() {
  const schema = buildWebPageSchema({
    path: '/',
    name: `${HOME_COPY.heroTitle}: ${HOME_COPY.heroTitleAccents.join(' · ')}`,
    description: PMS_SITE_DESCRIPTION,
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}