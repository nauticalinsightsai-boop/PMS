'use client';

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { enrollmentProceedLabelForTier } from '@/lib/enrollment/enrollment-copy';
import { PMP_ENROLL_LINKS } from '@/content/pmp/services';
import { EnrollReturnRecovery } from '@/components/conversion-recovery/EnrollReturnRecovery';
import { PmpEnrollTrackedLink } from '@/components/conversion-recovery/PmpEnrollTrackedLink';
import { CONVERSION_EVENTS } from '@/lib/analytics/conversion-events';

const ENROLL_EVENTS = {
  Foundation: CONVERSION_EVENTS.CLICK_ENROLL_PMP_FOUNDATION,
  Professional: CONVERSION_EVENTS.CLICK_ENROLL_PMP_PROFESSIONAL,
  Mastery: CONVERSION_EVENTS.CLICK_ENROLL_PMP_MASTERY,
} as const;

const TIER_SLUGS = {
  Foundation: 'foundation',
  Professional: 'professional',
  Mastery: 'mastery',
} as const;

export function PmpEnrollmentTierLinks() {
  return (
    <>
      <EnrollReturnRecovery siteCertId="pmp" certName="PMP" />
      <ul className="space-y-4">
        {PMP_ENROLL_LINKS.map((link) => (
          <li
            key={link.tier}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
          >
            <div>
              <p className="font-semibold">{link.tier}</p>
              <Link href={link.path} className="text-sm text-brand-orange hover:underline">
                View {link.tier} pathway page
              </Link>
            </div>
            <PmpEnrollTrackedLink
              href={link.enrollPath}
              tierSlug={TIER_SLUGS[link.tier]}
              event={ENROLL_EVENTS[link.tier]}
              className={buttonVariants({ size: 'sm' })}
            >
              {enrollmentProceedLabelForTier(TIER_SLUGS[link.tier])}
            </PmpEnrollTrackedLink>
          </li>
        ))}
      </ul>
    </>
  );
}
