import { notFound } from 'next/navigation';
import { WebsiteDataEditor } from '@/components/pages/admin/WebsiteData';
import { isWebsitePageSlug } from '@/constants/websitePageConfigs';

export default async function SitePageEditorRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isWebsitePageSlug(slug)) {
    notFound();
  }

  return <WebsiteDataEditor initialPage={slug} />;
}
