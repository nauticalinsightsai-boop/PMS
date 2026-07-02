'use client';

import { useEffect, useState } from 'react';
import {
  FIELD_KEYS,
  certificationsRegistrySchema,
  type ProgrammeOfferingAssets,
} from '@pms/site-content';
import { WebsiteDataService } from '@/services/WebsiteDataService';

/** Latest published programme assets for one pathway offering (R2 video, PDFs, etc.). */
export function usePublishedProgrammeAssets(
  siteCertId: string,
  offeringId: string,
  enabled: boolean,
) {
  const [assets, setAssets] = useState<ProgrammeOfferingAssets | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !siteCertId || !offeringId) {
      setAssets(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    void (async () => {
      try {
        WebsiteDataService.invalidatePublishedCache([FIELD_KEYS.CERTIFICATIONS_REGISTRY]);
        const row = await WebsiteDataService.getPublishedByFieldKey(FIELD_KEYS.CERTIFICATIONS_REGISTRY);
        const parsed = row?.content
          ? certificationsRegistrySchema.safeParse(row.content)
          : null;
        const registry = parsed?.success ? parsed.data : null;
        const entry = registry?.entries.find((e) => e.id === siteCertId && !e.archived);
        const next = entry?.programmeAssets?.[offeringId] ?? null;
        if (!cancelled) setAssets(next);
      } catch (err) {
        console.error('Failed to load published programme assets', err);
        if (!cancelled) setAssets(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, siteCertId, offeringId]);

  return { assets, isLoading };
}
