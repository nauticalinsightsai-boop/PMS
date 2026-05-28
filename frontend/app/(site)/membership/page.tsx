import { Membership } from '@/components/pages/Membership';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Membership plans',
  description: 'Membership tiers with community access and 20% off eligible certification pathway tuition.',
  path: '/membership',
});

export default function Page() {
  return <Membership />;
}
