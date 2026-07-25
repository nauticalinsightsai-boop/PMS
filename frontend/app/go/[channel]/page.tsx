import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedGoChannelSlugs } from '@pms/booking-crm';
import { resolveChannelLandingPageForGo } from '@pms/booking-crm/repository';
import ChannelConsultationPortalView from '@/components/channel-landing/ChannelConsultationPortalView';
import { ROBOTS_NOINDEX_NOFOLLOW } from '@/lib/indexing-metadata';
import { buildPageMetadata } from '@/lib/site-metadata';

type Props = {
  params: Promise<{ channel: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export function generateStaticParams() {
  return getPublishedGoChannelSlugs().map((channel) => ({ channel }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { channel } = await params;
  const sp = await searchParams;
  const isPreview = sp?.preview === '1';
  const page = resolveChannelLandingPageForGo(channel, { preview: isPreview });
  if (!page) return { title: 'Not found' };

  return buildPageMetadata({
    title: page.headline,
    description: page.subheadline || page.headline,
    path: `/go/${channel}`,
    robots: ROBOTS_NOINDEX_NOFOLLOW,
  });
}

export default async function ChannelLandingPublicPage({ params, searchParams }: Props) {
  const { channel } = await params;
  const sp = await searchParams;
  const isPreviewQuery = sp?.preview === '1';

  const page = resolveChannelLandingPageForGo(channel, { preview: isPreviewQuery });
  if (!page) notFound();

  const showDraftBanner = isPreviewQuery && page.status !== 'published';

  return <ChannelConsultationPortalView page={page} isPreview={showDraftBanner} />;
}
