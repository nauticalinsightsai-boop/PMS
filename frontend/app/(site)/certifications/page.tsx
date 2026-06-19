import { Certifications } from '@/components/pages/Certifications';
import { CertificationsServerHeading } from '@/components/certifications/CertificationsServerHeading';
import { MarketingPageJsonLd } from '@/components/seo/MarketingPageJsonLd';
import { getPhase2Seo } from '@/content/seo/phase-2-page-seo';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';
import { fetchPublishedDocuments } from '@/lib/cms/fetch-published-document';
import {
  defaultCertificationsHubConfig,
  parseCertificationsHubConfig,
  parseCertificationsRegistry,
  type CertificationsRegistry,
} from '@pms/site-content';
import { FIELD_KEYS } from '@pms/site-content/keys';

const seo = getPhase2Seo('/certifications')!;

export const metadata = buildPhase2PageMetadata('/certifications')!;

const emptyRegistry: CertificationsRegistry = { version: 1, entries: [] };

export default async function Page() {
  const rows = await fetchPublishedDocuments([
    FIELD_KEYS.CERTIFICATIONS_HUB_CONFIG,
    FIELD_KEYS.CERTIFICATIONS_REGISTRY,
  ]);

  const hubRow = rows.find((row) => row.field_key === FIELD_KEYS.CERTIFICATIONS_HUB_CONFIG);
  const registryRow = rows.find((row) => row.field_key === FIELD_KEYS.CERTIFICATIONS_REGISTRY);

  const initialHubConfig = hubRow?.content
    ? parseCertificationsHubConfig(hubRow.content)
    : defaultCertificationsHubConfig();
  const initialRegistry = registryRow?.content
    ? parseCertificationsRegistry(registryRow.content)
    : emptyRegistry;

  return (
    <>
      <MarketingPageJsonLd
        path="/certifications"
        name={seo.title.replace(/\s*\|\s*PM Structure$/, '')}
        description={seo.description}
        collection
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Certifications', path: '/certifications' },
        ]}
      />
      <CertificationsServerHeading />
      <Certifications initialHubConfig={initialHubConfig} initialRegistry={initialRegistry} />
    </>
  );
}
