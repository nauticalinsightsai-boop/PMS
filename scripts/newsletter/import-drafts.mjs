#!/usr/bin/env node
/**
 * Newsletter Draft Importer
 *
 * Deterministic Markdown→NewsletterPost importer for all 13 consolidated drafts.
 * - Imports manifest entries in ascending priority order
 * - Fails closed on missing files, missing required frontmatter, or word count outside 1800–2500
 * - Word counts exclude YAML frontmatter and the ## References section
 * - Stores markdown body WITHOUT YAML delimiters
 * - Assigns replaceable author profiles from newsletter-author-profiles.json
 * - Keeps status: draft, no publishDate, empty hero until approved assets arrive
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../..');

const MIN_WORD_COUNT = 1800;
const MAX_WORD_COUNT = 2500;
const EXPECTED_POST_COUNT = 13;
const DETERMINISTIC_MODIFIED_DATE = '2026-07-25T00:00:00.000Z';

const REQUIRED_FRONTMATTER = [
  'title',
  'slug',
  'excerpt',
  'seoTitle',
  'seoDescription',
  'author',
  'topics',
  'ctaLabel',
  'ctaUrl',
  'heroImageBrief',
  'heroImageAlt',
  'primaryKeyword',
  'supportingKeywords',
  'sourceReviewedOn',
];

export const DEFAULT_MANIFEST_PATH = path.join(
  REPO_ROOT,
  'packages/site-content/data/newsletter-import-manifest.json',
);

export const DEFAULT_AUTHOR_PROFILES_PATH = path.join(
  REPO_ROOT,
  'packages/site-content/data/newsletter-author-profiles.json',
);

export const DEFAULT_DRAFTS_DIR = path.join(REPO_ROOT, 'frontend/content/newsletter/drafts');
export const DEFAULT_REGISTRY_OUTPUT_PATH = path.join(
  REPO_ROOT,
  'packages/site-content/src/newsletter-draft-registry.ts',
);
export const DEFAULT_QA_OUTPUT_PATH = path.join(
  REPO_ROOT,
  'docs/internal/gsc-coverage-2026-07-25/newsletter-priority-qa-2026-07-25.md',
);

function resolveCliPath(value) {
  return path.isAbsolute(value) ? path.normalize(value) : path.resolve(process.cwd(), value);
}

export function parseCliArgs(argv) {
  let manifestPath = DEFAULT_MANIFEST_PATH;
  let qaOutputPath = DEFAULT_QA_OUTPUT_PATH;
  let help = false;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help' || argument === '-h') {
      help = true;
      continue;
    }
    if (argument === '--manifest') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--manifest requires a file path');
      }
      manifestPath = resolveCliPath(value);
      index += 1;
      continue;
    }
    if (argument.startsWith('--manifest=')) {
      const value = argument.slice('--manifest='.length);
      if (!value) {
        throw new Error('--manifest requires a file path');
      }
      manifestPath = resolveCliPath(value);
      continue;
    }
    if (argument === '--qa-output') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--qa-output requires a file path');
      }
      qaOutputPath = resolveCliPath(value);
      index += 1;
      continue;
    }
    if (argument.startsWith('--qa-output=')) {
      const value = argument.slice('--qa-output='.length);
      if (!value) {
        throw new Error('--qa-output requires a file path');
      }
      qaOutputPath = resolveCliPath(value);
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }

  return { manifestPath, qaOutputPath, help };
}

/**
 * Parse frontmatter and content from markdown file
 */
function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error('Invalid frontmatter format');
  }

  const [, frontmatterText, content] = match;
  const frontmatter = {};

  const lines = frontmatterText.split(/\r?\n/);
  let currentKey = null;
  let currentValue = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    const keyMatch = line.match(/^(\w+):\s*(.*)$/);
    if (keyMatch && !line.startsWith(' ')) {
      if (currentKey) {
        frontmatter[currentKey] = processValue(currentValue.join('\n'));
      }
      currentKey = keyMatch[1];
      currentValue = [keyMatch[2]];
    } else if (currentKey) {
      currentValue.push(line);
    }
  }

  if (currentKey) {
    frontmatter[currentKey] = processValue(currentValue.join('\n'));
  }

  return { frontmatter, content: content.trim() };
}

