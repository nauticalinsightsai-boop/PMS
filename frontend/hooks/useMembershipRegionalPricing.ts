'use client';

import { useMemo } from 'react';
import { useRegion } from '@/contexts/RegionContext';
import {
  getRegionalMembershipAmounts,
  type RegionalMembershipAmounts,
} from '@/lib/membership-regional-pricing';

export function useMembershipRegionalPricing(
  monthlyUsd: number,
  yearlyUsd: number,
): RegionalMembershipAmounts {
  const { regionId, gccCountry } = useRegion();

  return useMemo(
    () => getRegionalMembershipAmounts(monthlyUsd, yearlyUsd, regionId, gccCountry),
    [monthlyUsd, yearlyUsd, regionId, gccCountry],
  );
}
