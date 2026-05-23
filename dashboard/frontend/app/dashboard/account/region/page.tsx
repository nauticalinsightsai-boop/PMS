'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import catalogue from '@pms/regional-catalogue';

type RegionId = 'global' | 'europe' | 'uk' | 'gcc' | 'india' | 'pakistan';

const STORAGE_KEY = 'pms_region';
const GCC_KEY = 'pms_gcc_country';

export default function AccountRegionPage() {
  const regions = catalogue.regions;
  const [regionId, setRegionId] = useState<RegionId>('global');
  const [gccCountry, setGccCountry] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as RegionId | null;
    if (stored) setRegionId(stored);
    const gcc = localStorage.getItem(GCC_KEY);
    if (gcc) setGccCountry(gcc);
  }, []);

  const save = async () => {
    localStorage.setItem(STORAGE_KEY, regionId);
    document.cookie = `${STORAGE_KEY}=${regionId};path=/;max-age=${60 * 60 * 24 * 90};SameSite=Lax`;
    if (regionId === 'gcc' && gccCountry) {
      localStorage.setItem(GCC_KEY, gccCountry);
      document.cookie = `${GCC_KEY}=${gccCountry};path=/;max-age=${60 * 60 * 24 * 90};SameSite=Lax`;
    }
    const userId = localStorage.getItem('pms_supabase_user_id');
    if (userId) {
      await fetch('/api/profile/region', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, regionId, gccCountry: gccCountry || null }),
      }).catch(() => {});
    }
  };

  const selected = regions.find((r) => r.id === regionId);

  return (
    <DashboardLayout>
      <div className="max-w-lg space-y-6">
        <h1 className="text-2xl font-bold">Region profile</h1>
        <p className="text-sm text-muted-foreground">
          Matches public site region groups. Saved to localStorage and cookie for cross-app sync.
        </p>
        <div className="space-y-2">
          {regions.map((r) => (
            <label key={r.id} className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer">
              <input
                type="radio"
                name="region"
                className="mt-1"
                checked={regionId === r.id}
                onChange={() => setRegionId(r.id as RegionId)}
              />
              <div>
                <span className="font-medium block">{r.label}</span>
                {r.websiteMessage && (
                  <span className="text-xs text-muted-foreground">{r.websiteMessage}</span>
                )}
              </div>
            </label>
          ))}
        </div>
        {regionId === 'gcc' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">GCC country code</label>
            <select
              className="w-full rounded-lg border p-2 text-sm"
              value={gccCountry}
              onChange={(e) => setGccCountry(e.target.value)}
            >
              <option value="">Select</option>
              {['AE', 'SA', 'QA', 'BH', 'KW', 'OM'].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
        {selected?.websiteMessage && (
          <p className="text-xs text-muted-foreground border-l-2 border-brand-orange pl-3">
            {selected.websiteMessage}
          </p>
        )}
        <Button onClick={save}>Save region</Button>
      </div>
    </DashboardLayout>
  );
}
