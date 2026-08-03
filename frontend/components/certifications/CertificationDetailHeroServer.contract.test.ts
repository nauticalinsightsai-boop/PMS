import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const componentPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'CertificationDetailHeroServer.tsx',
);
const source = readFileSync(componentPath, 'utf8');

describe('CertificationDetailHeroServer PMP display title contract', () => {
  it('uses the approved PMP-only visible H1 title', () => {
    expect(source).toContain(
      "const visibleHeroTitle = cert.id === 'pmp' ? 'PMP 2026 Pathway' : cert.detailHeroTitle;",
    );
    expect(source).toContain('visibleHeroTitle.includes(\'Pathway\')');
    expect(source).toContain('{visibleHeroTitle');
  });

  it('keeps non-PMP title data registry-derived', () => {
    expect(source).toContain(": cert.detailHeroTitle;");
    expect(source).not.toContain("cert.id === 'pmp' ? 'PMP 2026 Pathway' : 'PMP 2026 Pathway'");
  });
});
