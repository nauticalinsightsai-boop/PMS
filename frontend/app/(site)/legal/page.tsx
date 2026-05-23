import type { Metadata } from 'next';
import { LegalHub } from '@/components/pages/legal/LegalHub';
import { BRAND } from '@/lib/brand-voice';

export const metadata: Metadata = {
  title: `Legal & compliance | ${BRAND.name}`,
  description: 'Terms, privacy, cookies, services, and pricing policies.',
};

export default function Page() {
  return <LegalHub />;
}
