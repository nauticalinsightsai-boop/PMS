import { LegalPrivacyRegionPage } from '@/components/pages/legal/LegalPrivacyPage';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Privacy Policy (GCC)',
  description:
    'PM Structure privacy policy for people in the GCC, explaining how personal data is collected, used, stored, and protected.',
  path: '/legal/privacy/gcc',
});

export default function Page() {
  return <LegalPrivacyRegionPage region="gcc" />;
}
