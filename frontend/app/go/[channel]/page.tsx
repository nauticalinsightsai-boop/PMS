import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedGoChannelSlugs } from '@pms/booking-crm';
import { resolveChannelLandingPageForGo } from '@pms/booking-crm/repository';
import ChannelConsultationPortalView from '@/components/channel-landing/ChannelConsultationPortalView';

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

  const published = page.status === 'published' && !isPreview;
  return {
    title: `${page.headline} | PM Structure`,
    description: page.subheadline || page.headline,
    robots: published ? { index: true, follow: true } : { index: false, follow: false },
    alternates: { canonical: `/go/${channel}` },
  };
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
