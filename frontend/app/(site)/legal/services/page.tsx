import type { Metadata } from 'next';
import { LegalServicesPage } from '@/components/pages/legal/LegalServicesPage';
import { BRAND } from '@/lib/brand-voice';

export const metadata: Metadata = {
  title: `Services Terms | ${BRAND.name}`,
};

export default function Page() {
  return <LegalServicesPage />;
}
