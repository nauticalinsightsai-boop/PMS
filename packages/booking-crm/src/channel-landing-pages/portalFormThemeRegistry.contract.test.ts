import { describe, expect, it } from 'vitest';
import { IMPLEMENTATION_SCOPE_41 } from './platformBrandSources';
import { getPlatformPortalTheme } from './platformThemes';
import { resolvePortalTheme } from './resolvePortalTheme';

const PMS_ORANGE = '#ff4a38';
const WEBSITE_PALETTE_CHANNELS = new Set(['website', 'webinar']);

function normalized(color: string): string {
  return color.trim().toLowerCase();
}

describe('portal form theme registry contract', () => {
  it('covers the complete 41-channel implementation scope', () => {
    expect(IMPLEMENTATION_SCOPE_41).toHaveLength(41);
    expect(new Set(IMPLEMENTATION_SCOPE_41).size).toBe(41);
  });

  it('retains each channel declared light-mode CTA and corner radius', () => {
    for (const channelId of IMPLEMENTATION_SCOPE_41) {
      const paletteChannelId = channelId === 'webinar' ? 'website' : channelId;
      const declared = getPlatformPortalTheme(paletteChannelId);
      const resolved = resolvePortalTheme(channelId, 'light');

      expect(resolved.recommendedBg, `${channelId} CTA`).toBe(declared.recommendedBg);
      expect(resolved.radius, `${channelId} radius`).toBe(declared.radius);
    }
  });

  it('keeps PMS website orange out of channels outside the owned website palette', () => {
    for (const channelId of IMPLEMENTATION_SCOPE_41) {
      if (WEBSITE_PALETTE_CHANNELS.has(channelId)) continue;
      for (const mode of ['light', 'dark'] as const) {
        const resolved = resolvePortalTheme(channelId, mode);

        expect(normalized(resolved.primary), `${channelId} ${mode} primary`).not.toBe(
          PMS_ORANGE,
        );
        expect(
          normalized(resolved.recommendedBg),
          `${channelId} ${mode} recommended CTA`,
        ).not.toBe(PMS_ORANGE);
      }
    }
  });

  it('uses the PMS orange CTA only for the website and its deliberate webinar alias', () => {
    const website = resolvePortalTheme('website', 'light');
    const webinar = resolvePortalTheme('webinar', 'light');

    expect(normalized(website.primary)).toBe(PMS_ORANGE);
    expect(normalized(website.recommendedBg)).toBe(PMS_ORANGE);
    expect(normalized(webinar.primary)).toBe(PMS_ORANGE);
    expect(normalized(webinar.recommendedBg)).toBe(PMS_ORANGE);
    expect(webinar.radius).toBe(website.radius);
    expect(webinar.channelId).toBe('webinar');
  });
});
