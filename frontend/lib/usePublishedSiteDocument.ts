'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import type { FieldKey } from '@pms/site-content';
import { getSchemaForFieldKey } from '@pms/site-content';
import { useWebsiteDataRealtime } from '@/hooks/useWebsiteDataRealtime';

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
    initialData?: T | null;
  },
) {
  const [data, setData] = useState<T | null>(options?.initialData ?? null);
  const [isLoading, setIsLoading] = useState(options?.initialData === undefined);
  const [isPreview, setIsPreview] = useState(false);

  const parse =
    options?.parse ??
    ((raw: unknown): T | null => {
      const schema = getSchemaForFieldKey(fieldKey);
      if (!schema) return (raw as T) ?? null;
      const result = schema.safeParse(raw);
      return result.success ? (result.data as T) : null;
    });

  const parseRef = useRef(parse);
  parseRef.current = parse;

  const refresh = useCallback(async () => {
    try {
      WebsiteDataService.invalidatePublishedCache([fieldKey]);
      const row = await WebsiteDataService.getPublishedByFieldKey(fieldKey);
      setData(parseRef.current(row?.content));
    } catch (err) {
      console.error(`Failed to load site document ${fieldKey}`, err);
    } finally {
      setIsLoading(false);
    }
  }, [fieldKey]);

  useEffect(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const previewKey = params?.get('previewKey');

    if (previewKey === fieldKey && typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(previewStorageKey(fieldKey));
        if (raw) {
          setData(parseRef.current(JSON.parse(raw)));
          setIsPreview(true);
          setIsLoading(false);
          return;
        }
      } catch {
        // fall through to published load
      }
    }

    if (options?.initialData !== undefined) {
      setData(options.initialData);
      setIsLoading(false);
    }

    void refresh();
  }, [fieldKey, options?.previewParam, options?.initialData, refresh]);

  useWebsiteDataRealtime(fieldKey, refresh, isPreview);

  useEffect(() => {
    const messageType = options?.previewMessageType ?? `pms:site-preview:${fieldKey}`;
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== messageType) return;
      if (event.data.fieldKey && event.data.fieldKey !== fieldKey) return;
      const next = parseRef.current(event.data.content);
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
  }, [fieldKey, options?.previewMessageType]);

  return { data, isLoading, isPreview };
}

/** Draft + publish loader for dashboard editors */
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
