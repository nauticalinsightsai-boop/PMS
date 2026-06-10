import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TopicHubPage } from '@/components/topics/TopicHubPage';
import { TOPIC_SLUGS, getTopicHub } from '@/content/topics/hubs';
import { buildPageMetadata } from '@/lib/site-metadata';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TOPIC_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hub = getTopicHub(slug);
  if (!hub) return {};
  return buildPageMetadata({
    title: hub.title,
    description: hub.description,
    path: hub.path,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const hub = getTopicHub(slug);
  if (!hub) notFound();
  return <TopicHubPage hub={hub} />;
}
