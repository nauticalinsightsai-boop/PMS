import { LegalServicesPage } from '@/components/pages/legal/LegalServicesPage';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Services Terms',
  description:
    'Terms that apply to PM Structure certification preparation services, mentoring support, and related learner obligations.',
  path: '/legal/services',
});

export default function Page() {
  return <LegalServicesPage />;
}
