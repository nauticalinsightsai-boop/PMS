'use client';

import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type Listener = {
  keys: string[];
  cb: () => void;
};

const listeners = new Set<Listener>();
let channel: RealtimeChannel | null = null;
let subscriberCount = 0;

function dispatchRefresh(fieldKey: string | undefined) {
  if (!fieldKey) return;
  for (const listener of listeners) {
    if (listener.keys.includes(fieldKey)) {
      listener.cb();
    }
  }
}

function ensureChannel() {
  if (channel) return;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return;

  channel = supabase
    .channel('website-data-multiplex')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'website_data' },
      (payload) => {
        const row = (payload.new ?? payload.old) as
          | { field_key?: string; is_published?: boolean }
          | null;
        const fieldKey = row?.field_key;
        if (!fieldKey) return;
        if (payload.eventType !== 'DELETE' && row?.is_published === false) return;
        dispatchRefresh(fieldKey);
      },
    )
    .subscribe();
}

function teardownChannel() {
  if (channel) {
    supabase.removeChannel(channel);
    channel = null;
  }
}

export function subscribePublishedWebsiteData(
  fieldKeys: string | string[],
  onRefresh: () => void,
): () => void {
  const keys = Array.isArray(fieldKeys) ? fieldKeys : [fieldKeys];
  const entry: Listener = { keys, cb: onRefresh };
  listeners.add(entry);
  subscriberCount += 1;
  ensureChannel();

  return () => {
    listeners.delete(entry);
    subscriberCount -= 1;
    if (subscriberCount <= 0) {
      subscriberCount = 0;
      teardownChannel();
    }
  };
}
