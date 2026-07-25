import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import {
  DEFAULT_MANIFEST_PATH,
  importNewsletterDrafts,
  parseCliArgs,
} from './import-drafts.mjs';

const EXPECTED_POST_COUNT = 13;
const SENTINEL_REGISTRY = 'last valid registry\n';
const SENTINEL_QA = 'last valid QA report\n';

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function makeMarkdown(slug, { omittedKey = '', wordCount = 1800 } = {}) {
  const fields = [
    ['title', `"Title for ${slug}"`],
    ['slug', `"${slug}"`],
    ['excerpt', `"Excerpt for ${slug}"`],
    ['seoTitle', `"SEO title for ${slug}"`],
    ['seoDescription', `"SEO description for ${slug}"`],
    ['author', '"Fixture Author"'],
    ['topics', '\n  - PMP'],
    ['ctaLabel', '"Talk to a mentor"'],
    ['ctaUrl', '"/pm-service"'],
    ['heroImageBrief', '"Fixture hero brief"'],
    ['heroImageAlt', '"Fixture hero alt"'],
    ['primaryKeyword', '"PMP readiness"'],
    ['supportingKeywords', '\n  - PMP preparation'],
    ['sourceReviewedOn', '"2026-07-25"'],
  ];
  const frontmatter = fields
    .filter(([key]) => key !== omittedKey)
    .map(([key, value]) => `${key}:${value.startsWith('\n') ? value : ` ${value}`}`)
    .join('\n');
  const body = Array.from({ length: wordCount }, (_, index) => `word${index + 1}`).join(' ');

  return `---\n${frontmatter}\n---\n# Title for ${slug}\n\n${body}\n\n## References\n\n1. Fixture source\n`;
}

async function createFixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'pms-newsletter-import-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  const draftsDir = path.join(root, 'drafts');
  const outputDir = path.join(root, 'outputs');
  const manifestPath = path.join(root, 'manifest.json');
  const authorProfilesPath = path.join(root, 'authors.json');
  const registryOutputPath = path.join(outputDir, 'newsletter-draft-registry.ts');
  const qaOutputPath = path.join(outputDir, 'newsletter-priority-qa.md');

  await fs.mkdir(draftsDir, { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });

  const posts = [];
  const allocationByPriority = {};
  for (let priority = 1; priority <= EXPECTED_POST_COUNT; priority += 1) {
    const slug = `fixture-post-${priority}`;
    const sourceFile = `${slug}.md`;
    posts.push({
      sourceFile: `articles/${sourceFile}`,
      slug,
      priority,
      heroImageStatus: 'pending',
      heroImageUrl: null,
    });
    allocationByPriority[String(priority)] = 'author-fixture';
    await fs.writeFile(path.join(draftsDir, sourceFile), makeMarkdown(slug), 'utf-8');
  }

  const manifest = {
    version: 2,
    posts: [...posts].reverse(),
  };
  const authorProfiles = {
    version: 1,
    profiles: [
      {
        id: 'author-fixture',
        name: 'Fixture Author',
        title: 'Fixture Mentor',
        bio: 'A verified fixture author.',
        bylineType: 'person',
        profilePending: false,
        personSchemaEligible: true,
      },
    ],
    allocationByPriority,
  };

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8');
  await fs.writeFile(
    authorProfilesPath,
    `${JSON.stringify(authorProfiles, null, 2)}\n`,
    'utf-8',
  );

  const options = {
    manifestPath,
    draftsDir,
    authorProfilesPath,
    registryOutputPath,
    qaOutputPath,
    logger: () => {},
  };

  return {
    root,
    draftsDir,
    manifest,
    manifestPath,
    authorProfiles,
    authorProfilesPath,
    registryOutputPath,
    qaOutputPath,
    options,
    async writeManifest() {
      await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8');
    },
    async writeAuthorProfiles() {
      await fs.writeFile(
        authorProfilesPath,
        `${JSON.stringify(authorProfiles, null, 2)}\n`,
        'utf-8',
      );
    },
    async writeSentinelOutputs() {
      await fs.writeFile(registryOutputPath, SENTINEL_REGISTRY, 'utf-8');
      await fs.writeFile(qaOutputPath, SENTINEL_QA, 'utf-8');
    },
  };
}

async function expectFailureWithoutOutputReplacement(fixture, expectedError) {
  await fixture.writeSentinelOutputs();
  await assert.rejects(importNewsletterDrafts(fixture.options), expectedError);
  assert.equal(await fs.readFile(fixture.registryOutputPath, 'utf-8'), SENTINEL_REGISTRY);
  assert.equal(await fs.readFile(fixture.qaOutputPath, 'utf-8'), SENTINEL_QA);
}

test('uses repository-relative defaults and accepts bounded CLI output overrides', () => {
  assert.match(
    DEFAULT_MANIFEST_PATH.replaceAll('\\', '/'),
    /packages\/site-content\/data\/newsletter-import-manifest\.json$/,
  );
  assert.equal(
    path.relative(process.cwd(), DEFAULT_MANIFEST_PATH),
    path.join('packages', 'site-content', 'data', 'newsletter-import-manifest.json'),
  );

  const override = parseCliArgs([
    '--manifest',
    './fixture-manifest.json',
    '--qa-output=./fixture-qa.md',
  ]);
  assert.equal(override.manifestPath, path.resolve('./fixture-manifest.json'));
  assert.equal(override.qaOutputPath, path.resolve('./fixture-qa.md'));
  assert.throws(
    () => parseCliArgs(['--qa-output']),
    /--qa-output requires a file path/,
  );
});

