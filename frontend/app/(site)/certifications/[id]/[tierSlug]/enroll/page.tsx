import { notFound } from 'next/navigation';
import { ProgramEnrollmentPage } from '@/components/pages/ProgramEnrollment';
import { resolveOfferingForEnrollment } from '@/lib/enrollment-routes';
import { buildPageMetadata } from '@/lib/site-metadata';
import * as siteData from '@/data/siteData';

type Props = { params: Promise<{ id: string; tierSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { id, tierSlug } = await params;
  const offering = resolveOfferingForEnrollment(id, tierSlug);
  const certRecord = siteData.certifications.find((c) => c.id === id);
  const title = offering
    ? `Enroll · ${certRecord?.name ?? id} · ${offering.tier}`
    : 'Program enrollment';
  return buildPageMetadata({
    title,
    description: 'Complete program enrollment for your certification pathway.',
    path: `/certifications/${id}/${tierSlug}/enroll`,
    robots: { index: false, follow: false },
  });
}

export default async function Page({ params }: Props) {
  const { id, tierSlug } = await params;
  const offering = resolveOfferingForEnrollment(id, tierSlug);
  if (!offering) notFound();

  const certRecord = siteData.certifications.find((c) => c.id === id);
  const certName = certRecord?.name ?? id.toUpperCase();

  return (
    <ProgramEnrollmentPage
      siteCertId={id}
      tierSlug={tierSlug}
      offeringId={offering.offeringId}
      certName={certName}
    />
  );
}
