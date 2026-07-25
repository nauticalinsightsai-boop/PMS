import type { Metadata } from 'next';
import { LegalCookiesPage } from '@/components/pages/legal/LegalCookiesPage';
import { BRAND } from '@/lib/brand-voice';

export const metadata: Metadata = {
  title: `Cookie Policy | ${BRAND.name}`,
};

export default function Page() {
  return <LegalCookiesPage />;
}
