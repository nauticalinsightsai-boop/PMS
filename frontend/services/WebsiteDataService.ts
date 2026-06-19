'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { FIELD_KEYS } from '@pms/site-content/keys';
import { useWebsiteDataRealtime } from '@/hooks/useWebsiteDataRealtime';
import {
  fetchPublishedRowsCached,
  invalidatePublishedDataCache,
} from '@/lib/cms/published-data-cache';

export interface WebsiteData {
  id: string;
  field_key: string;
  content: Record<string, unknown>;
  is_published: boolean;
  updated_at: string;
}

type PublishedRow = Pick<WebsiteData, 'field_key' | 'content'>;

async function queryPublishedByFieldKeys(keys: string[]): Promise<PublishedRow[]> {
  if (keys.length === 0) return [];

  const { data, error } = await supabase
    .from('website_data')
    .select('field_key, content')
    .eq('is_published', true)
    .in('field_key', keys);

  if (error) throw error;
  return (data ?? []) as PublishedRow[];
}

export const WebsiteDataService = {
  async getData(view: 'draft' | 'published' = 'draft') {
    const query = supabase.from('website_data').select('*');
    if (view === 'published') {
      query.eq('is_published', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as WebsiteData[];
  },

  async getPublishedByFieldKeys(keys: string[]) {
    return fetchPublishedRowsCached(keys, queryPublishedByFieldKeys);
  },

  async getPublishedByFieldKey(key: string) {
    const rows = await this.getPublishedByFieldKeys([key]);
    return rows.find((row) => row.field_key === key) ?? null;
  },

  invalidatePublishedCache(keys?: string[]) {
    invalidatePublishedDataCache(keys);
  },
};

export const useWebsiteData = (initialGlobalContent?: Record<string, string>) => {
  const [data, setData] = useState<Record<string, unknown>>(initialGlobalContent ?? {});
  const [isLoading, setIsLoading] = useState(!initialGlobalContent);

  const refresh = useCallback(async () => {
    try {
      WebsiteDataService.invalidatePublishedCache([FIELD_KEYS.GLOBAL_CONTENT]);
      const row = await WebsiteDataService.getPublishedByFieldKey(FIELD_KEYS.GLOBAL_CONTENT);
      const contentMap: Record<string, unknown> = {};
      if (row?.content && typeof row.content === 'object') {
        Object.assign(contentMap, row.content);
      }
      setData(contentMap);
    } catch (err) {
      console.error('Error fetching published global content:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialGlobalContent) {
      setData(initialGlobalContent);
      setIsLoading(false);
    }
    void refresh();
  }, [refresh, initialGlobalContent]);

  useWebsiteDataRealtime(FIELD_KEYS.GLOBAL_CONTENT, refresh);

  const get = (key: string, defaultValue = ''): string => {
    const val = data[key];
    return typeof val === 'string' ? val : defaultValue;
  };

  return { data, isLoading, get, refresh };
};
