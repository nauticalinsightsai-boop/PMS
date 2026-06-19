'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRegion } from '@/contexts/RegionContext';
import { submitPublicInteraction } from '@/lib/interactions/submit-public';
import { offeringFormContext } from '@/lib/interactions/offering-form-context';
import { useSimpleFormRecovery } from '@/components/conversion-recovery/useSimpleFormRecovery';

export function MasteryConsultationForm({ offeringId }: { offeringId: string }) {
  const { regionId } = useRegion();
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const { touch, onSuccess } = useSimpleFormRecovery({
    variant: 'mastery_form_partial',
    isDone: done,
    hasPartialData: Boolean(name.trim() || email.trim() || notes.trim()),
    offeringId,
    parentSurface: 'contact',
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const ctx = offeringFormContext('mastery_consultation', 'Mastery consultation', offeringId, regionId);
    const res = await submitPublicInteraction({
      source: 'consultation',
      subject: `Mastery consultation: ${ctx.certName ?? offeringId}`,
      email,
      formContext: ctx,
      payload: { name, notes, offeringId, regionId, topic: 'mastery_consultation' },
    });
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error ?? 'Could not submit your request. Please try again.');
      return;
    }
    onSuccess();
    setDone(true);
  };

  if (done) {
    return (
      <p className="text-sm text-green-700">
        Consultation request received. Mastery checkout is enabled after manual approval.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="mc-name">Full name</Label>
        <Input id="mc-name" required value={name} onChange={(e) => { setName(e.target.value); touch(); }} />
      </div>
      <div>
        <Label htmlFor="mc-email">Email</Label>
        <Input id="mc-email" type="email" required value={email} onChange={(e) => { setEmail(e.target.value); touch(); }} />
      </div>
      <div>
        <Label htmlFor="mc-notes">Goals & timeline</Label>
        <Textarea id="mc-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
      </div>
      <Button type="submit" disabled={submitting} className="bg-brand-orange rounded-full">
        {submitting ? 'Submitting…' : 'Request Mastery consultation'}
      </Button>
      {error ? <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p> : null}
    </form>
  );
}