import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Checkout complete',
  description: 'Your checkout request was recorded. Our team will follow up by email.',
  path: '/checkout/success',
  robots: { index: false, follow: false },
});

export default function CheckoutSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
