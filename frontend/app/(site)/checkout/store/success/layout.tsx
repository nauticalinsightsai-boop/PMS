import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Store purchase complete',
  description: 'Your resource store purchase was recorded.',
  path: '/checkout/store/success',
  robots: { index: false, follow: false },
});

export default function StoreCheckoutSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
