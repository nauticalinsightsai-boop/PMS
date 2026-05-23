'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RegionalPrice } from '@/components/RegionalPrice';
import { useRegion } from '@/contexts/RegionContext';
import { useRegionalOffering } from '@/hooks/useRegionalOffering';
import { createCheckoutSession, verifyRegion } from '@/services/regional';
import { REGION_COPY } from '@/lib/brand-voice';

export function CheckoutForm() {
  const params = useSearchParams();
  const offeringId = params.get('offering') ?? '';
  const data = useRegionalOffering(offeringId);
  const { regionId, gccCountry } = useRegion();
  const [email, setEmail] = React.useState('');
  const [residence, setResidence] = React.useState('');
  const [billing, setBilling] = React.useState('');
  const [hasMembership, setHasMembership] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  if (!offeringId) {
    return <p className="text-slate-500">Select an offering from a certification pathway.</p>;
  }

  if (!data) {
    return <p className="text-slate-500">Offering not found.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const verification = await verifyRegion({
        regionId,
        residenceCountry: residence,
        billingCountry: billing,
        gccCountry,
      });
      if (verification.error) {
        setError(verification.error);
        setLoading(false);
        return;
      }
      if (data.rule.status === 'scholarship_verify' && !verification.data?.result?.verified) {
        setError(verification.data?.result?.message ?? 'Verification failed');
        setLoading(false);
        return;
      }
      const checkout = await createCheckoutSession({
        offeringId,
        regionId,
        residenceCountry: residence,
        billingCountry: billing,
        email,
        gccCountry,
        hasMembership,
      });
      if (checkout.error) {
        setError(checkout.error);
      } else if (checkout.data?.session?.url) {
        window.location.href = checkout.data.session.url;
      } else {
        window.location.href = `/checkout/success?offering=${offeringId}`;
      }
    } catch {
      setError('Checkout request failed. Try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">{data.offering.courseName}</h2>
        <p className="text-sm text-slate-500">{data.offering.tier}</p>
      </div>

      <RegionalPrice
        original={data.prices.original}
        active={data.prices.active}
        membership={hasMembership ? data.prices.membership : null}
        showScholarshipLabels={data.showScholarshipLabels}
        regionalLabel={data.prices.regionalLabel}
        footnote={data.rule.regionMessage ?? data.prices.footnote}
        variant="full"
      />

      <label className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-4 cursor-pointer">
        <input
          type="checkbox"
          className="mt-1"
          checked={hasMembership}
          onChange={(e) => setHasMembership(e.target.checked)}
        />
        <span className="text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold block text-slate-900 dark:text-white">
            I have an active membership
          </span>
          {REGION_COPY.membershipDiscountNote}
          {hasMembership && data.membershipUsdCents != null && (
            <span className="block mt-2 text-brand-purple font-bold">
              Checkout amount: ${(data.membershipUsdCents / 100).toLocaleString()} USD equivalent
            </span>
          )}
        </span>
      </label>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="residence">Country of residence</Label>
          <Input id="residence" required value={residence} onChange={(e) => setResidence(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="billing">Billing country</Label>
          <Input id="billing" required value={billing} onChange={(e) => setBilling(e.target.value)} />
        </div>
      </div>

      <p className="text-xs text-slate-500">{REGION_COPY.checkoutNote}</p>
      <p className="text-xs text-slate-500">{REGION_COPY.compliance}</p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full rounded-full bg-brand-orange">
        {loading ? 'Processing…' : 'Continue to payment'}
      </Button>
    </form>
  );
}
