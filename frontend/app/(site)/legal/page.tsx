import { LegalHub } from '@/components/pages/legal/LegalHub';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Legal & compliance',
  description: 'Terms, privacy, cookies, services, regional pricing, refunds, and compliance policies.',
  path: '/legal',
});

export default function Page() {
  return <LegalHub />;
}
