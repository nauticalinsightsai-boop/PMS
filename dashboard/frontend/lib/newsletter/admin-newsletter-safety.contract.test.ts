import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

describe('admin and newsletter editor safety source contract', () => {
  it('keeps render/load fallback read-only and saves drafts only to the private key', () => {
    const hook = read('dashboard/frontend/hooks/useNewsletterPosts.ts');
    const loadBlock = hook.slice(hook.indexOf('const load ='), hook.indexOf('const persistPrivateDraft'));
    const saveBlock = hook.slice(hook.indexOf('const saveDraftPost'), hook.indexOf('const publishPost'));

    expect(loadBlock).not.toContain('WebsiteDataService.saveDraft');
    expect(saveBlock).toContain('persistPrivateDraft');
    expect(saveBlock).not.toContain('NEWSLETTER_POSTS_FIELD_KEY');
    expect(hook).toContain("NEWSLETTER_POSTS_DRAFT_FIELD_KEY");
  });

  it('leaves the public reader bound only to the established live key', () => {
    const publicReader = read('frontend/lib/newsletter/articles.ts');
    expect(publicReader).toContain(".eq('field_key', NEWSLETTER_POSTS_FIELD_KEY)");
    expect(publicReader).toContain(".eq('is_published', true)");
    expect(publicReader).not.toContain('newsletter_posts_registry_draft');
  });

  it('requires the hard-reread version and exact confirmation before publishing', () => {
    const hook = read('dashboard/frontend/hooks/useNewsletterPosts.ts');
    const editor = read('dashboard/frontend/components/pages/admin/NewsletterPostEditor.tsx');

    expect(hook).toContain('newsletterPostVersion(confirmedDraft) !== expectedVersion');
    expect(hook).toContain("WebsiteDataService.getData('published')");
    expect(hook).toContain('Published newsletter hard reread did not match');
    expect(editor).toContain('publishConfirmation !== publishPhrase');
    expect(editor).toContain('disabled={!canPublish}');
    expect(editor).toContain('role="alert"');
    expect(editor).toContain('errorAlertRef.current?.focus()');
  });

  it('keeps phone layouts preview-only and binds editor labels', () => {
    const editor = read('dashboard/frontend/components/pages/admin/NewsletterPostEditor.tsx');
    const shared = read('dashboard/frontend/components/pages/admin/cms/CmsShared.tsx');
    const workspace = read('dashboard/frontend/components/pages/admin/newsletter/NewsletterEditorWorkspace.tsx');

    expect(editor).toContain('Phone view is preview-only');
    expect(editor).toContain('hidden max-w-6xl space-y-6 md:block');
    expect(editor).toContain('hidden border-t border-border');
    expect(shared).toContain('htmlFor={htmlFor}');
    expect(workspace).toContain('htmlFor="newsletter-article-body"');
  });

  it('requires distinct seed phrases and a second confirmation dialog', () => {
    const source = read('dashboard/frontend/components/pages/admin/SiteContentMigratePage.tsx');
    expect(source).toContain("'SEED WEBSITE CONTENT'");
    expect(source).toContain("'SEED AND PUBLISH WEBSITE CONTENT'");
    expect(source).toContain('confirmationText !== requiredConfirmation');
    expect(source).toContain('<ConfirmDialog');
  });

  it('exposes semantic dashboard modes and visible tab overflow controls', () => {
    const layout = read('dashboard/frontend/components/layout/DashboardLayout.tsx');
    const tabs = read('dashboard/frontend/components/admin/layout/AdminCmsTabBar.tsx');
    expect(layout).toContain('role="tablist"');
    expect(layout).toContain('aria-selected={mode === t.id}');
    expect(layout).toContain("event.key === 'ArrowRight'");
    expect(tabs).toContain('Scroll editor tabs right');
    expect(tabs).toContain('canScrollRight');
    expect(tabs).toContain('h-8 w-8');
  });

  it('removes registry-wide deployment and destructive dashboard deletion affordances', () => {
    const dashboard = read('dashboard/frontend/components/pages/admin/NewsletterDashboard.tsx');
    const allPosts = read('dashboard/frontend/components/pages/admin/NewsletterPostsList.tsx');
    const hook = read('dashboard/frontend/hooks/useNewsletterPosts.ts');
    expect(dashboard).not.toContain('Deploy Now');
    expect(dashboard).not.toContain('Update & publish');
    expect(dashboard).not.toContain('Trash2');
    expect(dashboard).toContain('confirmed per-post publish flow');
    expect(allPosts).not.toContain('Trash2');
    expect(allPosts).not.toContain('Delete newsletter?');
    expect(allPosts).not.toContain('deletePost');
    expect(hook).not.toContain('const deletePost');
    expect(hook).not.toContain('deletePost,');
  });
});
