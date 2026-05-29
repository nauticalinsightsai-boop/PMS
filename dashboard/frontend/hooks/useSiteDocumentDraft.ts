'use client';

import { useEffect, useState } from 'react';
import { WebsiteDataService } from '@/services/WebsiteDataService';

type UseSiteDocumentDraftResult<T> = {
  config: T;
  setConfig: React.Dispatch<React.SetStateAction<T>>;
  baseline: string;
  setBaseline: (value: string) => void;
  isLoading: boolean;
  loadError: string | null;
  updatedAt?: Date;
};

/**
 * Load a single website_data draft row. Stable mount-only fetch (avoids infinite reload
 * when default config objects are recreated each render).
 */
export function useSiteDocumentDraft<T>(
  fieldKey: string,
  getDefault: () => T,
  parse: (content: Record<string, unknown>) => T,
): UseSiteDocumentDraftResult<T> {
  const [config, setConfig] = useState<T>(() => getDefault());
  const [baseline, setBaseline] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date>();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      const fallback = getDefault();

      try {
        const rows = await WebsiteDataService.getData('draft');
        if (cancelled) return;

        const row = rows.find((r) => r.field_key === fieldKey);
        const next = row?.content ? parse(row.content as Record<string, unknown>) : fallback;
        setConfig(next);
        setBaseline(JSON.stringify(next));
        setUpdatedAt(row?.updated_at ? new Date(row.updated_at) : undefined);
      } catch (error) {
        console.error(`Failed to load ${fieldKey}`, error);
        if (cancelled) return;
        setConfig(fallback);
        setBaseline(JSON.stringify(fallback));
        setLoadError(
          'Could not load draft data from Supabase. Showing defaults — saves may fail until connection is fixed.',
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
    // fieldKey is stable; getDefault/parse are module-level imports
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldKey]);

  return { config, setConfig, baseline, setBaseline, isLoading, loadError, updatedAt };
}
