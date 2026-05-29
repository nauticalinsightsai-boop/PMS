'use client';

import { useCallback, useEffect, useState } from 'react';

import { fetchDashboardApi } from '@/lib/auth/fetch-dashboard-api';
import { toNewsletterSubscriber, type NewsletterSubscriber } from '@/lib/newsletter-subscribers';
import type { Interaction } from '@/services/InteractionService';

type SubscribersResponse = {
  data: Interaction[];
  count: number;
};

export function useNewsletterSubscribers() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        source: 'subscription',
        limit: '200',
        page: '0',
      });
      const res = await fetchDashboardApi(`/api/interactions?${params}`, { cache: 'no-store' });
      const json = (await res.json().catch(() => ({}))) as SubscribersResponse & { error?: string };
      if (!res.ok) {
        throw new Error(json.error || 'Failed to load subscribers');
      }
      const rows = Array.isArray(json.data) ? json.data : [];
      setSubscribers(rows.map(toNewsletterSubscriber));
      setCount(typeof json.count === 'number' ? json.count : rows.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscribers');
      setSubscribers([]);
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const deleteSubscriber = useCallback(
    async (id: string) => {
      setIsDeleting(true);
      setError(null);
      try {
        const res = await fetchDashboardApi(`/api/interactions/${id}`, { method: 'DELETE' });
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          throw new Error(json.error || 'Failed to delete subscriber');
        }
        setSubscribers((prev) => prev.filter((row) => row.id !== id));
        setCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete subscriber');
        throw err;
      } finally {
        setIsDeleting(false);
      }
    },
    [],
  );

  return {
    subscribers,
    count,
    isLoading,
    isDeleting,
    error,
    refresh,
    deleteSubscriber,
  };
}
