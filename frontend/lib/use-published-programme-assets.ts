'use client';

import { useEffect, useState } from 'react';
import type { ProgrammeOfferingAssets } from '@pms/site-content';

type ProgrammeAssetsResponse = {
  assets?: ProgrammeOfferingAssets;
  error?: string;
};

/** Latest published programme assets via same-origin API (avoids browser Supabase client issues). */
export function usePublishedProgrammeAssets(
  siteCertId: string,
  offeringId: string,
  enabled: boolean,
) {
  const [assets, setAssets] = useState<ProgrammeOfferingAssets | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !siteCertId || !offeringId) {
      setAssets(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams({ siteCertId, offeringId });

    void (async () => {
      try {
        const res = await fetch(`/api/programme-assets?${params.toString()}`, {
          credentials: 'same-origin',
        });
        const data = (await res.json().catch(() => ({}))) as ProgrammeAssetsResponse;
        if (!res.ok) {
          throw new Error(data.error || `Could not load programme assets (${res.status})`);
        }
        const next = data.assets && Object.keys(data.assets).length > 0 ? data.assets : null;
        if (!cancelled) setAssets(next);
      } catch (err) {
        console.error('Failed to load published programme assets', err);
        if (!cancelled) {
          setAssets(null);
          setError(err instanceof Error ? err.message : 'Failed to load programme assets');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, siteCertId, offeringId]);

  return { assets, isLoading, error };
}
