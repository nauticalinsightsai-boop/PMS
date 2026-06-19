import { Membership } from '@/components/pages/Membership';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { MarketingPageJsonLd } from '@/components/seo/MarketingPageJsonLd';
import { RelatedGuidesLinks } from '@/components/seo/RelatedGuidesLinks';
import { PricingComplianceNote } from '@/components/PricingComplianceNote';
import { getMembershipBreadcrumbs } from '@/content/site-architecture/routes';
import { getPhase2Seo } from '@/content/seo/phase-2-page-seo';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';
import Link from 'next/link';
import {
  fetchPublishedDocument,
  fetchPublishedGlobalContent,
} from '@/lib/cms/fetch-published-document';
import {
  defaultMembershipPageConfig,
  parseMembershipPageConfig,
} from '@pms/site-content';
import { FIELD_KEYS } from '@pms/site-content/keys';

const seo = getPhase2Seo('/membership')!;
const membershipBreadcrumbs = getMembershipBreadcrumbs();

export const metadata = buildPhase2PageMetadata('/membership')!;

export default async function Page() {
  const [initialPageConfig, globalContent] = await Promise.all([
    fetchPublishedDocument(
      FIELD_KEYS.MEMBERSHIP_PAGE_CONFIG,
      (raw) => (raw ? parseMembershipPageConfig(raw) : null),
      defaultMembershipPageConfig(),
    ),
    fetchPublishedGlobalContent(),
  ]);

  return (
    <>
      <BreadcrumbJsonLd items={membershipBreadcrumbs} currentPath="/membership" />
      <MarketingPageJsonLd
        path="/membership"
        name={seo.h1 ?? 'Project Management Learning Membership'}
        description={seo.description}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Membership', path: '/membership' },
        ]}
      />
      <div className="container relative z-10 mx-auto max-w-6xl px-4 pt-8">
        <Breadcrumbs items={membershipBreadcrumbs} />
      </div>
      <Membership initialPageConfig={initialPageConfig} globalContent={globalContent} />
      {seo.relatedLinks?.length ? (
        <div className="container mx-auto max-w-3xl px-4 pb-16">
          <RelatedGuidesLinks
            title="Continue your preparation"
            links={seo.relatedLinks}
            currentPath="/membership"
            collapsible
            className="mt-12"
          >
            <PricingComplianceNote className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700" />
            <p className="mt-4 text-center text-sm text-slate-500">
              <Link href="/legal/membership-terms" className="font-bold text-brand-orange hover:underline">
                Membership terms
              </Link>
              {' · '}
              <Link href="/legal/regional-pricing" className="font-bold text-brand-orange hover:underline">
                Regional pricing policy
              </Link>
            </p>
          </RelatedGuidesLinks>
        </div>
      ) : null}
    </>
  );
}
