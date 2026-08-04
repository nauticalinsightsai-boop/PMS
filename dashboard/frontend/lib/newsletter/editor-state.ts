import type { NewsletterPost, NewsletterPostsRegistry } from '@/lib/newsletter-posts';

export const NEWSLETTER_POSTS_DRAFT_FIELD_KEY = 'newsletter_posts_registry_draft';

export type NewsletterEditorIntent = 'save-draft' | 'publish';

export type NewsletterEditorState =
  | 'clean'
  | 'dirty'
  | 'saved-hidden'
  | 'publishable'
  | 'publishing'
  | 'live'
  | 'error';

export function newsletterPostVersion(post: Pick<NewsletterPost, 'modifiedDate'>): string {
  return post.modifiedDate.trim();
}

export function buildNewsletterPublishConfirmation(
  post: Pick<NewsletterPost, 'slug' | 'modifiedDate'>,
): string {
  return `PUBLISH /newsletter/${post.slug} VERSION ${newsletterPostVersion(post)}`;
}

export function deriveNewsletterEditorState(input: {
  canSave: boolean;
  hasChanges: boolean;
  hasSavedDraft: boolean;
  isLive: boolean;
  isSaving: boolean;
  savingIntent: NewsletterEditorIntent | null;
  hasError: boolean;
}): NewsletterEditorState {
  if (input.hasError) return 'error';
  if (input.isSaving && input.savingIntent === 'publish') return 'publishing';
  if (input.hasChanges) return 'dirty';
  if (input.hasSavedDraft && input.canSave) return 'publishable';
  if (input.hasSavedDraft || input.isSaving) return 'saved-hidden';
  if (input.isLive) return 'live';
  return 'clean';
}

export function canPublishNewsletterPost(input: {
  canSave: boolean;
  hasChanges: boolean;
  hasSavedDraft: boolean;
  isSaving: boolean;
}): boolean {
  return input.canSave && input.hasSavedDraft && !input.hasChanges && !input.isSaving;
}

export function buildNewsletterPublicationRegistries(input: {
  confirmedDraftRegistry: NewsletterPostsRegistry;
  liveRegistry: NewsletterPostsRegistry;
  postId: string;
  now: string;
}): {
  nextPrivateDraftRegistry: NewsletterPostsRegistry;
  nextLiveRegistry: NewsletterPostsRegistry;
  publishedPost: NewsletterPost;
} {
  const confirmedDraft = input.confirmedDraftRegistry.posts.find(
    (post) => post.id === input.postId,
  );
  if (!confirmedDraft) throw new Error('Saved newsletter draft post not found.');
  if (
    input.liveRegistry.posts.some(
      (post) => post.id !== input.postId && post.slug === confirmedDraft.slug,
    )
  ) {
    throw new Error('A different live newsletter already uses this URL.');
  }

  const publishedPost: NewsletterPost = {
    ...confirmedDraft,
    status: 'published',
    publishDate: confirmedDraft.publishDate || input.now,
    modifiedDate: input.now,
  };
  const nextPrivateDraftRegistry: NewsletterPostsRegistry = {
    version: 1,
    posts: input.confirmedDraftRegistry.posts.map((post) =>
      post.id === input.postId ? publishedPost : post,
    ),
  };
  const liveIndex = input.liveRegistry.posts.findIndex((post) => post.id === input.postId);
  const nextLivePosts = [...input.liveRegistry.posts];
  if (liveIndex >= 0) nextLivePosts[liveIndex] = publishedPost;
  else nextLivePosts.unshift(publishedPost);

  return {
    nextPrivateDraftRegistry,
    nextLiveRegistry: { version: 1, posts: nextLivePosts },
    publishedPost,
  };
}
