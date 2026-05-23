'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { submitScholarshipReview } from '@/services/regional';
import { useRegion } from '@/contexts/RegionContext';

export function ScholarshipReviewForm({ offeringId }: { offeringId?: string }) {
  const { regionId } = useRegion();
  const [email, setEmail] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [done, setDone] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitScholarshipReview({ email, offeringId, regionId, notes });
    setDone(true);
  };

  if (done) return <p className="text-sm text-green-700">Request submitted. We will review eligibility.</p>;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="sr-email">Email</Label>
        <Input id="sr-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="sr-notes">Notes</Label>
        <Textarea id="sr-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <Button type="submit" className="rounded-full bg-brand-orange">Request review</Button>
    </form>
  );
}
