import { notFound, redirect } from 'next/navigation';
import { WebsiteDataEditor } from '@/components/pages/admin/WebsiteData';
import { CertificationsHubEditor } from '@/components/pages/admin/CertificationsHubEditor';
import { ServicesPageEditor } from '@/components/pages/admin/ServicesPageEditor';
import { StoreCatalogEditor } from '@/components/pages/admin/StoreCatalogEditor';
import { CommunityPageEditor } from '@/components/pages/admin/CommunityPageEditor';
import { MembershipPageEditor } from '@/components/pages/admin/MembershipPageEditor';
import { isWebsitePageSlug, type WebsitePageSlug } from '@/constants/websitePageConfigs';

export default async function SitePageEditorRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isWebsitePageSlug(slug)) {
    notFound();
  }

  if (slug === 'home') {
    redirect('/dashboard/site-system/home');
  }

  if (slug === 'certifications') return <CertificationsHubEditor />;
  if (slug === 'pm-service') return <ServicesPageEditor />;
  if (slug === 'store') return <StoreCatalogEditor />;
  if (slug === 'community') return <CommunityPageEditor />;
  if (slug === 'membership') return <MembershipPageEditor />;

  return <WebsiteDataEditor initialPage={slug as WebsitePageSlug} />;
}
