import { notFound } from 'next/navigation';
import { ProgramEnrollmentPage } from '@/components/pages/ProgramEnrollment';
import { resolveOfferingForEnrollment } from '@/lib/enrollment-routes';
import { buildPageMetadata } from '@/lib/site-metadata';
import { getStripePublishableKey } from '@/lib/stripe-publishable-key.server';
import { certifications } from '@/data/certification-index';

type Props = { params: Promise<{ id: string; tierSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { id, tierSlug } = await params;
  const offering = resolveOfferingForEnrollment(id, tierSlug);
  const certRecord = certifications.find((c) => c.id === id);
  const title = offering
    ? `Reserve your seat · ${certRecord?.name ?? id} · ${offering.tier}`
    : 'Reserve your seat';
  return buildPageMetadata({
    title,
    description: 'Reserve a seat on your certification pathway with a deposit. Onboarding within 24 hours.',
    path: `/certifications/${id}/${tierSlug}/enroll`,
    robots: { index: false, follow: false },
  });
}

export default async function Page({ params }: Props) {
  const { id, tierSlug } = await params;
  const offering = resolveOfferingForEnrollment(id, tierSlug);
  if (!offering) notFound();

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
    />
  );
}
