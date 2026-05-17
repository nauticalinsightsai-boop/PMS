import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface WebsiteData {
  id: string;
  field_key: string;
  content: any;
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

  async saveDraft(fieldKey: string, content: any) {
    const { data, error } = await supabase
      .from('website_data')
      .upsert({ 
        field_key: fieldKey, 
        content, 
        is_published: false,
        updated_at: new Date().toISOString()
      }, { onConflict: 'field_key' });

    if (error) throw error;
    return data;
  },

  async publish(fieldKey: string) {
    const { data, error } = await supabase
      .from('website_data')
      .update({ is_published: true })
      .eq('field_key', fieldKey);

    if (error) throw error;
    return data;
  }
};

export const useWebsiteData = (keys?: string[]) => {
  const [data, setData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublished = async () => {
      try {
        const result = await WebsiteDataService.getData('published');
        const contentMap: Record<string, any> = {};
        result.forEach(item => {
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
  }, []);

  const get = (key: string, defaultValue: string = ''): string => {
    return data[key] || defaultValue;
  };

  return { data, isLoading, get };
};
