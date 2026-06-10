import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Checkout cancelled',
  description: 'Your checkout was cancelled. You can retry or browse certification pathways.',
  path: '/checkout/cancel',
  robots: { index: false, follow: false },
});

export default function CheckoutCancelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
