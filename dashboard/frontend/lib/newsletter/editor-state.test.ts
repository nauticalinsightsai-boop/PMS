import { describe, expect, it } from 'vitest';
import {
  NEWSLETTER_POSTS_DRAFT_FIELD_KEY,
  buildNewsletterPublishConfirmation,
  buildNewsletterPublicationRegistries,
  canPublishNewsletterPost,
  deriveNewsletterEditorState,
} from './editor-state';
import { createEmptyPost } from '../newsletter-posts';

describe('newsletter editor state', () => {
  it('uses a private dashboard-only draft key', () => {
    expect(NEWSLETTER_POSTS_DRAFT_FIELD_KEY).toBe('newsletter_posts_registry_draft');
  });

  it('keeps dirty and clean-live posts non-publishable', () => {
    expect(canPublishNewsletterPost({ canSave: true, hasChanges: true, hasSavedDraft: true, isSaving: false })).toBe(false);
    expect(canPublishNewsletterPost({ canSave: true, hasChanges: false, hasSavedDraft: false, isSaving: false })).toBe(false);
  });

  it('allows only a clean saved draft to publish', () => {
    expect(canPublishNewsletterPost({ canSave: true, hasChanges: false, hasSavedDraft: true, isSaving: false })).toBe(true);
    expect(deriveNewsletterEditorState({
      canSave: true,
      hasChanges: false,
      hasSavedDraft: true,
      isLive: true,
      isSaving: false,
      savingIntent: null,
      hasError: false,
    })).toBe('publishable');
  });

  it('derives every explicit editor state without calling an incomplete draft publishable', () => {
    const base = {
      canSave: true,
      hasChanges: false,
      hasSavedDraft: false,
      isLive: false,
      isSaving: false,
      savingIntent: null,
      hasError: false,
    } as const;

    expect(deriveNewsletterEditorState(base)).toBe('clean');
    expect(deriveNewsletterEditorState({ ...base, hasChanges: true })).toBe('dirty');
    expect(deriveNewsletterEditorState({ ...base, canSave: false, hasSavedDraft: true })).toBe('saved-hidden');
    expect(deriveNewsletterEditorState({ ...base, hasSavedDraft: true })).toBe('publishable');
    expect(deriveNewsletterEditorState({ ...base, isSaving: true, savingIntent: 'publish' })).toBe('publishing');
    expect(deriveNewsletterEditorState({ ...base, isLive: true })).toBe('live');
    expect(deriveNewsletterEditorState({ ...base, hasError: true })).toBe('error');
  });

  it('binds confirmation to the exact URL and version', () => {
    expect(buildNewsletterPublishConfirmation({ slug: 'risk-map', modifiedDate: '2026-08-04T01:02:03.000Z' }))
      .toBe('PUBLISH /newsletter/risk-map VERSION 2026-08-04T01:02:03.000Z');
  });

  it('publishes only the confirmed record and preserves unrelated live and hidden siblings', () => {
    const liveA = { ...createEmptyPost(), id: 'a', slug: 'a', title: 'Live A', status: 'published' as const };
    const liveB = { ...createEmptyPost(), id: 'b', slug: 'b', title: 'Live B', status: 'published' as const };
    const draftA = { ...liveA, title: 'Draft A', status: 'draft' as const, modifiedDate: 'v1' };
    const draftB = { ...liveB, title: 'Hidden B', status: 'draft' as const, modifiedDate: 'v2' };

    const result = buildNewsletterPublicationRegistries({
      confirmedDraftRegistry: { version: 1, posts: [draftA, draftB] },
      liveRegistry: { version: 1, posts: [liveA, liveB] },
      postId: 'a',
      now: '2026-08-04T10:00:00.000Z',
    });

    expect(result.nextLiveRegistry.posts.find((post) => post.id === 'a')?.title).toBe('Draft A');
    expect(result.nextLiveRegistry.posts.find((post) => post.id === 'b')).toEqual(liveB);
    expect(result.nextPrivateDraftRegistry.posts.find((post) => post.id === 'b')).toEqual(draftB);
  });

  it('blocks a different live record from claiming the confirmed URL', () => {
    const draft = { ...createEmptyPost(), id: 'draft', slug: 'same', status: 'draft' as const };
    const live = { ...createEmptyPost(), id: 'live', slug: 'same', status: 'published' as const };
    expect(() => buildNewsletterPublicationRegistries({
      confirmedDraftRegistry: { version: 1, posts: [draft] },
      liveRegistry: { version: 1, posts: [live] },
      postId: 'draft',
      now: '2026-08-04T10:00:00.000Z',
    })).toThrow('A different live newsletter already uses this URL.');
  });
});
