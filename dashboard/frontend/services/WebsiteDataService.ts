'use client';

import { useState, useEffect } from 'react';
import { getDashboardApiHeaders } from '@/lib/auth/dashboard-api-headers';
import { withBasePath } from '@/lib/base-path';

export interface WebsiteData {
  id: string;
  field_key: string;
  content: Record<string, unknown>;
  is_published: boolean;
  updated_at: string;
}

export type Item07FirstTableReceipt = {
  ok: true;
  record: string;
  classification: 'READY' | 'NO_CHANGE' | 'ROLLBACK_AVAILABLE';
  wrote: boolean;
  updatedAt: string;
  confirmation: string | null;
  hashes: {
    bodyBefore: string;
    bodyAfter: string;
    firstTableBefore: string;
    firstTableAfter: string;
    secondTable: string;
  };
};

import { isApiLoginEnabled } from '@/lib/auth/api-login-config';

const USE_CMS_API = isApiLoginEnabled();

function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return fallback;
}

async function cmsFetch(path: string, init?: RequestInit) {
  const res = await fetch(withBasePath(path), {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...getDashboardApiHeaders(),
      ...(init?.headers as Record<string, string> | undefined),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const bodyCode = data && typeof data === 'object' && 'code' in data
      ? (data as { code?: unknown }).code
      : undefined;
    const headerCode = res.headers?.get('x-pms-error-code');
    const code = bodyCode ?? headerCode;
    const safeCode = typeof code === 'string' && /^[a-z][a-z0-9_]{0,63}$/.test(code)
      ? code
      : null;
    const bodyRequestId = data && typeof data === 'object' && 'requestId' in data
      ? (data as { requestId?: unknown }).requestId
      : undefined;
    const headerRequestId = res.headers?.get('x-pms-request-id');
    const requestId = bodyRequestId ?? headerRequestId;
    const safeRequestId = typeof requestId === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(requestId)
      ? requestId
      : null;
    const correlation = safeRequestId ? ` [request ${safeRequestId}]` : '';
    throw new Error(
      safeCode
        ? `CMS API error (${res.status}): ${safeCode}${correlation}`
        : `CMS API error (${res.status})${correlation}`,
      );
  }
  return data;
}

export const WebsiteDataService = {
  isConfigured: () => USE_CMS_API || Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),

  async getData(view: 'draft' | 'published' = 'draft') {
    if (!USE_CMS_API) {
      const { isSupabaseAuthConfigured, supabase } = await import('@/lib/supabase');
      if (!isSupabaseAuthConfigured) return [] as WebsiteData[];
      const query = supabase.from('website_data').select('*');
      if (view === 'published') query.eq('is_published', true);
      const { data, error } = await query;
      if (error) throw new Error(toErrorMessage(error, 'Failed to load website data'));
      return (data ?? []) as WebsiteData[];
    }

    const q = view === 'published' ? '?view=published' : '';
    const result = (await cmsFetch(`/api/cms/website-data${q}`)) as { data: WebsiteData[] };
    return result.data ?? [];
  },

  async saveDraft(
    fieldKey: string,
    content: Record<string, unknown>,
    options?: { publish?: boolean },
  ) {
    const markPublished = options?.publish === true;
    if (!USE_CMS_API) {
      const { isSupabaseAuthConfigured, supabase } = await import('@/lib/supabase');
      if (!isSupabaseAuthConfigured) {
        throw new Error('Supabase is not configured.');
      }
      const { data: existing } = await supabase
        .from('website_data')
        .select('is_published')
        .eq('field_key', fieldKey)
        .maybeSingle();

      const { data, error } = await supabase
        .from('website_data')
        .upsert(
          {
            field_key: fieldKey,
            content,
            is_published: markPublished ? true : (existing?.is_published ?? false),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'field_key' },
        );
      if (error) throw new Error(toErrorMessage(error, 'Failed to save draft.'));
      return data;
    }

    return cmsFetch('/api/cms/website-data', {
      method: 'POST',
      body: JSON.stringify({ action: 'saveDraft', fieldKey, content, publish: markPublished }),
    });
  },

  async publish(fieldKey: string) {
    if (!USE_CMS_API) {
      const { isSupabaseAuthConfigured, supabase } = await import('@/lib/supabase');
      if (!isSupabaseAuthConfigured) {
        throw new Error('Supabase is not configured.');
      }
      const { data: existing, error: fetchError } = await supabase
        .from('website_data')
        .select('id')
        .eq('field_key', fieldKey)
        .maybeSingle();
      if (fetchError) throw new Error(toErrorMessage(fetchError, 'Failed to load website data.'));
      if (!existing) {
        throw new Error('Nothing to publish. Save the draft first.');
      }

      const { error } = await supabase
        .from('website_data')
        .update({ is_published: true })
        .eq('field_key', fieldKey);
      if (error) throw new Error(toErrorMessage(error, 'Failed to publish.'));
      return;
    }

    return cmsFetch('/api/cms/website-data', {
      method: 'POST',
      body: JSON.stringify({ action: 'publish', fieldKey }),
    });
  },

  async item07FirstTable(
    action: 'preview' | 'apply' | 'rollback',
    options?: { expectedUpdatedAt?: string; confirmation?: string },
  ): Promise<Item07FirstTableReceipt> {
    if (!USE_CMS_API) {
      throw new Error('The Item07 table writer requires the authenticated CMS API.');
    }
    return cmsFetch('/api/cms/newsletter-first-table', {
      method: 'POST',
      body: JSON.stringify({ action, ...options }),
    }) as Promise<Item07FirstTableReceipt>;
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