function processValue(value) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  if (trimmed.includes('\n  -') || trimmed.startsWith('-')) {
    return trimmed
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.startsWith('-'))
      .map((line) => line.replace(/^-\s*/, '').trim())
      .filter(Boolean);
  }

  return trimmed;
}

function assertRequiredFrontmatter(frontmatter, sourceFile) {
  const missing = REQUIRED_FRONTMATTER.filter((key) => {
    const value = frontmatter[key];
    if (Array.isArray(value)) return value.length === 0;
    return value === undefined || value === null || String(value).trim() === '';
  });
  if (missing.length > 0) {
    throw new Error(`Missing required frontmatter (${missing.join(', ')}) in ${sourceFile}`);
  }
}

/**
 * Count useful body words per QA convention:
 * - YAML already stripped by the frontmatter parser
 * - exclude the ## References section
 * - exclude the leading Markdown H1 (page template owns the visible H1)
 */
function countWords(content) {
  const withoutRefs = content.replace(/##\s+References[\s\S]*$/m, '').trim();
  const withoutLeadingH1 = withoutRefs.replace(/^\s*#\s+[^\r\n]+(?:\r?\n)+/, '').trim();
  return withoutLeadingH1.split(/\s+/).filter((word) => word.length > 0).length;
}

function countReferences(content) {
  const refsMatch = content.match(/##\s+References([\s\S]*)$/m);
  if (!refsMatch) return 0;

  const refsSection = refsMatch[1];
  const numbered = refsSection.match(/^\s*\d+\.\s+/gm) || [];
  const bullets = refsSection.match(/^\s*[-*+]\s+/gm) || [];
  // Prefer human-readable list entries; ignore bare link-definition lines.
  return Math.max(numbered.length, bullets.length);
}

export function assessAuthorPublicationReadiness(authorProfile) {
  const bylineType = authorProfile?.bylineType ?? 'person';
  const blockers = [];

  if (bylineType !== 'person' && bylineType !== 'editorial_role') {
    blockers.push(`Unrecognized author byline type (${String(bylineType)})`);
    return { bylineType, blockers };
  }

  if (bylineType === 'editorial_role') {
    if (authorProfile.profilePending) {
      blockers.push(`Editorial role is incorrectly marked profile pending (${authorProfile.name})`);
    }
    if (authorProfile.personSchemaEligible) {
      blockers.push(`Editorial role is incorrectly Person-schema eligible (${authorProfile.name})`);
    }
    const bio = String(authorProfile.bio ?? '').trim();
    if (!bio || /^profile pending\.?$/i.test(bio)) {
      blockers.push(`Editorial role needs a truthful role description (${authorProfile.name})`);
    }
    const personOnlyFields = ['linkedinUrl', 'twitterUrl', 'websiteUrl', 'email'].filter(
      (field) => String(authorProfile[field] ?? '').trim() !== '',
    );
    if (personOnlyFields.length > 0) {
      blockers.push(
        `Editorial role exposes person-profile fields (${authorProfile.name}: ${personOnlyFields.join(', ')})`,
      );
    }
    return { bylineType, blockers };
  }

  if (authorProfile.profilePending || !authorProfile.personSchemaEligible) {
    blockers.push(`Incomplete real-person author profile (${authorProfile.name})`);
  }
  return { bylineType, blockers };
}

function assertFileReadable(filePath, label) {
  return fs.access(filePath).catch(() => {
    throw new Error(`Missing ${label}: ${filePath}`);
  });
}

function markdownToNewsletterPost(markdown, sourceFile, authorProfile) {
  const { frontmatter, content } = parseFrontmatter(markdown);
  assertRequiredFrontmatter(frontmatter, sourceFile);

  const wordCount = countWords(content);
  if (wordCount < MIN_WORD_COUNT || wordCount > MAX_WORD_COUNT) {
    throw new Error(
      `Word count ${wordCount} outside range [${MIN_WORD_COUNT}, ${MAX_WORD_COUNT}] for ${sourceFile}`,
    );
  }

  const slug = frontmatter.slug || path.basename(sourceFile, '.md');
  if (slug !== frontmatter.slug) {
    throw new Error(`Frontmatter slug missing or invalid in ${sourceFile}`);
  }

  const topics = Array.isArray(frontmatter.topics) ? frontmatter.topics : [];
  const authorReadiness = assessAuthorPublicationReadiness(authorProfile);
  const authorStatusNote =
    authorReadiness.bylineType === 'editorial_role'
      ? 'Author byline: transparent PM Structure editorial role (Organization schema fallback)'
      : authorReadiness.blockers.length > 0
        ? 'Author profile incomplete'
        : 'Author profile verified';

  return {
    id: `post-${slug}`,
    slug,
    title: frontmatter.title,
    description: frontmatter.excerpt || frontmatter.seoDescription || '',
    metaTitle: frontmatter.seoTitle || frontmatter.title || '',
    metaDescription: frontmatter.seoDescription || frontmatter.excerpt || '',
    keywords: Array.isArray(frontmatter.supportingKeywords)
      ? [frontmatter.primaryKeyword, ...frontmatter.supportingKeywords].filter(Boolean).join(', ')
      : frontmatter.primaryKeyword || '',
    status: 'draft',
    publishDate: '',
    modifiedDate: DETERMINISTIC_MODIFIED_DATE,
    author: authorProfile.name,
    authorId: authorProfile.id,
    topics: topics.slice(0, 3),
    youtubeUrl: '',
    featuredImageUrl: '',
    featuredImageMobileUrl: '',
    heroImageAlt: frontmatter.heroImageAlt || '',
    emailSubject: '',
    emailPreheader: '',
    ctaLabel: frontmatter.ctaLabel || '',
    ctaUrl: frontmatter.ctaUrl || '',
    editorMeta: {
      tone: 'informative',
      template: 'news_roundup',
      segment: 'all',
      sectionCount: 4,
      rawNotes: [
        `Source: ${sourceFile}`,
        `Word count: ${wordCount}`,
        `Source reviewed: ${frontmatter.sourceReviewedOn}`,
        `Author profile: ${authorProfile.id}`,
        authorStatusNote,
        'Hero image pending',
      ].join('\n'),
    },
    audioUrl: '',
    content,
    _qa: {
      wordCount,
      referenceCount: countReferences(content),
      sourceFile,
      authorName: authorProfile.name,
      authorId: authorProfile.id,
      authorTitle: authorProfile.title,
      bylineType: authorReadiness.bylineType,
      profilePending: Boolean(authorProfile.profilePending),
      personSchemaEligible: Boolean(authorProfile.personSchemaEligible),
      authorPublicationBlockers: authorReadiness.blockers,
      heroImageStatus: 'pending',
    },
  };
}

async function loadAuthorProfiles(authorProfilesPath) {
  await assertFileReadable(authorProfilesPath, 'author profiles registry');
  const raw = JSON.parse(await fs.readFile(authorProfilesPath, 'utf-8'));
  if (!raw?.profiles?.length || !raw?.allocationByPriority) {
    throw new Error('Author profiles registry is missing profiles or allocationByPriority');
  }
  const byId = new Map(raw.profiles.map((profile) => [profile.id, profile]));
  return { byId, allocationByPriority: raw.allocationByPriority };
}

export async function importAllManifestArticles({
  manifestPath = DEFAULT_MANIFEST_PATH,
  draftsDir = DEFAULT_DRAFTS_DIR,
  authorProfilesPath = DEFAULT_AUTHOR_PROFILES_PATH,
  logger = console.log,
} = {}) {
  await assertFileReadable(manifestPath, 'import manifest');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
  if (!Array.isArray(manifest.posts) || manifest.posts.length !== EXPECTED_POST_COUNT) {
    throw new Error(
      `Manifest must contain exactly ${EXPECTED_POST_COUNT} posts (found ${manifest.posts?.length ?? 0})`,
    );
  }

  const { byId, allocationByPriority } = await loadAuthorProfiles(authorProfilesPath);

  const ordered = [...manifest.posts].sort((a, b) => a.priority - b.priority);
  const seenPriorities = new Set();
  const importedPosts = [];
  const qaData = [];

  logger(`\nImporting ${ordered.length} newsletter drafts in priority order...\n`);

  for (const entry of ordered) {
    if (seenPriorities.has(entry.priority)) {
      throw new Error(`Duplicate manifest priority: ${entry.priority}`);
    }
    seenPriorities.add(entry.priority);

    const authorId = allocationByPriority[String(entry.priority)];
    if (!authorId) {
      throw new Error(`No author allocation for priority ${entry.priority}`);
    }
    const authorProfile = byId.get(authorId);
    if (!authorProfile) {
      throw new Error(`Missing author profile ${authorId} for priority ${entry.priority}`);
    }

    const sourceFileName = path.basename(entry.sourceFile);
    const sourcePath = path.join(draftsDir, sourceFileName);
    await assertFileReadable(sourcePath, `draft source for priority ${entry.priority}`);

    logger(`Processing priority ${entry.priority}: ${sourceFileName}`);

    const markdown = await fs.readFile(sourcePath, 'utf-8');
    const post = markdownToNewsletterPost(markdown, sourceFileName, authorProfile);

    if (post.slug !== entry.slug) {
      throw new Error(
        `Slug mismatch for ${sourceFileName}: frontmatter "${post.slug}" vs manifest "${entry.slug}"`,
      );
    }

    const { _qa, ...registryPost } = post;
    importedPosts.push(registryPost);

    const publicationBlockers = [
      'Missing approved hero image',
      'Draft status — not approved for publication',
      ..._qa.authorPublicationBlockers,
    ];

    qaData.push({
      priority: entry.priority,
      slug: registryPost.slug,
      title: registryPost.title,
      status: registryPost.status,
      wordCount: _qa.wordCount,
      referenceCount: _qa.referenceCount,
      metaTitleLength: registryPost.metaTitle.length,
      metaDescriptionLength: registryPost.metaDescription.length,
      sourceFile: sourceFileName,
      authorName: _qa.authorName,
      authorId: _qa.authorId,
      authorTitle: _qa.authorTitle,
      bylineType: _qa.bylineType,
      profilePending: _qa.profilePending,
      personSchemaEligible: _qa.personSchemaEligible,
      heroImageStatus: 'pending (empty featuredImageUrl)',
      publicationBlockers,
    });

    logger(`   Slug: ${registryPost.slug}`);
    logger(`   Author: ${_qa.authorName} (${_qa.authorId})`);
    logger(`   Word count: ${_qa.wordCount}`);
    logger(`   References: ${_qa.referenceCount}`);
    logger();
  }

  if (importedPosts.length !== EXPECTED_POST_COUNT) {
    throw new Error(`Expected ${EXPECTED_POST_COUNT} imports, got ${importedPosts.length}`);
  }

  const uniqueSlugs = new Set(importedPosts.map((post) => post.slug));
  if (uniqueSlugs.size !== EXPECTED_POST_COUNT) {
    throw new Error('Imported slugs are not unique');
  }

  return { importedPosts, qaData };
}

function renderDraftRegistry(posts) {
  const registry = {
    version: 1,
    posts,
  };

  return `/**
 * Newsletter Draft Registry
 *
 * All 13 consolidated newsletter drafts imported from markdown sources.
 * Generated by scripts/newsletter/import-drafts.mjs
 * DO NOT EDIT MANUALLY - regenerate using the import script.
 */

import type { NewsletterPostsRegistry } from './newsletter-posts';

export const newsletterDraftRegistry: NewsletterPostsRegistry = ${JSON.stringify(registry, null, 2)} as const;
`;
}

function renderQAReport(qaData) {
  let report = `# Newsletter Priority QA Report
**Generated:** 2026-07-25
**Import batch:** All 13 consolidated newsletter drafts (priorities 1–13)
**Target registry:** newsletter_posts_registry (draft status)

## Import Summary

| Metric | Value |
|--------|-------|
| Articles imported | ${qaData.length} |
| Draft status | All set to \`draft\` |
| Publish dates | All empty |
| Hero images | All pending (empty \`featuredImageUrl\`) |
| Author model | Explicit person or transparent editorial-role bylines (\`newsletter-author-profiles.json\`) |

## Slug → author assignment

| Priority | Slug | Author | Author ID | Byline type | Profile pending |
| ---: | --- | --- | --- | --- | --- |
${qaData
  .map(
    (item) =>
      `| ${item.priority} | \`${item.slug}\` | ${item.authorName} | \`${item.authorId}\` | \`${item.bylineType}\` | ${item.profilePending ? 'yes' : 'no'} |`,
  )
  .join('\n')}

## Article Quality Checklist

`;

  for (const item of qaData) {
    const previewUrl = `http://localhost:3000/newsletter/${item.slug}?preview=1`;
    const wordStatus =
      item.wordCount >= MIN_WORD_COUNT && item.wordCount <= MAX_WORD_COUNT ? 'pass' : 'FAIL';

    report += `### ${item.title}

- **Priority:** ${item.priority}
- **Slug:** \`${item.slug}\`
- **Status:** \`${item.status}\`
- **Preview URL:** ${previewUrl}
- **Word count:** ${wordStatus} ${item.wordCount} words (target: ${MIN_WORD_COUNT}–${MAX_WORD_COUNT}; excludes YAML, leading H1, and References)
- **References:** ${item.referenceCount}
- **Meta title length:** ${item.metaTitleLength} chars
- **Meta description length:** ${item.metaDescriptionLength} chars
- **Author:** ${item.authorName} (\`${item.authorId}\`)
- **Author title:** ${item.authorTitle}
- **Byline type:** \`${item.bylineType}\`
- **Person schema eligible:** ${
      item.personSchemaEligible
        ? 'yes'
        : item.bylineType === 'editorial_role'
          ? 'no (transparent editorial role; use Organization fallback)'
          : 'no (real-person profile incomplete; use Organization fallback)'
    }
- **Source file:** \`${item.sourceFile}\`
- **Hero image:** ${item.heroImageStatus}
- **JSON-LD author:** ${
      item.personSchemaEligible
        ? 'eligible Person profile'
        : 'PM Structure Organization fallback; never synthesize a Person'
    }

**Publication blockers:**
${item.publicationBlockers.map((b) => `- ${b}`).join('\n')}

---

`;
  }

  report += `## Publication gates (all 13 remain drafts)

1. Approved hero art + descriptive alt text for every slug
2. No generic fallback artwork on published pages
3. Official-source references and current-date claims reviewed
4. No unsupported PMI affiliation, provider, pass-rate, salary, ROI, or accreditation claims
5. One visible H1 per article (template strips leading Markdown H1)
6. Draft previews remain \`noindex\`
7. Incomplete real-person profiles remain blockers; transparent editorial roles remain organisation bylines and must never emit Person schema

## Notes

- Content stored WITHOUT YAML frontmatter delimiters
- Word counts exclude YAML, the leading Markdown H1, and the \`## References\` section
- Author assignment is controlled by the profile registry allocation map; article bodies were not rewritten for bylines
- Changing \`packages/site-content/data/newsletter-author-profiles.json\` replaces profiles without editing draft Markdown
`;

  return report;
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Stage both generated files before replacing either destination. If promotion
 * fails, restore the previous pair so a failed run cannot leave mixed outputs.
 */
async function writeGeneratedOutputsAtomically({
  registryOutputPath,
  registryContent,
  qaOutputPath,
  qaContent,
}) {
  const token = `${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const targets = [
    {
      outputPath: registryOutputPath,
      content: registryContent,
      temporaryPath: `${registryOutputPath}.tmp-${token}`,
      backupPath: `${registryOutputPath}.bak-${token}`,
      hadOriginal: false,
      promoted: false,
    },
    {
      outputPath: qaOutputPath,
      content: qaContent,
      temporaryPath: `${qaOutputPath}.tmp-${token}`,
      backupPath: `${qaOutputPath}.bak-${token}`,
      hadOriginal: false,
      promoted: false,
    },
  ];

  for (const target of targets) {
    await fs.mkdir(path.dirname(target.outputPath), { recursive: true });
    await fs.writeFile(target.temporaryPath, target.content, 'utf-8');
  }

  try {
    for (const target of targets) {
      target.hadOriginal = await pathExists(target.outputPath);
      if (target.hadOriginal) {
        await fs.rename(target.outputPath, target.backupPath);
      }
    }

    for (const target of targets) {
      await fs.rename(target.temporaryPath, target.outputPath);
      target.promoted = true;
    }
  } catch (error) {
    for (const target of [...targets].reverse()) {
      if (target.promoted) {
        await fs.rm(target.outputPath, { force: true }).catch(() => {});
      }
      if (target.hadOriginal && (await pathExists(target.backupPath))) {
        await fs.rename(target.backupPath, target.outputPath).catch(() => {});
      }
      await fs.rm(target.temporaryPath, { force: true }).catch(() => {});
    }
    throw error;
  }

  await Promise.allSettled(
    targets.flatMap((target) => [
      fs.rm(target.backupPath, { force: true }),
      fs.rm(target.temporaryPath, { force: true }),
    ]),
  );
}

export async function importNewsletterDrafts({
  manifestPath = DEFAULT_MANIFEST_PATH,
  draftsDir = DEFAULT_DRAFTS_DIR,
  authorProfilesPath = DEFAULT_AUTHOR_PROFILES_PATH,
  registryOutputPath = DEFAULT_REGISTRY_OUTPUT_PATH,
  qaOutputPath = DEFAULT_QA_OUTPUT_PATH,
  logger = console.log,
} = {}) {
  const { importedPosts, qaData } = await importAllManifestArticles({
    manifestPath,
    draftsDir,
    authorProfilesPath,
    logger,
  });

  await writeGeneratedOutputsAtomically({
    registryOutputPath,
    registryContent: renderDraftRegistry(importedPosts),
    qaOutputPath,
    qaContent: renderQAReport(qaData),
  });

  logger(`Draft registry written to: ${registryOutputPath}\n`);
  logger(`QA report written to: ${qaOutputPath}\n`);

  return {
    importedPosts,
    qaData,
    registryOutputPath,
    qaOutputPath,
  };
}

async function main() {
  try {
    const { manifestPath, qaOutputPath, help } = parseCliArgs(process.argv.slice(2));
    if (help) {
      console.log(
        'Usage: node scripts/newsletter/import-drafts.mjs [--manifest <path>] [--qa-output <path>]\n\n' +
          `Default manifest: ${DEFAULT_MANIFEST_PATH}\n` +
          `Default QA output: ${DEFAULT_QA_OUTPUT_PATH}`,
      );
      return;
    }

    console.log('\nNewsletter Draft Import — all 13 consolidated articles\n');

    const result = await importNewsletterDrafts({ manifestPath, qaOutputPath });

    console.log('Import complete.\n');
    console.log('Files updated:');
    console.log('   - packages/site-content/src/newsletter-draft-registry.ts');
    console.log(`   - ${result.qaOutputPath}`);
  } catch (err) {
    console.error('\nImport failed:', err.message);
    console.error(err.stack);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main();
}
