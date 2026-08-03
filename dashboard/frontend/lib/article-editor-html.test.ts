import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { isAllowedEditorAttribute } from './article-editor-html';
import { sanitizeArticleHtml } from '@pms/site-content/sanitize-html';

describe('article editor Item07 semantic attribute durability', () => {
  it('allows only the exact table semantics needed by the correction', () => {
    for (const name of [
      'id',
      'scope',
      'headers',
      'data-label',
      'data-pms-responsive-table',
    ]) {
      expect(isAllowedEditorAttribute(name)).toBe(true);
    }
    for (const name of [
      'onclick',
      'onerror',
      'formaction',
      'data-random',
      'aria-secret',
      'srcdoc',
    ]) {
      expect(isAllowedEditorAttribute(name)).toBe(false);
    }
  });

  it('invalidates stale UI authority and exposes stable busy and label semantics', () => {
    const root = path.resolve(__dirname, '../../..');
    const editor = fs.readFileSync(
      path.join(root, 'dashboard/frontend/components/pages/admin/NewsletterPostEditor.tsx'),
      'utf8',
    );
    const route = fs.readFileSync(
      path.join(root, 'dashboard/backend/app/api/cms/newsletter-first-table/route.ts'),
      'utf8',
    );

    const operation = editor.slice(
      editor.indexOf('const runItem07TableWriter'),
      editor.indexOf('const handleTitleChange'),
    );
    expect(operation.indexOf('setTableReceipt(null)')).toBeLessThan(
      operation.indexOf('setTableWriterBusy(true)'),
    );
    expect(operation.match(/setTableReceipt\(null\)/g)).toHaveLength(2);
    expect(operation.match(/setTableConfirmation\(''\)/g)).toHaveLength(3);
    expect(editor).toContain("post?.status !== 'draft' || hasChanges");
    expect(editor).toContain('aria-busy={tableWriterBusy}');
    expect(editor).toContain('Item07 table operation in progress');
    expect(editor).toContain('Item07 table operation complete');
    expect(editor).toContain('role="alert"');
    expect(editor).toContain('role="status"');
    expect(editor).toContain('id="item07-first-table-confirmation"');
    expect(editor).toContain('htmlFor="item07-first-table-confirmation"');
    expect(editor).toContain('aria-labelledby="item07-first-table-confirmation-label"');
    expect(editor).toContain('Exact confirmation');
    expect(editor).toContain('autoComplete="off"');

    for (const failClosedCode of [
      'preview_stale',
      'item07_body_hash_mismatch',
      'first_table_header_count_invalid',
      'second_table_hash_mismatch',
      'item07_uniqueness_invalid',
      'item07_identity_invalid',
      'item07_not_draft',
    ]) {
      expect(route).toContain(failClosedCode);
    }
  });

  it('keeps public sanitizer safety while retaining semantic table attributes', () => {
    const html = `<table data-pms-responsive-table="item07-t01-stacked-cards" onclick="steal()">
      <thead><tr><th id="item07-t01-domain" scope="col">Domain</th></tr></thead>
      <tbody><tr><th scope="row" headers="item07-t01-domain" data-label="Domain">Value</th></tr></tbody>
      <script>alert(1)</script><a href="javascript:alert(1)" style="color:red">unsafe</a>
    </table>`;
    const clean = sanitizeArticleHtml(html);
    expect(clean).toContain('data-pms-responsive-table="item07-t01-stacked-cards"');
    expect(clean).toContain('id="item07-t01-domain" scope="col"');
    expect(clean).toContain('headers="item07-t01-domain" data-label="Domain"');
    expect(clean).not.toContain('onclick');
    expect(clean).not.toContain('<script');
    expect(clean).not.toContain('javascript:');
    expect(clean).not.toContain('style=');
  });
});
