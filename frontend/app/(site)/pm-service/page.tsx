import { PMService } from '@/components/pages/PMService';
import { PmServiceJsonLd } from '@/components/seo/PmServiceJsonLd';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';

export const metadata = buildPhase2PageMetadata('/pm-service')!;

export default function Page() {
  return (
    <>
      <PmServiceJsonLd />
      <PMService />
    </>
  );
}
