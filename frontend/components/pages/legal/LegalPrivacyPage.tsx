'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  getPrivacyDocument,
  resolveDefaultPrivacyPath,
  type LegalRegionSlug,
  type GccCountryLegalSlug,
} from '@/content/legal';
import { useRegion } from '@/contexts/RegionContext';
import { LegalDocumentLayout } from '@/components/legal/LegalDocumentLayout';
import { LegalRegionSwitcher } from '@/components/legal/LegalRegionSwitcher';

export function LegalPrivacyPage({
  region = 'global',
  gccCountry = null,
}: {
  region?: LegalRegionSlug;
  gccCountry?: GccCountryLegalSlug | null;
}) {
  const { regionId, gccCountry: ctxGcc, isReady } = useRegion();
  const router = useRouter();
  const redirected = React.useRef(false);

  React.useEffect(() => {
    if (!isReady || region !== 'global' || redirected.current) return;
    const path = resolveDefaultPrivacyPath(regionId, ctxGcc);
    if (path !== '/legal/privacy') {
      redirected.current = true;
      router.replace(path);
    }
  }, [isReady, region, regionId, ctxGcc, router]);

  const doc = getPrivacyDocument(region, gccCountry);

  return (
    <LegalDocumentLayout
      document={doc}
      headerExtra={<LegalRegionSwitcher />}
    />
  );
}

export function LegalPrivacyRegionPage({ region }: { region: LegalRegionSlug }) {
  const doc = getPrivacyDocument(region);
  return (
    <LegalDocumentLayout
      document={doc}
      headerExtra={<LegalRegionSwitcher />}
    />
  );
}

export function LegalPrivacyGccCountryPage({ country }: { country: GccCountryLegalSlug }) {
  const doc = getPrivacyDocument('gcc', country);
  return (
    <LegalDocumentLayout
      document={doc}
      headerExtra={<LegalRegionSwitcher />}
    />
  );
}
