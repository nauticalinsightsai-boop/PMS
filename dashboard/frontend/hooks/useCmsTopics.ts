'use client';

import { useCallback, useEffect, useState } from 'react';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import { useWebsiteDataRealtime } from '@/hooks/useWebsiteDataRealtime';
import {
  CMS_TOPICS_FIELD_KEY,
  createEmptyTopic,
  defaultCmsTopicsRegistry,
  parseCmsTopicsRegistry,
  type CmsTopic,
  type CmsTopicsRegistry,
} from '@/lib/cms/topics';

export function useCmsTopics() {
  const [registry, setRegistry] = useState<CmsTopicsRegistry>(defaultCmsTopicsRegistry());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const rows = await WebsiteDataService.getData('draft');
      const row = rows.find((item) => item.field_key === CMS_TOPICS_FIELD_KEY);
      if (row?.content) {
        setRegistry(parseCmsTopicsRegistry(row.content));
      } else {
        const seeded = defaultCmsTopicsRegistry();
        setRegistry(seeded);
        await WebsiteDataService.saveDraft(
          CMS_TOPICS_FIELD_KEY,
          seeded as unknown as Record<string, unknown>,
        );
      }
    } catch (err) {
      console.error('Failed to load topics', err);
      setError('Could not load topics.');
      setRegistry(defaultCmsTopicsRegistry());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useWebsiteDataRealtime(CMS_TOPICS_FIELD_KEY, load);

  const persist = useCallback(async (next: CmsTopicsRegistry, publish = false) => {
    setIsSaving(true);
    setError(null);
    try {
      await WebsiteDataService.saveDraft(
        CMS_TOPICS_FIELD_KEY,
        next as unknown as Record<string, unknown>,
      );
      if (publish) await WebsiteDataService.publish(CMS_TOPICS_FIELD_KEY);
      setRegistry(next);
    } catch (err) {
      console.error('Failed to save topics', err);
      setError('Could not save topics.');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const upsertTopic = useCallback(
    async (topic: CmsTopic, publish = false) => {
      const nextTopics = [...registry.topics];
      const index = nextTopics.findIndex((item) => item.id === topic.id);
      const updated: CmsTopic = { ...topic, modifiedDate: new Date().toISOString() };
      if (index >= 0) nextTopics[index] = updated;
      else nextTopics.unshift(updated);
      await persist({ version: 1, topics: nextTopics }, publish);
      return updated;
    },
    [persist, registry.topics],
  );

  const deleteTopic = useCallback(
    async (id: string) => {
      await persist({ version: 1, topics: registry.topics.filter((t) => t.id !== id) });
    },
    [persist, registry.topics],
  );

  return {
    topics: registry.topics,
    isLoading,
    isSaving,
    error,
    refresh: load,
    upsertTopic,
    deleteTopic,
    getTopicById: (id: string) => registry.topics.find((t) => t.id === id),
    createEmptyTopic,
  };
}
