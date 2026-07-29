import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const directory = join(
  process.cwd(),
  'dashboard',
  'frontend',
  'components',
  'pages',
  'admin',
);
const strip = readFileSync(join(directory, 'HomeSectionTabStrip.tsx'), 'utf8');
const editor = readFileSync(join(directory, 'HomeCmsEditor.tsx'), 'utf8');

test('Home section strip exposes the sealed navigation semantics', () => {
  assert.match(strip, /aria-label="Homepage sections"/);
  assert.match(strip, /aria-orientation="horizontal"/);
  assert.match(strip, /Show previous homepage sections/);
  assert.match(strip, /Show next homepage sections/);
  assert.match(strip, /aria-selected=\{selected\}/);
  assert.match(strip, /aria-controls=\{homeSectionPanelId\(item\.id\)\}/);
  assert.match(strip, /tabIndex=\{selected \? 0 : -1\}/);
  assert.match(strip, /event\.key === 'ArrowRight'/);
  assert.match(strip, /event\.key === 'ArrowLeft'/);
  assert.match(strip, /event\.key === 'Home'/);
  assert.match(strip, /event\.key === 'End'/);
  assert.match(strip, /event\.key === 'Enter' \|\| event\.key === ' '/);
});

test('step controls scroll only and respect reduced motion', () => {
  assert.match(strip, /scrollport\.scrollBy\(/);
  assert.match(strip, /scrollport\.clientWidth - 48/);
  assert.match(strip, /prefers-reduced-motion: reduce/);
  assert.equal(strip.match(/inline-flex h-8 w-8 shrink-0/g)?.length, 2);
  assert.doesNotMatch(strip, /\bsize-8\b/);
  assert.match(
    strip,
    /pointer-events-none absolute bottom-1 left-0 top-1 z-10 w-4/,
  );
  assert.match(
    strip,
    /pointer-events-none absolute bottom-1 right-0 top-1 z-10 w-4/,
  );
  assert.doesNotMatch(strip, /\binset-y-0\b/);
  assert.doesNotMatch(strip, /WebsiteDataService|handleSaveDraft|handlePublish|openPreview/);
});

test('Home editor keeps the twelve sealed sections and persistence handlers outside the strip', () => {
  const labels = [
    'Hero',
    'Stats',
    'Sections',
    'Featured pathways',
    'Program families',
    'Membership',
    'Testimonials',
    'Insights band',
    'CTA',
    'Latest News',
    'Global Footprint',
    'Site images',
  ];
  let previous = -1;
  for (const label of labels) {
    const index = editor.indexOf(`label: '${label}'`);
    assert.ok(index > previous, `${label} is present in the sealed order`);
    previous = index;
  }

  assert.match(editor, /data-home-section-actions/);
  assert.match(editor, /role="tabpanel"/);
  assert.match(editor, /aria-labelledby=\{homeSectionTabId\(activeTab\)\}/);
  assert.match(editor, /WebsiteDataService\.saveDraft/);
  assert.match(editor, /WebsiteDataService\.publish/);
});
