'use client';

import { useEffect, useRef } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { isSupabaseAuthConfigured, supabase } from '@/lib/supabase';

/**
 * Subscribes to Supabase Realtime postgres_changes on `website_data`.
 * Calls `onRefresh` when a watched field_key row is inserted, updated, or deleted.
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
    if (!enabled || !isSupabaseAuthConfigured || keyList.length === 0) return;
    if (typeof window === 'undefined') return;

    let channel: RealtimeChannel | null = null;
    let warned = false;

    const ch = supabase
      .channel(`website-data:${keySignature}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'website_data' },
        (payload) => {
          const row = (payload.new ?? payload.old) as { field_key?: string } | null;
          const fieldKey = row?.field_key;
          if (!fieldKey || !keyList.includes(fieldKey)) return;
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
