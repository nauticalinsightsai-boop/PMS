'use client';

import { useCallback, useEffect, useState } from 'react';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import { useWebsiteDataRealtime } from '@/hooks/useWebsiteDataRealtime';
import {
  NEWSLETTER_AUTHORS_FIELD_KEY,
  createEmptyAuthor,
  defaultNewsletterAuthorsRegistry,
  parseNewsletterAuthorsRegistry,
  type NewsletterAuthor,
  type NewsletterAuthorsRegistry,
} from '@/lib/newsletter-authors';

export function useNewsletterAuthors() {
  const [registry, setRegistry] = useState<NewsletterAuthorsRegistry>(
    defaultNewsletterAuthorsRegistry(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const rows = await WebsiteDataService.getData('draft');
      const row = rows.find((item) => item.field_key === NEWSLETTER_AUTHORS_FIELD_KEY);
      if (row?.content) {
        setRegistry(parseNewsletterAuthorsRegistry(row.content));
      } else {
        const seeded = defaultNewsletterAuthorsRegistry();
        setRegistry(seeded);
        await WebsiteDataService.saveDraft(
          NEWSLETTER_AUTHORS_FIELD_KEY,
          seeded as unknown as Record<string, unknown>,
          { publish: true },
        );
      }
    } catch (err) {
      console.error('Failed to load newsletter authors', err);
      setError('Could not load authors.');
      setRegistry(defaultNewsletterAuthorsRegistry());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useWebsiteDataRealtime(NEWSLETTER_AUTHORS_FIELD_KEY, load);

  const persist = useCallback(async (next: NewsletterAuthorsRegistry) => {
    setIsSaving(true);
    setError(null);
    try {
      // Authors are reference data — publish immediately so public pages resolve them.
      await WebsiteDataService.saveDraft(
        NEWSLETTER_AUTHORS_FIELD_KEY,
        next as unknown as Record<string, unknown>,
        { publish: true },
      );
      setRegistry(next);
    } catch (err) {
      console.error('Failed to save newsletter authors', err);
      setError('Could not save authors.');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const upsertAuthor = useCallback(
    async (author: NewsletterAuthor) => {
      const nextAuthors = [...registry.authors];
      const index = nextAuthors.findIndex((item) => item.id === author.id);
      const updated: NewsletterAuthor = { ...author, modifiedDate: new Date().toISOString() };
      if (index >= 0) nextAuthors[index] = updated;
      else nextAuthors.unshift(updated);
      await persist({ version: 1, authors: nextAuthors });
      return updated;
    },
    [persist, registry.authors],
  );

  const deleteAuthor = useCallback(
    async (id: string) => {
      await persist({
        version: 1,
        authors: registry.authors.filter((author) => author.id !== id),
      });
    },
    [persist, registry.authors],
  );

  return {
    authors: registry.authors,
    isLoading,
    isSaving,
    error,
    refresh: load,
    upsertAuthor,
    deleteAuthor,
    getAuthorById: (id: string) => registry.authors.find((author) => author.id === id),
    createEmptyAuthor,
  };
}
