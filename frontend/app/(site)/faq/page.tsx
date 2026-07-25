import { FAQ } from '@/components/pages/FAQ';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { FaqPageJsonLd } from '@/components/seo/FaqPageJsonLd';
import { RelatedGuidesLinks } from '@/components/seo/RelatedGuidesLinks';
import { getFaqBreadcrumbs } from '@/content/site-architecture/routes';
import { getPhase2Seo, titleNeedsNoSuffix } from '@/content/seo/phase-2-page-seo';
import { buildPageMetadataWithCms } from '@/lib/cms/page-metadata';
import {
  fetchPublishedDocument,
  fetchPublishedGlobalContent,
} from '@/lib/cms/fetch-published-document';
import {
  FIELD_KEYS,
  defaultFaqPageConfig,
  parseFaqPageConfig,
} from '@pms/site-content';

const faqSeo = getPhase2Seo('/faq')!;
const faqBreadcrumbs = getFaqBreadcrumbs();

export async function generateMetadata() {
  return buildPageMetadataWithCms('faq', {
    title: faqSeo.title,
    description: faqSeo.description,
    path: faqSeo.canonicalPath,
    noSuffix: titleNeedsNoSuffix(faqSeo.title),
  });
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const rawTab = (await searchParams).tab;
  const initialTab = Array.isArray(rawTab) ? rawTab[0] : rawTab;
  const [globalContent, faqConfig] = await Promise.all([
    fetchPublishedGlobalContent(),
    fetchPublishedDocument(
      FIELD_KEYS.FAQ_PAGE_CONFIG,
      (raw) => (raw ? parseFaqPageConfig(raw) : null),
      defaultFaqPageConfig(),
    ),
  ]);

  return (
    <>
      <FaqPageJsonLd faqConfig={faqConfig} />
      <div className="container mx-auto max-w-3xl px-4 pt-8">
        <Breadcrumbs items={faqBreadcrumbs} />
      </div>
      <FAQ globalContent={globalContent} faqConfig={faqConfig} initialTab={initialTab} />
      {faqSeo.relatedLinks?.length ? (
        <div className="container mx-auto max-w-3xl px-4 pb-16">
          <RelatedGuidesLinks
            title="PMP readiness on PM Structure"
            links={faqSeo.relatedLinks}
            currentPath="/faq"
          />
        </div>
      ) : null}
    </>
  );
}
