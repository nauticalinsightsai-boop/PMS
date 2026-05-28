import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/client';

function getBroadcastChannelId(): string | null {
  const a = process.env.INTERACTIONS_REALTIME_CHANNEL?.trim();
  const b = process.env.NEXT_PUBLIC_INTERACTIONS_REALTIME_CHANNEL?.trim();
  return a || b || null;
}

/**
 * Notifies subscribed dashboards to refetch. Uses Realtime Broadcast (no anon SELECT on table).
 * Channel id must match `NEXT_PUBLIC_INTERACTIONS_REALTIME_CHANNEL` in the browser.
 * Non-blocking (does not delay API responses).
 */
export function pingInteractionSubscribers(): void {
  const id = getBroadcastChannelId();
  if (!id || !isSupabaseConfigured()) return;

  void (async () => {
    try {
      const supabase = getSupabaseAdmin();
      const channelName = `interaction-events:${id}`;
      const channel = supabase.channel(channelName, {
        config: { broadcast: { ack: false } },
      });

      await new Promise<void>((resolve) => {
        const t = setTimeout(() => {
          void supabase.removeChannel(channel);
          resolve();
        }, 5000);

        channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            clearTimeout(t);
            void channel
              .send({ type: 'broadcast', event: 'refresh', payload: { t: Date.now() } })
              .finally(() => {
                setTimeout(() => {
                  void supabase.removeChannel(channel);
                  resolve();
                }, 150);
              });
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            clearTimeout(t);
            void supabase.removeChannel(channel);
            resolve();
          }
        });
      });
    } catch (e) {
      console.warn('[interactions] broadcast ping failed', e);
    }
  })();
}
