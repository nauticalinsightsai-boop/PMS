#!/usr/bin/env node
/**
 * Newsletter Word Count Validator
 *
 * Validates word count for newsletter articles:
 * - Excludes YAML frontmatter
 * - Excludes ## References section
 * - Target range: 1800-2500 words
 * - Fails if outside range
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../..');

const MIN_WORD_COUNT = 1800;
const MAX_WORD_COUNT = 2500;

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

/**
 * Parse frontmatter and extract content
 */
function extractContent(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error('Invalid frontmatter format');
  }
  return match[2].trim();
}

/**
 * Validate a single markdown file
 */
async function validateFile(filePath) {
  const markdown = await fs.readFile(filePath, 'utf-8');
  const content = extractContent(markdown);
  const wordCount = countWords(content);

  const isValid = wordCount >= MIN_WORD_COUNT && wordCount <= MAX_WORD_COUNT;
  const status = isValid ? '✅' : '❌';

  return {
    file: path.basename(filePath),
    wordCount,
    isValid,
    status,
    message: isValid
      ? 'Within range'
      : `Outside range [${MIN_WORD_COUNT}, ${MAX_WORD_COUNT}]`,
  };
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('\n📊 Newsletter Word Count Validator\n');
    console.log('Usage: node validate-word-count.mjs <file1.md> [file2.md] ...\n');
    console.log('Example:');
    console.log('  node validate-word-count.mjs frontend/content/newsletter/drafts/*.md\n');
    process.exit(0);
  }

  console.log('\n📊 Newsletter Word Count Validator');
  console.log(`Target range: ${MIN_WORD_COUNT}–${MAX_WORD_COUNT} words\n`);

  const results = [];
  let hasFailures = false;

  for (const filePath of args) {
    try {
      const result = await validateFile(filePath);
      results.push(result);

      console.log(`${result.status} ${result.file}`);
      console.log(`   Words: ${result.wordCount}`);
      console.log(`   Status: ${result.message}\n`);

      if (!result.isValid) {
        hasFailures = true;
      }
    } catch (err) {
      console.error(`❌ ${path.basename(filePath)}`);
      console.error(`   Error: ${err.message}\n`);
      hasFailures = true;
    }
  }

  console.log('─'.repeat(60));
  console.log(`\nTotal files: ${results.length}`);
  console.log(`Valid: ${results.filter(r => r.isValid).length}`);
  console.log(`Invalid: ${results.filter(r => !r.isValid).length}\n`);

  if (hasFailures) {
    console.error('❌ Validation failed\n');
    process.exit(1);
  } else {
    console.log('✅ All files passed validation\n');
    process.exit(0);
  }
}

main();
