import type { Metadata } from 'next';
import { TopicsIndexPage } from '@/components/topics/TopicsIndexPage';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Knowledge hubs — PMP & project management topics',
  description:
    'Topic hubs linking PMP 2026 guides, readiness, domains, agile, hybrid, governance, and pathways on PM Structure.',
  path: '/topics',
});

export default function Page() {
  return <TopicsIndexPage />;
}
