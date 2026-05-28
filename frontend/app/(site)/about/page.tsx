import { About } from '@/components/pages/About';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'About PM Structure',
  description: 'Independent exam-preparation platform for project management certifications.',
  path: '/about',
});

export default function Page() {
  return <About />;
}
