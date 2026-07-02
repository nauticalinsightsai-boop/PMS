import { CertificationDetail } from '@/components/pages/CertificationDetail';
import { CertificationDetailHeroServer } from '@/components/certifications/CertificationDetailHeroServer';
import { CertJsonLd } from '@/components/seo/CertJsonLd';
import { buildCertMetadata } from '@/lib/site-metadata';
import { fetchPublishedDocument } from '@/lib/cms/fetch-published-document';
import {
  parseCertificationsRegistry,
  type CertificationsRegistry,
} from '@pms/site-content';
import { FIELD_KEYS } from '@pms/site-content/keys';
import { certifications } from '@/data/certification-index';

type Props = { params: Promise<{ id: string }> };

const emptyRegistry: CertificationsRegistry = { version: 1, entries: [] };

export const revalidate = 300;

export function generateStaticParams() {
  return certifications.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return buildCertMetadata(id);
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const initialRegistry = await fetchPublishedDocument(
    FIELD_KEYS.CERTIFICATIONS_REGISTRY,
    (raw) => (raw ? parseCertificationsRegistry(raw) : null),
    emptyRegistry,
  );

  return (
    <>
      <CertJsonLd certId={id} />
      <CertificationDetail certId={id} initialRegistry={initialRegistry}>
        <CertificationDetailHeroServer certId={id} initialRegistry={initialRegistry} />
      </CertificationDetail>
    </>
  );
}
