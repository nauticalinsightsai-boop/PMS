import { PMService } from '@/components/pages/PMService';
import { PmServiceJsonLd } from '@/components/seo/PmServiceJsonLd';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';
import { fetchPublishedDocument } from '@/lib/cms/fetch-published-document';
import {
  defaultServicesPageConfig,
  parseServicesPageConfig,
} from '@pms/site-content';
import { FIELD_KEYS } from '@pms/site-content/keys';

export const metadata = buildPhase2PageMetadata('/pm-service')!;

export default async function Page() {
  const initialPageConfig = await fetchPublishedDocument(
    FIELD_KEYS.SERVICES_PAGE_CONFIG,
    (raw) => (raw ? parseServicesPageConfig(raw) : null),
    defaultServicesPageConfig(),
  );

  return (
    <>
      <PmServiceJsonLd />
      <PMService initialPageConfig={initialPageConfig} />
    </>
  );
}
