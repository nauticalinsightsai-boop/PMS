import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { sanitizeArticleHtml } from '@pms/site-content/sanitize-html';

const repositoryRoot = path.resolve(__dirname, '../../..');
const css = fs.readFileSync(path.join(repositoryRoot, 'packages/ui/src/globals.css'), 'utf8');
const renderer = fs.readFileSync(
  path.join(repositoryRoot, 'frontend/components/marketing/ArticleMarkdown.tsx'),
  'utf8',
);

describe('Item07 semantic first-table public rendering contract', () => {
  it('retains the safe semantic table attributes through the public sanitizer', () => {
    const source = `<table data-pms-responsive-table="item07-t01-stacked-cards"><thead><tr><th id="item07-t01-domain" scope="col">Domain</th></tr></thead><tbody><tr><th headers="item07-t01-domain" data-label="Domain" scope="row">Fundamentals</th></tr></tbody></table>`;
    expect(sanitizeArticleHtml(source)).toBe(source);
  });

  it('uses the existing sanitized article-wysiwyg public renderer unchanged', () => {
    expect(renderer).toContain("import { sanitizeArticleHtml } from '@pms/site-content/sanitize-html'");
    expect(renderer).toContain("const articleBodyClass = 'article-wysiwyg max-w-none'");
    expect(renderer).toContain('sanitizeArticleHtml(segment.content)');
  });

  it('limits stacked cards to the exact Item07 table marker at 480px and below', () => {
    const item07Comment = css.indexOf('Item07 T01 only');
    const mobileMedia = css.indexOf('@media (max-width: 480px)', item07Comment);
    const firstMarkerRule = css.indexOf(
      "table[data-pms-responsive-table='item07-t01-stacked-cards']",
      item07Comment,
    );
    expect(item07Comment).toBeGreaterThan(-1);
    expect(mobileMedia).toBeGreaterThan(item07Comment);
    expect(firstMarkerRule).toBeGreaterThan(mobileMedia);
    expect(css.slice(item07Comment, mobileMedia)).not.toContain(
      "table[data-pms-responsive-table='item07-t01-stacked-cards']",
    );
    expect(css.slice(mobileMedia)).toContain('width: 100%');
    expect(css.slice(mobileMedia)).toContain('max-width: 100%');
    expect(css).toContain('overflow: visible');
    expect(css).toContain('white-space: normal');
    expect(css).toContain('overflow-wrap: anywhere');
    expect(css).not.toMatch(/data-pms-responsive-table='item07-t01-stacked-cards'[^}]*display:\s*none/s);
  });
});
