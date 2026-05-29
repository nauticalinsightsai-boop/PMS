'use client';

import { useEffect, useState } from 'react';
import catalogue from '@pms/regional-catalogue';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  RegionSelectorConfirmButton,
  RegionSelectorPanel,
} from '@/components/region/RegionSelectorPanel';
import {
  findRegionSelectorOption,
  REGION_SELECTOR_SECTIONS,
} from '@/lib/region-selector-sections';

type RegionId = 'global' | 'europe' | 'uk' | 'gcc' | 'india' | 'pakistan';

const STORAGE_KEY = 'pms_region';
const GCC_KEY = 'pms_gcc_country';

const PRICING_SELECTOR =
  'Regional pricing is based on current country of residence and billing country, not nationality.';

export default function AccountRegionPage() {
  const overview = catalogue.meta?.overview?.recommendedMessage ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as RegionId | null;
    const gcc = localStorage.getItem(GCC_KEY);
    if (stored) {
      const match = findRegionSelectorOption(stored, gcc);
      setSelectedId(match?.id ?? null);
    }
  }, []);

  const save = async () => {
    const opt = REGION_SELECTOR_SECTIONS.flatMap((s) => s.options).find((o) => o.id === selectedId);
    if (!opt) return;

    const { regionId, gccCountry } = opt;
    localStorage.setItem(STORAGE_KEY, regionId);
    document.cookie = `${STORAGE_KEY}=${regionId};path=/;max-age=${60 * 60 * 24 * 90};SameSite=Lax`;
    if (regionId === 'gcc' && gccCountry) {
      localStorage.setItem(GCC_KEY, gccCountry);
      document.cookie = `${GCC_KEY}=${gccCountry};path=/;max-age=${60 * 60 * 24 * 90};SameSite=Lax`;
    } else {
      localStorage.removeItem(GCC_KEY);
    }

    const userId = localStorage.getItem('pms_supabase_user_id');
    if (userId) {
      await fetch('/api/profile/region', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, regionId, gccCountry: gccCountry ?? null }),
      }).catch(() => {});
    }
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      <header className="space-y-2 text-left">
        <h1 className="text-section text-2xl font-bold leading-snug">
          Select your region for a personalized website experience.
        </h1>
        <p className="text-sm text-muted-foreground">{PRICING_SELECTOR}</p>
        <p className="text-xs text-muted-foreground">
          Matches the public site and /go/* channel portals. Saved to localStorage and cookie for
          cross-app sync.
        </p>
      </header>

      <GlassCard className="space-y-6 p-6 premium-shadow">
        <RegionSelectorPanel
          selectedId={selectedId}
          onSelect={setSelectedId}
          overview={overview}
        />
        <RegionSelectorConfirmButton
          disabled={!selectedId}
          onClick={save}
          label={saved ? 'Region saved' : 'Save region'}
        />
        {saved ? (
          <p className="text-center text-xs text-muted-foreground" role="status">
            Your region preference is updated for this browser.
          </p>
        ) : null}
      </GlassCard>
    </div>
  );
}
