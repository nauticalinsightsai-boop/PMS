import { notFound } from 'next/navigation';
import { ProgramEnrollmentPage } from '@/components/pages/ProgramEnrollment';
import { resolveOfferingForEnrollment } from '@/lib/enrollment-routes';
import {
  ELITE_SCHOLARSHIP_HEADING,
  isScholarshipTier,
} from '@/lib/enrollment/scholarship-offer';
import { buildPageMetadata } from '@/lib/site-metadata';
import { getStripePublishableKey } from '@/lib/stripe-publishable-key.server';
import { certifications } from '@/data/certification-index';

type Props = { params: Promise<{ id: string; tierSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { id, tierSlug } = await params;
  const offering = resolveOfferingForEnrollment(id, tierSlug);
  const certRecord = certifications.find((c) => c.id === id);
  const title = offering
    ? `Elite scholarship · ${certRecord?.name ?? id} · ${offering.tier}`
    : 'Elite scholarship';
  return buildPageMetadata({
    title,
    description: `${ELITE_SCHOLARSHIP_HEADING} Global −15% or GCC −30% vs Global mentor-led catalogue. 20-minute checkout session.`,
    path: `/certifications/${id}/${tierSlug}/enroll/scholarship`,
    robots: { index: false, follow: false },
  });
}

export default async function ScholarshipEnrollPage({ params }: Props) {
  const { id, tierSlug } = await params;
  if (!isScholarshipTier(tierSlug)) notFound();

  const offering = resolveOfferingForEnrollment(id, tierSlug);
  if (!offering) notFound();
  if (offering.tierId === 'foundation') notFound();

  const certRecord = certifications.find((c) => c.id === id);
  const certName = certRecord?.name ?? id.toUpperCase();
  const publishableKeyHint = getStripePublishableKey();

  return (
    <ProgramEnrollmentPage
      siteCertId={id}
      tierSlug={tierSlug}
      offeringId={offering.offeringId}
      certName={certName}
      publishableKeyHint={publishableKeyHint || null}
      scholarshipMode
    />
  );
}
