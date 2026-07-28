import { LegalServicesPage } from '@/components/pages/legal/LegalServicesPage';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Services Terms',
  description:
    'Terms for PM Structure advisory, consultation, readiness review, and corporate training services.',
  path: '/legal/services',
});

export default function Page() {
  return <LegalServicesPage />;
}
