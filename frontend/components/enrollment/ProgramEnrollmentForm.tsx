'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RegionalPrice } from '@/components/RegionalPrice';
import { useRegion } from '@/contexts/RegionContext';
import { useRegionalOffering } from '@/hooks/useRegionalOffering';
import { createCheckoutSession, verifyRegion } from '@/services/regional';
import { REGION_COPY } from '@/lib/brand-voice';
import {
  defaultCountriesForRegion,
  ENROLLMENT_COUNTRIES,
} from '@/lib/enrollment-country-options';
import { enrollSuccessPath } from '@/lib/enrollment-routes';
import { getOfferingById } from '@/lib/regional-catalogue';

type ProgramEnrollmentFormProps = {
  offeringId: string;
  siteCertId: string;
  tierSlug: string;
};

export function ProgramEnrollmentForm({ offeringId, siteCertId, tierSlug }: ProgramEnrollmentFormProps) {
  const data = useRegionalOffering(offeringId);
  const { regionId, gccCountry, isReady } = useRegion();
  const [email, setEmail] = React.useState('');
  const [residence, setResidence] = React.useState('');
  const [billing, setBilling] = React.useState('');
  const [hasMembership, setHasMembership] = React.useState(false);
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isReady) return;
    const defaults = defaultCountriesForRegion(regionId, gccCountry);
    setResidence((prev) => prev || defaults.residence);
    setBilling((prev) => prev || defaults.billing);
  }, [isReady, regionId, gccCountry]);

  if (!data) {
    return <p className="text-slate-500">Offering not found.</p>;
  }

  const successPath = enrollSuccessPath(siteCertId, tierSlug);
  const offeringMeta = getOfferingById(offeringId);
  const tierLabel = offeringMeta?.tier ?? tierSlug.replace(/-/g, ' ');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError('Please accept the Terms & Conditions and Privacy Policy to continue.');
      return;
    }
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
        setError(verification.data?.result?.message ?? 'Could not confirm regional scholarship eligibility.');
        setLoading(false);
        return;
      }

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const successUrl = `${origin}${successPath}?offering=${encodeURIComponent(offeringId)}`;
      const cancelUrl = `${origin}/certifications/${siteCertId}/${tierSlug}/enroll`;

      const checkout = await createCheckoutSession({
        offeringId,
        regionId,
        residenceCountry: residence,
        billingCountry: billing,
        email,
        gccCountry,
        hasMembership,
        successUrl,
        cancelUrl,
      });
      if (checkout.error) {
        setError(checkout.error);
      } else if (checkout.data?.session?.url) {
        window.location.href = checkout.data.session.url;
      } else {
        window.location.href = `${successPath}?offering=${encodeURIComponent(offeringId)}`;
      }
    } catch {
      setError('Enrollment request failed. Try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">{data.offering.courseName}</h2>
        <p className="text-sm text-slate-500">{tierLabel}</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Complete your details below. Country fields are pre-filled from your selected region — you can change them
          if needed.
        </p>
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

      <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 cursor-pointer dark:border-slate-700">
        <input
          type="checkbox"
          className="mt-1"
          checked={hasMembership}
          onChange={(e) => setHasMembership(e.target.checked)}
        />
        <span className="text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold block text-slate-900 dark:text-white">I have an active membership</span>
          {REGION_COPY.membershipDiscountNote}
          {hasMembership && data.membershipUsdCents != null && (
            <span className="block mt-2 text-brand-purple font-bold">
              Enrollment amount: ${(data.membershipUsdCents / 100).toLocaleString()} USD equivalent
            </span>
          )}
        </span>
      </label>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="mt-1 text-xs text-slate-500">
            Enrollment details will be sent to this address after you complete payment.
          </p>
        </div>
        <div>
          <Label htmlFor="residence">Country of residence</Label>
          <Select value={residence || undefined} onValueChange={(v) => setResidence(v ?? '')} required>
            <SelectTrigger id="residence" className="w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {ENROLLMENT_COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="billing">Billing country</Label>
          <Select value={billing || undefined} onValueChange={(v) => setBilling(v ?? '')} required>
            <SelectTrigger id="billing" className="w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {ENROLLMENT_COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-xs text-slate-500">{REGION_COPY.checkoutNote}</p>

      <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 cursor-pointer dark:border-slate-700">
        <input
          type="checkbox"
          className="mt-1"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
        />
        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
          I agree to the{' '}
          <Link href="/legal/terms" className="text-brand-orange font-bold hover:underline">
            Terms &amp; Conditions
          </Link>{' '}
          and{' '}
          <Link href="/legal/privacy" className="text-brand-orange font-bold hover:underline">
            Privacy Policy
          </Link>
          , and I understand pricing excludes official exam and third-party fees (
          <Link href="/legal/pricing-disclaimers" className="text-brand-orange font-bold hover:underline">
            details
          </Link>
          ).
        </span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button
        type="submit"
        disabled={loading || !acceptedTerms || !residence || !billing}
        className="w-full rounded-full bg-brand-orange"
      >
        {loading ? 'Processing…' : 'Continue to payment'}
      </Button>
    </form>
  );
}
