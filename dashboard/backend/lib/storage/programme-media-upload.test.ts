import { describe, expect, it } from 'vitest';
import { buildProgrammeMediaObjectKey } from './programme-media-upload';

describe('buildProgrammeMediaObjectKey', () => {
  it('builds a pdf path for session slides', () => {
    const { path, contentType } = buildProgrammeMediaObjectKey({
      certId: 'pmp',
      tier: 'foundation',
      kind: 'slides',
      filename: 'D0-navigator.pdf',
    });
    expect(contentType).toBe('application/pdf');
    expect(path).toMatch(/^pmp\/foundation\/slides-\d+\.pdf$/);
  });

  it('rejects unsupported types', () => {
    expect(() =>
      buildProgrammeMediaObjectKey({
        certId: 'pmp',
        tier: 'foundation',
        kind: 'slides',
        filename: 'notes.txt',
      }),
    ).toThrow(/Unsupported file type/);
  });
});
