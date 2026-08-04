import { notFound } from 'next/navigation';
import { ProgramEnrollmentPage } from '@/components/pages/ProgramEnrollment';
import { resolveOfferingForEnrollment } from '@/lib/enrollment-routes';
import { isScholarshipTier } from '@/lib/enrollment/scholarship-offer';
import { buildPageMetadata } from '@/lib/site-metadata';
import { getStripePublishableKey } from '@/lib/stripe-publishable-key.server';
import { certifications } from '@/data/certification-index';
import { enrollmentHeadingForTier, enrollmentMetadataDescriptionForTier } from '@/lib/enrollment/enrollment-copy';

type Props = { params: Promise<{ id: string; tierSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { id, tierSlug } = await params;
  const offering = resolveOfferingForEnrollment(id, tierSlug);
  const certRecord = certifications.find((c) => c.id === id);
  const heading = enrollmentHeadingForTier(tierSlug);
  const title = offering
    ? `${heading} Scholarship · ${certRecord?.name ?? id} · ${offering.tier}`
    : `${heading} Scholarship`;
  return buildPageMetadata({
    title,
    description: `Invite scholarship checkout — 15% off mentor-led tuition. ${enrollmentMetadataDescriptionForTier(tierSlug)}`,
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
