import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  isCircleCustomDomainAllowlisted,
  scanRepoLine,
} from './audit-insecure-content.mjs';

function findingsFor(line, relPath, lineNo = 1) {
  const findings = [];
  scanRepoLine(line, relPath, lineNo, findings);
  return findings;
}

describe('Circle custom-domain allowlist (audit-insecure-content)', () => {
  it('allows exact Circle config and README join contexts', () => {
    const allowed = [
      [
        'frontend/config/community.ts',
        "  'https://www.pmstructure.com/join?invitation_token=fc889aa3995f03e8d4923034079eb19a07d3599a-0caba3de-aabe-4309-9177-73c221df358a';",
      ],
      [
        'frontend/config/community.ts',
        "export const CIRCLE_CUSTOM_DOMAIN_URL = 'https://www.pmstructure.com';",
      ],
      [
        'frontend/config/README.md',
        'NEXT_PUBLIC_CIRCLE_COMMUNITY_JOIN_URL=https://www.pmstructure.com/join?invitation_token=…',
      ],
    ];

    for (const [relPath, line] of allowed) {
      assert.equal(
        isCircleCustomDomainAllowlisted(relPath, line),
        true,
        `expected allow: ${relPath} :: ${line}`,
      );
      assert.equal(
        findingsFor(line, relPath).filter((f) => f.kind === 'www-host').length,
        0,
        `www-host finding for allowed line: ${line}`,
      );
    }
  });

  it('rejects the same www.pmstructure.com host outside Circle contexts', () => {
    const rejectLines = [
      ['frontend/lib/site-metadata.ts', "canonicalBase: 'https://www.pmstructure.com'"],
      ['frontend/app/(site)/page.tsx', '<link rel="canonical" href="https://www.pmstructure.com/" />'],
      ['frontend/components/PublicShell.tsx', "const site = 'https://www.pmstructure.com'"],
      ['frontend/public/sitemap.xml', '<loc>https://www.pmstructure.com/</loc>'],
      ['frontend/public/robots.txt', 'Sitemap: https://www.pmstructure.com/sitemap.xml'],
      ['frontend/config/site.ts', "export const SITE_URL = 'https://www.pmstructure.com'"],
      [
        'frontend/config/community.ts',
        "export const OTHER_URL = 'https://www.pmstructure.com/pricing';",
      ],
      [
        'frontend/config/README.md',
        'NEXT_PUBLIC_SITE_URL=https://www.pmstructure.com',
      ],
    ];

    for (const [relPath, line] of rejectLines) {
      assert.equal(
        isCircleCustomDomainAllowlisted(relPath, line),
        false,
        `expected reject allowlist: ${relPath} :: ${line}`,
      );
      const www = findingsFor(line, relPath).filter((f) => f.kind === 'www-host');
      assert.equal(www.length, 1, `expected www-host finding: ${relPath} :: ${line}`);
    }
  });

  it('still rejects http://, protocol-relative, and ws:// references', () => {
    const cases = [
      {
        line: "href='http://pmstructure.com/join'",
        relPath: 'frontend/config/community.ts',
        kind: 'http',
      },
      {
        line: '<img src="//cdn.example.com/a.png" />',
        relPath: 'frontend/components/PublicShell.tsx',
        kind: 'protocol-relative',
      },
      {
        line: "const socket = 'ws://example.com/socket';",
        relPath: 'frontend/lib/realtime.ts',
        kind: 'ws',
      },
    ];

    for (const { line, relPath, kind } of cases) {
      const kinds = findingsFor(line, relPath).map((f) => f.kind);
      assert.ok(kinds.includes(kind), `expected ${kind} in ${JSON.stringify(kinds)} for ${line}`);
    }
  });
});
