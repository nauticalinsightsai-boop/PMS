import { describe, expect, it } from 'vitest';
import {
  effectiveProgrammeAssets,
  isLegacyProgrammeAssetUrl,
  mergeProgrammeAssets,
} from './legacy-programme-assets';

describe('legacy-programme-assets', () => {
  it('does not ship a bundled overview video (upload via R2 instead)', () => {
    const assets = effectiveProgrammeAssets('pmp-preparation-foundation', {});
    expect(assets.videoUrl).toBeUndefined();
  });

  it('clears bundled assets when CMS stores an empty override', () => {
    const legacy = effectiveProgrammeAssets('pmp-preparation-foundation', {});
    const merged = mergeProgrammeAssets(
      { guidePdfUrl: '' },
      legacy,
    );
    expect(merged.guidePdfUrl).toBeUndefined();
    expect(merged.infographicUrl).toBe('/programme/pmp-foundation-roadmap.png');
  });

  it('treats explicit CMS clears as non-legacy', () => {
    const isLegacy = isLegacyProgrammeAssetUrl(
      'pmp-preparation-foundation',
      'guidePdfUrl',
      '/programme/pmp-foundation-program-guide.pdf',
      { guidePdfUrl: '' },
    );
    expect(isLegacy).toBe(false);
  });
});
