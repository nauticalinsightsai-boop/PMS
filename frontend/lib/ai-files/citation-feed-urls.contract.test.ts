import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildEntityJson, buildLlmsTxt, buildPmpArticlesFeedJson, buildTopicsJson } from '@/lib/ai-files/builders';

const REDIRECT_IDENTITIES = [
  '/topics/pmp-exam-2026',
  '/newsletter/2026-pmp-exam-changes',
];

const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(here, '../../public');

function collectTextFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === 'node_modules' || name.startsWith('.')) continue;
      collectTextFiles(full, out);
    } else if (/\.(json|txt)$/i.test(name)) {
      out.push(full);
    }
  }
  return out;
}

describe('OPEN-04 citation/feed URL contract', () => {
  it('builders do not recommend redirecting citation identities', () => {
    const blob = [
      buildLlmsTxt(),
      JSON.stringify(buildEntityJson()),
      JSON.stringify(buildTopicsJson()),
      JSON.stringify(buildPmpArticlesFeedJson()),
    ].join('\n');

    for (const identity of REDIRECT_IDENTITIES) {
      expect(blob).not.toContain(identity);
    }
  });

  it('public AI outputs do not contain redirect identities', () => {
    const files = collectTextFiles(publicDir).filter((f) =>
      /(?:llms\.txt|entity\.json|topics\.json|pmp-articles\.json)$/i.test(f),
    );
    expect(files.length).toBeGreaterThanOrEqual(4);
    for (const file of files) {
      const text = readFileSync(file, 'utf8');
      for (const identity of REDIRECT_IDENTITIES) {
        expect(text, path.relative(publicDir, file)).not.toContain(identity);
      }
    }
  });

  it('entity and articles feed cite final destinations', () => {
    const entity = buildEntityJson() as { bestPagesToCite: string[] };
    expect(entity.bestPagesToCite).toContain('https://pmstructure.com/pmp-exam-2026');
    expect(entity.bestPagesToCite.filter((u) => u.includes('pmp-exam-2026'))).toHaveLength(1);

    const feed = buildPmpArticlesFeedJson() as { items: { url: string }[] };
    expect(feed.items.some((i) => i.url.endsWith('/newsletter/post-transition-pmp-reset-july-2026'))).toBe(
      true,
    );
  });
});
