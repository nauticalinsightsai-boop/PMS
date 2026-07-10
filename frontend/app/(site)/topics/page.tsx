import type { Metadata } from 'next';
import { TopicsIndexPage } from '@/components/topics/TopicsIndexPage';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Project Management Topics',
  description:
    'Topic hubs linking PMP 2026 guides, readiness, domains, agile, hybrid, governance, pathways, and FAQs on PM Structure.',
  path: '/topics',
});

export default function Page() {
  return <TopicsIndexPage />;
}
