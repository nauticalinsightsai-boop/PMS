import { CertificationDetail } from '@/components/pages/CertificationDetail';
import { CertJsonLd } from '@/components/seo/CertJsonLd';
import { buildCertMetadata } from '@/lib/site-metadata';
import * as siteData from '@/data/siteData';

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return siteData.certifications.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return buildCertMetadata(id);
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return (
    <>
      <CertJsonLd certId={id} />
      <CertificationDetail />
    </>
  );
}
