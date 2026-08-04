import { notFound, redirect } from 'next/navigation';
import { ScholarshipEnrollmentPage } from '@/components/enrollment/ScholarshipEnrollment';
import { certifications } from '@/data/certification-index';
import { resolveOfferingForEnrollment } from '@/lib/enrollment-routes';
import { normalizeScholarshipLevel, normalizeScholarshipMarket } from '@/lib/scholarship';
import { buildPageMetadata } from '@/lib/site-metadata';
import { getStripePublishableKey } from '@/lib/stripe-publishable-key.server';

type Props = { params: Promise<{ id: string; tierSlug: string; market: string }> };

export async function generateMetadata({ params }: Props) {
  const raw = await params;
  const id = raw.id.toLowerCase();
  const tierSlug = normalizeScholarshipLevel(raw.tierSlug) ?? 'professional';
  const cert = certifications.find((item) => item.id === id);
  return buildPageMetadata({
    title: `${cert?.name ?? id.toUpperCase()} ${tierSlug} Mentor-led scholarship enrollment`,
    description: 'Shareable 15% Mentor-led scholarship enrollment. Eligibility and the 15-minute price reservation are enforced by the server.',
    path: `/certifications/${id}/${tierSlug}/enroll`,
    robots: { index: false, follow: false },
  });
}

export default async function Page({ params }: Props) {
  const raw = await params;
  const id = raw.id.toLowerCase();
  const tierSlug = normalizeScholarshipLevel(raw.tierSlug);
  const market = normalizeScholarshipMarket(raw.market);
  if (!tierSlug || !market) notFound();
  const canonicalPath = `/certifications/${id}/${tierSlug}/enroll/${market}`;
  if (raw.id !== id || raw.tierSlug !== tierSlug || raw.market !== market) redirect(canonicalPath);
  const offering = resolveOfferingForEnrollment(id, tierSlug);
  if (!offering) notFound();
  const cert = certifications.find((item) => item.id === id);
  const publishableKeyHint = getStripePublishableKey();
  return (
    <ScholarshipEnrollmentPage
      offeringId={offering.offeringId}
      siteCertId={id}
      tierSlug={tierSlug}
      market={market}
      certName={cert?.name ?? id.toUpperCase()}
      courseName={offering.courseName}
      publishableKeyHint={publishableKeyHint || null}
    />
  );
}
