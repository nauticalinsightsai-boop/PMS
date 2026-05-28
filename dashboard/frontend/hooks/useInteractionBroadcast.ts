'use client';

import { useEffect, useRef } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

/**
 * Subscribes to Supabase Realtime Broadcast on the shared channel id.
 * When any submission is stored, the API pings this channel so the inbox refetches.
 */
export function useInteractionBroadcast(onRefresh: () => void): void {
  const cbRef = useRef(onRefresh);
  cbRef.current = onRefresh;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const channelId = process.env.NEXT_PUBLIC_INTERACTIONS_REALTIME_CHANNEL?.trim();
    if (!channelId) return;

    let channel: RealtimeChannel | null = null;
    let warned = false;

    const ch = supabase
      .channel(`interaction-events:${channelId}`)
      .on('broadcast', { event: 'refresh' }, () => {
        cbRef.current();
      })
      .subscribe((status, err) => {
        if ((status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') && !warned) {
          warned = true;
          console.warn('[interactions:realtime]', err?.message ?? status);
        }
      });
    channel = ch;

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
        channel = null;
      }
    };
  }, []);
}
