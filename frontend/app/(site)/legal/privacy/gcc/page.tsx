import { LegalPrivacyRegionPage } from '@/components/pages/legal/LegalPrivacyPage';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Privacy Policy (GCC)',
  description:
    'Regional privacy notice for the GCC: how PM Structure collects, uses, and protects personal data for learners and site visitors.',
  path: '/legal/privacy/gcc',
});

export default function Page() {
  return <LegalPrivacyRegionPage region="gcc" />;
}
