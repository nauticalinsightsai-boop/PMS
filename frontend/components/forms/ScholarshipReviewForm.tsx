'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { submitPublicInteraction } from '@/lib/interactions/submit-public';
import { offeringFormContext } from '@/lib/interactions/offering-form-context';
import { useRegion } from '@/contexts/RegionContext';
import { useSimpleFormRecovery } from '@/components/conversion-recovery/useSimpleFormRecovery';

export function ScholarshipReviewForm({ offeringId }: { offeringId?: string }) {
  const { regionId } = useRegion();
  const [email, setEmail] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [done, setDone] = React.useState(false);
  const { touch, onSuccess } = useSimpleFormRecovery({
    variant: 'scholarship_partial',
    isDone: done,
    hasPartialData: Boolean(email.trim() || notes.trim()),
    offeringId,
    parentSurface: 'contact',
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ctx = offeringFormContext('scholarship_review', 'Scholarship review', offeringId, regionId);
    await submitPublicInteraction({
      source: 'scholarship_review',
      subject: `Scholarship review: ${ctx.certName ?? offeringId ?? 'general'}`,
      email,
      formContext: ctx,
      payload: { notes, offeringId, regionId },
    });
    onSuccess();
    setDone(true);
  };

  if (done) return <p className="text-sm text-green-700">Request submitted. We will review eligibility.</p>;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="sr-email">Email</Label>
        <Input id="sr-email" type="email" required value={email} onChange={(e) => { setEmail(e.target.value); touch(); }} />
      </div>
      <div>
        <Label htmlFor="sr-notes">Notes</Label>
        <Textarea id="sr-notes" value={notes} onChange={(e) => { setNotes(e.target.value); touch(); }} />
      </div>
      <Button type="submit" className="rounded-full bg-brand-orange">Request review</Button>
    </form>
  );
}