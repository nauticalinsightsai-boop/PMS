import * as React from 'react';
import AE from 'country-flag-icons/react/3x2/AE';
import BH from 'country-flag-icons/react/3x2/BH';
import EU from 'country-flag-icons/react/3x2/EU';
import GB from 'country-flag-icons/react/3x2/GB';
import IN from 'country-flag-icons/react/3x2/IN';
import KW from 'country-flag-icons/react/3x2/KW';
import OM from 'country-flag-icons/react/3x2/OM';
import PK from 'country-flag-icons/react/3x2/PK';
import QA from 'country-flag-icons/react/3x2/QA';
import SA from 'country-flag-icons/react/3x2/SA';
import US from 'country-flag-icons/react/3x2/US';
import { cn } from '@/lib/utils';

export type RegionFlagCode =
  | 'us'
  | 'uk'
  | 'eu'
  | 'ae'
  | 'sa'
  | 'qa'
  | 'bh'
  | 'kw'
  | 'om'
  | 'pk'
  | 'in';

const FLAG_COMPONENTS: Record<RegionFlagCode, React.ComponentType<{ className?: string }>> = {
  us: US,
  uk: GB,
  eu: EU,
  ae: AE,
  sa: SA,
  qa: QA,
  bh: BH,
  kw: KW,
  om: OM,
  pk: PK,
  in: IN,
};

const FLAG_LABELS: Record<RegionFlagCode, string> = {
  us: 'United States',
  uk: 'United Kingdom',
  eu: 'Europe',
  ae: 'United Arab Emirates',
  sa: 'Saudi Arabia',
  qa: 'Qatar',
  bh: 'Bahrain',
  kw: 'Kuwait',
  om: 'Oman',
  pk: 'Pakistan',
  in: 'India',
};

const flagClassName = 'h-[22px] w-8 shrink-0';

export function RegionFlag({ code, className }: { code: RegionFlagCode; className?: string }) {
  const Flag = FLAG_COMPONENTS[code];
  const label = FLAG_LABELS[code];

  return (
    <span
      className={cn(
        'inline-flex overflow-hidden rounded-[4px] border border-black/10 shadow-sm',
        className,
      )}
      role="img"
      aria-label={label}
    >
      <Flag className={flagClassName} />
    </span>
  );
}
