import type { ComponentType } from 'react';
import { notFound } from 'next/navigation';
import { isWebsitePageSlug, type WebsitePageSlug } from '@/constants/websitePageConfigs';
import { WebsiteDataEditor } from '@/components/pages/admin/WebsiteData';
import { ServicesPageEditor } from '@/components/pages/admin/ServicesPageEditor';
import { CommunityPageEditor } from '@/components/pages/admin/CommunityPageEditor';
import { MembershipPageEditor } from '@/components/pages/admin/MembershipPageEditor';
import { CertificationsHubEditor } from '@/components/pages/admin/CertificationsHubEditor';
import { StoreCatalogEditor } from '@/components/pages/admin/StoreCatalogEditor';

const SPECIALIZED_EDITORS: Partial<Record<WebsitePageSlug, ComponentType>> = {
  'pm-service': ServicesPageEditor,
  community: CommunityPageEditor,
  membership: MembershipPageEditor,
  certifications: CertificationsHubEditor,
  store: StoreCatalogEditor,
};

export default async function SitePageEditor({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isWebsitePageSlug(slug) || slug === 'home') {
    notFound();
  }

  const Specialized = SPECIALIZED_EDITORS[slug];
  if (Specialized) {
    return <Specialized />;
  }

  return <WebsiteDataEditor initialPage={slug} />;
}
