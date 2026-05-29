'use client';

import { useState, useEffect } from 'react';
import { isSupabaseAuthConfigured, supabase } from '@/lib/supabase';

export interface WebsiteData {
  id: string;
  field_key: string;
  content: Record<string, unknown>;
  is_published: boolean;
  updated_at: string;
}

function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return fallback;
}

export const WebsiteDataService = {
  isConfigured: () => isSupabaseAuthConfigured,

  async getData(view: 'draft' | 'published' = 'draft') {
    if (!isSupabaseAuthConfigured) {
      return [] as WebsiteData[];
    }

    const query = supabase.from('website_data').select('*');
    if (view === 'published') {
      query.eq('is_published', true);
    }
    const { data, error } = await query;
    if (error) {
      throw new Error(toErrorMessage(error, 'Failed to load website data from Supabase.'));
    }
    return (data ?? []) as WebsiteData[];
  },

  async saveDraft(fieldKey: string, content: Record<string, unknown>) {
    if (!isSupabaseAuthConfigured) {
      throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }

    const { data, error } = await supabase
      .from('website_data')
      .upsert(
        {
          field_key: fieldKey,
          content,
          is_published: false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'field_key' },
      );
    if (error) {
      throw new Error(toErrorMessage(error, 'Failed to save draft.'));
    }
    return data;
  },

  async publish(fieldKey: string) {
    if (!isSupabaseAuthConfigured) {
      throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }

    const { data, error } = await supabase
      .from('website_data')
      .update({ is_published: true })
      .eq('field_key', fieldKey);
    if (error) {
      throw new Error(toErrorMessage(error, 'Failed to publish.'));
    }
    return data;
  },
};

export const useWebsiteData = (keys?: string[]) => {
  const [data, setData] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublished = async () => {
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
    };
    fetchPublished();
  }, [keys?.join(',')]);

  const get = (key: string, defaultValue = ''): string => {
    const val = data[key];
    return typeof val === 'string' ? val : defaultValue;
  };

  return { data, isLoading, get };
};
