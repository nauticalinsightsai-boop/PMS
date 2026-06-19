import { About } from '@/components/pages/About';
import { AboutPageJsonLd } from '@/components/seo/AboutPageJsonLd';
import { buildPageMetadata } from '@/lib/site-metadata';
import {
  fetchPublishedDocument,
  fetchPublishedGlobalContent,
} from '@/lib/cms/fetch-published-document';
import {
  defaultAboutPageConfig,
  parseAboutPageConfig,
} from '@pms/site-content';
import { FIELD_KEYS } from '@pms/site-content/keys';

export const metadata = buildPageMetadata({
  title: 'About PM Structure',
  description: 'Independent exam-preparation platform for project management certifications.',
  path: '/about',
});

export default async function Page() {
  const [initialPageConfig, globalContent] = await Promise.all([
    fetchPublishedDocument(
      FIELD_KEYS.ABOUT_PAGE_CONFIG,
      (raw) => (raw ? parseAboutPageConfig(raw) : null),
      defaultAboutPageConfig(),
    ),
    fetchPublishedGlobalContent(),
  ]);

  return (
    <>
      <AboutPageJsonLd
        title="About PM Structure"
        description="Independent exam-preparation platform for project management certifications."
      />
      <About initialPageConfig={initialPageConfig} globalContent={globalContent} />
    </>
  );
}
