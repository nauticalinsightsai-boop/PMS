'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { FIELD_KEYS } from '@pms/site-content/keys';
import { useWebsiteDataRealtime } from '@/hooks/useWebsiteDataRealtime';

export interface WebsiteData {
  id: string;
  field_key: string;
  content: Record<string, unknown>;
  is_published: boolean;
  updated_at: string;
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
};

export const useWebsiteData = () => {
  const [data, setData] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const result = await WebsiteDataService.getData('published');
      const contentMap: Record<string, unknown> = {};
      result.forEach((item) => {
        if (typeof item.content === 'object' && item.content !== null) {
          Object.assign(contentMap, item.content);
        }
      });
      setData(contentMap);
    } catch (err) {
      console.error('Error fetching published data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useWebsiteDataRealtime(FIELD_KEYS.GLOBAL_CONTENT, refresh);

  const get = (key: string, defaultValue = ''): string => {
    const val = data[key];
    return typeof val === 'string' ? val : defaultValue;
  };

  return { data, isLoading, get, refresh };
};