test('imports exactly 13 drafts in deterministic priority order with byte-identical outputs', async (t) => {
  const fixture = await createFixture(t);

  const first = await importNewsletterDrafts(fixture.options);
  const firstRegistry = await fs.readFile(fixture.registryOutputPath);
  const firstQa = await fs.readFile(fixture.qaOutputPath);
  const second = await importNewsletterDrafts(fixture.options);
  const secondRegistry = await fs.readFile(fixture.registryOutputPath);
  const secondQa = await fs.readFile(fixture.qaOutputPath);

  assert.equal(first.importedPosts.length, EXPECTED_POST_COUNT);
  assert.deepEqual(
    first.qaData.map(({ priority }) => priority),
    Array.from({ length: EXPECTED_POST_COUNT }, (_, index) => index + 1),
  );
  assert.deepEqual(second.importedPosts, first.importedPosts);
  assert.equal(sha256(secondRegistry), sha256(firstRegistry));
  assert.equal(sha256(secondQa), sha256(firstQa));
});

test('treats a transparent editorial role as publishable without Person schema', async (t) => {
  const fixture = await createFixture(t);
  fixture.authorProfiles.profiles[0] = {
    id: 'author-fixture',
    name: 'PMP Readiness Mentor',
    title: 'PM Structure Editorial Role',
    bio: 'A PM Structure editorial role providing source-reviewed PMP readiness guidance.',
    bylineType: 'editorial_role',
    profilePending: false,
    personSchemaEligible: false,
  };
  await fixture.writeAuthorProfiles();

  const result = await importNewsletterDrafts(fixture.options);

  for (const item of result.qaData) {
    assert.equal(item.bylineType, 'editorial_role');
    assert.equal(item.profilePending, false);
    assert.equal(item.personSchemaEligible, false);
    assert.deepEqual(item.publicationBlockers, [
      'Missing approved hero image',
      'Draft status — not approved for publication',
    ]);
  }
  const report = await fs.readFile(fixture.qaOutputPath, 'utf-8');
  assert.match(report, /transparent editorial role; use Organization fallback/);
  assert.doesNotMatch(report, /Author profile pending replacement/);
});

test('keeps an incomplete real-person profile as a publication blocker', async (t) => {
  const fixture = await createFixture(t);
  fixture.authorProfiles.profiles[0] = {
    id: 'author-fixture',
    name: 'Unverified Fixture Author',
    title: '',
    bio: '',
    bylineType: 'person',
    profilePending: true,
    personSchemaEligible: false,
  };
  await fixture.writeAuthorProfiles();

  const result = await importNewsletterDrafts(fixture.options);

  for (const item of result.qaData) {
    assert.equal(item.bylineType, 'person');
    assert.ok(
      item.publicationBlockers.includes(
        'Incomplete real-person author profile (Unverified Fixture Author)',
      ),
    );
  }
});

test('rejects an unknown allocated author profile without replacing outputs', async (t) => {
  const fixture = await createFixture(t);
  fixture.authorProfiles.allocationByPriority['1'] = 'author-not-in-registry';
  await fixture.writeAuthorProfiles();
  await expectFailureWithoutOutputReplacement(
    fixture,
    /Missing author profile author-not-in-registry for priority 1/,
  );
});

test('rejects a missing manifest without replacing the last valid outputs', async (t) => {
  const fixture = await createFixture(t);
  fixture.options.manifestPath = path.join(fixture.root, 'missing-manifest.json');
  await expectFailureWithoutOutputReplacement(fixture, /Missing import manifest/);
});

test('rejects a manifest with the wrong post count without replacing outputs', async (t) => {
  const fixture = await createFixture(t);
  fixture.manifest.posts.pop();
  await fixture.writeManifest();
  await expectFailureWithoutOutputReplacement(fixture, /exactly 13 posts \(found 12\)/);
});

test('rejects a duplicate priority without replacing outputs', async (t) => {
  const fixture = await createFixture(t);
  fixture.manifest.posts[1].priority = fixture.manifest.posts[0].priority;
  await fixture.writeManifest();
  await expectFailureWithoutOutputReplacement(fixture, /Duplicate manifest priority/);
});

test('rejects a missing draft source without replacing outputs', async (t) => {
  const fixture = await createFixture(t);
  fixture.manifest.posts[0].sourceFile = 'articles/not-present.md';
  await fixture.writeManifest();
  await expectFailureWithoutOutputReplacement(fixture, /Missing draft source/);
});

test('rejects missing required frontmatter without replacing outputs', async (t) => {
  const fixture = await createFixture(t);
  const entry = fixture.manifest.posts[0];
  await fs.writeFile(
    path.join(fixture.draftsDir, path.basename(entry.sourceFile)),
    makeMarkdown(entry.slug, { omittedKey: 'ctaUrl' }),
    'utf-8',
  );
  await expectFailureWithoutOutputReplacement(
    fixture,
    /Missing required frontmatter \(ctaUrl\)/,
  );
});

test('rejects useful-body word counts below and above 1,800–2,500', async (t) => {
  for (const wordCount of [1799, 2501]) {
    await t.test(`${wordCount} useful words`, async (subtest) => {
      const fixture = await createFixture(subtest);
      const entry = fixture.manifest.posts[0];
      await fs.writeFile(
        path.join(fixture.draftsDir, path.basename(entry.sourceFile)),
        makeMarkdown(entry.slug, { wordCount }),
        'utf-8',
      );
      await expectFailureWithoutOutputReplacement(
        fixture,
        new RegExp(`Word count ${wordCount} outside range \\[1800, 2500\\]`),
      );
    });
  }
});

test('rejects a manifest/frontmatter slug mismatch without replacing outputs', async (t) => {
  const fixture = await createFixture(t);
  fixture.manifest.posts[0].slug = 'manifest-slug-does-not-match';
  await fixture.writeManifest();
  await expectFailureWithoutOutputReplacement(fixture, /Slug mismatch/);
});
