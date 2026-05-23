'use client';

import { useSearchParams } from 'next/navigation';
import { ScholarshipReviewForm } from '@/components/forms/ScholarshipReviewForm';
import { WaitlistForm } from '@/components/forms/WaitlistForm';
import { MasteryConsultationForm } from '@/components/forms/MasteryConsultationForm';

export function ContactRegionalExtras() {
  const params = useSearchParams();
  const topic = params.get('topic');
  const offeringId = params.get('offering') ?? undefined;

  if (topic === 'scholarship') {
    return (
      <div className="mt-8 rounded-2xl border p-6">
        <h3 className="font-bold mb-4">Scholarship review request</h3>
        <ScholarshipReviewForm offeringId={offeringId} />
      </div>
    );
  }
  if (topic === 'waitlist') {
    return (
      <div className="mt-8 rounded-2xl border p-6">
        <h3 className="font-bold mb-4">Join waitlist</h3>
        <WaitlistForm offeringId={offeringId} />
      </div>
    );
  }
  if (topic === 'consultation' && offeringId) {
    return (
      <div className="mt-8 rounded-2xl border p-6">
        <h3 className="font-bold mb-4">Mastery pathway consultation</h3>
        <MasteryConsultationForm offeringId={offeringId} />
      </div>
    );
  }
  return null;
}
