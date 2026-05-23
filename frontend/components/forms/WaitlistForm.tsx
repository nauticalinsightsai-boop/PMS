'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { submitWaitlist } from '@/services/regional';
import { useRegion } from '@/contexts/RegionContext';

export function WaitlistForm({ offeringId }: { offeringId?: string }) {
  const { regionId } = useRegion();
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [done, setDone] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitWaitlist({ email, offeringId, regionId, message });
    setDone(true);
  };

  if (done) return <p className="text-sm text-green-700">You are on the waitlist.</p>;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="wl-email">Email</Label>
        <Input id="wl-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="wl-msg">Message (optional)</Label>
        <Textarea id="wl-msg" value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      <Button type="submit" className="rounded-full bg-brand-orange">Join waitlist</Button>
    </form>
  );
}
