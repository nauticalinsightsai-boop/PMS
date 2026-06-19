import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Membership checkout complete',
  description: 'Your PM Structure membership purchase was recorded.',
  path: '/membership/checkout/success',
  robots: { index: false, follow: false },
});

export default function MembershipCheckoutSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
