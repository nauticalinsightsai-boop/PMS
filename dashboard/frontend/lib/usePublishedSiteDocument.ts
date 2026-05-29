'use client';

import { useEffect, useState } from 'react';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import type { FieldKey } from '@pms/site-content';
import { getSchemaForFieldKey } from '@pms/site-content';

const PREVIEW_PREFIX = 'pms:site-preview:';

export function previewStorageKey(fieldKey: string) {
  return `${PREVIEW_PREFIX}${fieldKey}`;
}

export function usePublishedSiteDocument<T>(
  fieldKey: FieldKey | string,
  options?: {
    parse?: (raw: unknown) => T | null;
    previewParam?: string;
    previewMessageType?: string;
  },
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);

  const parse =
    options?.parse ??
    ((raw: unknown): T | null => {
      const schema = getSchemaForFieldKey(fieldKey);
      if (!schema) return (raw as T) ?? null;
      const result = schema.safeParse(raw);
      return result.success ? (result.data as T) : null;
    });

  useEffect(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const previewKey = params?.get('previewKey');

    if (previewKey === fieldKey && typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(previewStorageKey(fieldKey));
        if (raw) {
          setData(parse(JSON.parse(raw)));
          setIsPreview(true);
          setIsLoading(false);
          return;
        }
      } catch {
        // fall through to published load
      }
    }

    const load = async () => {
      try {
        const rows = await WebsiteDataService.getData('published');
        const row = rows.find((item) => item.field_key === fieldKey);
        setData(parse(row?.content));
      } catch (err) {
        console.error(`Failed to load site document ${fieldKey}`, err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [fieldKey, options?.previewParam, options?.parse]);

  useEffect(() => {
    const messageType = options?.previewMessageType ?? `pms:site-preview:${fieldKey}`;
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== messageType) return;
      if (event.data.fieldKey && event.data.fieldKey !== fieldKey) return;
      const next = parse(event.data.content);
      if (next) {
        setData(next);
        setIsPreview(true);
        try {
          localStorage.setItem(previewStorageKey(fieldKey), JSON.stringify(event.data.content));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [fieldKey, options?.previewMessageType, parse]);

  return { data, isLoading, isPreview };
}

export function useSiteDocumentDraft<T>(
  fieldKey: FieldKey | string,
  parse: (raw: unknown) => T,
  defaultValue: T,
) {
  const [data, setData] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | undefined>();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const rows = await WebsiteDataService.getData('draft');
        const row = rows.find((item) => item.field_key === fieldKey);
        setData(row?.content ? parse(row.content) : defaultValue);
        setUpdatedAt(row?.updated_at ? new Date(row.updated_at) : undefined);
      } catch (err) {
        console.error(`Failed to load draft ${fieldKey}`, err);
        setData(defaultValue);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [fieldKey, defaultValue, parse]);

  return { data, setData, isLoading, updatedAt, setUpdatedAt };
}
