import { notFound } from 'next/navigation';
import { ProgramEnrollmentSuccessPage } from '@/components/pages/ProgramEnrollmentSuccess';
import { resolveOfferingForEnrollment } from '@/lib/enrollment-routes';
import { buildPageMetadata } from '@/lib/site-metadata';
import * as siteData from '@/data/siteData';

type Props = { params: Promise<{ id: string; tierSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { id, tierSlug } = await params;
  return buildPageMetadata({
    title: 'Enrollment confirmed',
    description: 'Your pathway enrollment is confirmed. Check your email for details.',
    robots: { index: false, follow: false },
    path: `/certifications/${id}/${tierSlug}/enroll/success`,
  });
}

export default async function Page({ params }: Props) {
  const { id, tierSlug } = await params;
  if (!resolveOfferingForEnrollment(id, tierSlug)) notFound();

  const certRecord = siteData.certifications.find((c) => c.id === id);
  const certName = certRecord?.name ?? id.toUpperCase();

  return (
    <ProgramEnrollmentSuccessPage siteCertId={id} tierSlug={tierSlug} certName={certName} />
  );
}
