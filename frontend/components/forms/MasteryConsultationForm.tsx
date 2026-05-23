'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRegion } from '@/contexts/RegionContext';
import { submitConsultation } from '@/services/regional';

export function MasteryConsultationForm({ offeringId }: { offeringId: string }) {
  const { regionId } = useRegion();
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [done, setDone] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitConsultation({ email, name, notes, offeringId, regionId });
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
        <Input id="mc-name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="mc-email">Email</Label>
        <Input id="mc-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="mc-notes">Goals & timeline</Label>
        <Textarea id="mc-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
      </div>
      <Button type="submit" className="bg-brand-orange rounded-full">
        Request Mastery consultation
      </Button>
    </form>
  );
}
