'use client';

import { useEffect, useRef } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

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

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    let channel: RealtimeChannel | null = null;
    let warned = false;

    const ch = supabase
      .channel(`website-data-public:${keySignature}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'website_data' },
        (payload) => {
          const row = (payload.new ?? payload.old) as
            | { field_key?: string; is_published?: boolean }
            | null;
          const fieldKey = row?.field_key;
          if (!fieldKey || !keyList.includes(fieldKey)) return;
          if (payload.eventType !== 'DELETE' && row?.is_published === false) return;
          cbRef.current();
        },
      )
      .subscribe((status, err) => {
        if ((status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') && !warned) {
          warned = true;
          console.warn('[website-data:realtime]', err?.message ?? status);
        }
      });
    channel = ch;

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
        channel = null;
      }
    };
  }, [enabled, keySignature]);
}
