'use client';

import { useEffect, useRef } from 'react';
import { subscribePublishedWebsiteData } from '@/lib/cms/realtime-multiplex';

/**
 * Subscribes to published `website_data` changes and triggers a refresh callback.
 */
export function useWebsiteDataRealtime(
  fieldKeys: string | string[],
  onRefresh: () => void,
  enabled = true,
): void {
  const cbRef = useRef(onRefresh);
  cbRef.current = onRefresh;

  const keyList = Array.isArray(fieldKeys) ? fieldKeys : [fieldKeys];
  const keySignature = keyList.slice().sort().join(',');

  useEffect(() => {
    if (!enabled || keyList.length === 0 || typeof window === 'undefined') return;

    return subscribePublishedWebsiteData(keyList, () => {
      cbRef.current();
    });
  }, [enabled, keySignature]);
}
