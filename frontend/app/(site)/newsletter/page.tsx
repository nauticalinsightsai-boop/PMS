import { Newsletter } from '@/components/pages/Newsletter';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';
import { getNewsletterPageData } from '@/lib/newsletter/page-data';

export const dynamic = 'force-dynamic';

export const metadata = buildPhase2PageMetadata('/newsletter')!;

export default async function Page() {
  const { hub, articles, topicNames } = await getNewsletterPageData();

  return (
    <Newsletter
      initialHub={hub}
      initialArticles={articles}
      initialTopicNames={topicNames}
    />
  );
}
