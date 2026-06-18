import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TopicHubPage } from '@/components/topics/TopicHubPage';
import {
  getPublishedTopicHubs,
  getTopicHub,
  isTopicPublished,
} from '@/content/topics';
import { buildPageMetadata } from '@/lib/site-metadata';
import { getPhase2Seo, titleNeedsNoSuffix } from '@/content/seo/phase-2-page-seo';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedTopicHubs().map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hub = getTopicHub(slug);
  if (!hub) return {};
  const phase2 = getPhase2Seo(hub.path);
  if (phase2) {
    return buildPageMetadata({
      title: phase2.title,
      description: phase2.description,
      path: phase2.canonicalPath,
      noSuffix: titleNeedsNoSuffix(phase2.title),
      ...(hub.status && !isTopicPublished(hub) ? { robots: { index: false, follow: false } } : {}),
    });
  }
  const title = hub.title.includes('| PM Structure')
    ? hub.title
    : `${hub.title} | PM Structure`;
  return buildPageMetadata({
    title,
    description: hub.description,
    path: hub.path,
    ...(hub.status && !isTopicPublished(hub) ? { robots: { index: false, follow: false } } : {}),
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const hub = getTopicHub(slug);
  if (!hub || !isTopicPublished(hub)) notFound();
  return <TopicHubPage hub={hub} />;
}
