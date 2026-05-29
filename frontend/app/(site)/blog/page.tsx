import { Blog } from '@/components/pages/Blog';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Blog',
  description: 'Certification strategies, safety leadership, and professional development from PM Structure.',
  path: '/blog',
});

export default function Page() {
  return <Blog />;
}
