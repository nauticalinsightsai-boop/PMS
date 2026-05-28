import { PMService } from '@/components/pages/PMService';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Advisory & corporate training',
  description: 'Pathway consultation, readiness reviews, and corporate PM training services.',
  path: '/pm-service',
});

export default function Page() {
  return <PMService />;
}
