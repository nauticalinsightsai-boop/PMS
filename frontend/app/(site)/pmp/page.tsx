import { PmpHubPage } from '@/components/pmp/PmpHubPage';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'PMP exam preparation hub',
  description:
    'Independent PMP exam preparation guides for 2026: timeline, domains, study plans, and pathway selection on PM Structure.',
  path: '/pmp',
});

export default function Page() {
  return <PmpHubPage />;
}
