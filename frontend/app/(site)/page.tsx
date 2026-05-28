import { Home } from '@/components/pages/Home';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'PMP & project management exam prep',
  description:
    'Independent PMI, PRINCE2, and Six Sigma exam preparation with structured pathways and regional scholarship pricing.',
  path: '/',
});

export default function Page() {
  return <Home />;
}
