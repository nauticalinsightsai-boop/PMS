'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRegion } from '@/contexts/RegionContext';
import { getCatalogue } from '@/lib/regional-catalogue';
import {
  getRegisterCertOptions,
  getRegisterOfferingsForCert,
} from '@/lib/register-catalogue-options';
import { submitConsultation } from '@/services/regional';

interface RegisterModalProps {
  trigger?: React.ReactElement;
}

export function RegisterModal({ trigger }: RegisterModalProps) {
  const { regionId, regionLabel, gccCountry } = useRegion();
  const regions = getCatalogue().regions;
  const certOptions = React.useMemo(() => getRegisterCertOptions(), []);
  const [certId, setCertId] = React.useState(certOptions[0]?.siteCertId ?? '');
  const [offeringId, setOfferingId] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const tierOptions = React.useMemo(
    () => (certId ? getRegisterOfferingsForCert(certId, regionId) : []),
    [certId, regionId]
  );

  React.useEffect(() => {
    if (tierOptions.length && !tierOptions.some((t) => t.offeringId === offeringId)) {
      setOfferingId(tierOptions[0].offeringId);
    }
  }, [tierOptions, offeringId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (offeringId) {
      await submitConsultation({
        email,
        offeringId,
        regionId,
        name,
        message: `Pathway registration interest from ${regionLabel}`,
      });
    }
    setSubmitted(true);
  };

  return (
    <Dialog>
      <DialogTrigger
        render={trigger || <Button className="bg-brand-orange hover:bg-brand-hover">Book consultation</Button>}
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-heading">Choose your pathway</DialogTitle>
          <DialogDescription>
            Select certification and tier from the regional catalogue. Current region: {regionLabel}
            {gccCountry ? ` (${gccCountry})` : ''}.
          </DialogDescription>
        </DialogHeader>
        {submitted ? (
          <p className="py-6 text-sm text-green-700">
            Thanks — we received your request.{' '}
            <Link href="/contact" className="underline text-brand-orange">
              Contact us
            </Link>{' '}
            for follow-up.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="certification">Certification</Label>
                <Select value={certId} onValueChange={(v) => v && setCertId(v)}>
                  <SelectTrigger id="certification">
                    <SelectValue placeholder="Choose one" />
                  </SelectTrigger>
                  <SelectContent>
                    {certOptions.map((c) => (
                      <SelectItem key={c.siteCertId} value={c.siteCertId}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tier">Tier</Label>
                <Select value={offeringId} onValueChange={(v) => v && setOfferingId(v)}>
                  <SelectTrigger id="tier">
                    <SelectValue placeholder="Choose tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {tierOptions.map((t) => (
                      <SelectItem key={t.offeringId} value={t.offeringId}>
                        {t.tierLabel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region (from site selector)</Label>
              <Select value={regionId} disabled>
                <SelectTrigger id="region">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-slate-500">
                Change region via the navbar chip before registering.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full bg-brand-purple hover:bg-brand-purple/90 h-12 text-lg">
                Submit pathway request
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
