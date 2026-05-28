import { Certifications } from '@/components/pages/Certifications';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Certification pathways',
  description: 'Explore PMI, PRINCE2, and Lean Six Sigma exam preparation pathways with regional pricing.',
  path: '/certifications',
});

export default function Page() {
  return <Certifications />;
}
