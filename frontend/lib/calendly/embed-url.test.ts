import { describe, expect, it } from 'vitest';
import {
  embedBgMatchesCalendlyMode,
  finalizeCalendlyEmbedColorParams,
  pickCalendlyEmbedPrimary,
  pickCalendlyEmbedText,
  resolveCalendlyPaletteForPage,
  resolveWebsitePortalCalendlyPalette,
  platformPortalThemeToCalendlyPalette,
} from '@/lib/calendly/embed-url';
import { resolvePortalTheme } from '@/lib/channel-landing-pages/resolvePortalTheme';

describe('Calendly embed color contrast', () => {
  it('prefers TikTok accent over black primary on dark surface', () => {
    const surface = '#1A1A1A';
    const primary = pickCalendlyEmbedPrimary(
      surface,
      ['#FE2C55', '#000000'],
      '#ff4a38'
    );
    expect(primary.toLowerCase()).toBe('#fe2c55');
  });

  it('keeps white body text readable on dark portal surface', () => {
    const text = pickCalendlyEmbedText('#121212', '#FFFFFF', '#f7f7fa');
    expect(text.toLowerCase()).toBe('#ffffff');
  });

  it('falls back when primary matches background (invisible links)', () => {
    const primary = pickCalendlyEmbedPrimary('#121212', ['#000000'], '#2563EB');
    expect(primary.toLowerCase()).not.toBe('#000000');
  });

  it('prefers X link blue over black brand tokens on dark surface', () => {
    const primary = pickCalendlyEmbedPrimary(
      '#16181C',
      ['#000000', '#1D9BF0', '#000000'],
      '#ff4a38'
    );
    expect(primary.toLowerCase()).toBe('#1d9bf0');
  });

  it('detects light vs dark embed backgrounds for active mode', () => {
    expect(embedBgMatchesCalendlyMode('#ffffff', 'light')).toBe(true);
    expect(embedBgMatchesCalendlyMode('#ffffff', 'dark')).toBe(false);
    expect(embedBgMatchesCalendlyMode('#101010', 'dark')).toBe(true);
    expect(embedBgMatchesCalendlyMode('#101010', 'light')).toBe(false);
  });

  it('forces light iframe text on dark embed surfaces', () => {
    const { text } = finalizeCalendlyEmbedColorParams(
      { background: '1b1f23', text: '1b1f23', primary: 'ff4a38' },
      'dark',
      { background: '07071c', text: 'f7f7fa', primary: 'ff4a38' }
    );
    expect(text.toLowerCase()).toBe('f4f4f5');
  });

  it('maps Threads dark portal theme to Calendly iframe colors', () => {
    const theme = resolvePortalTheme('threads', 'dark');
    const palette = platformPortalThemeToCalendlyPalette(theme);
    expect(palette.text.toLowerCase()).toBe('#fafafa');
    expect(palette.surface.toLowerCase()).toBe('#101010');
    const { text, background } = finalizeCalendlyEmbedColorParams(
      {
        background: palette.surface.replace('#', ''),
        text: palette.text.replace('#', ''),
        primary: 'ffffff',
      },
      'dark',
      { background: '07071c', text: 'f7f7fa', primary: 'ff4a38' }
    );
    expect(text.toLowerCase()).toBe('fafafa');
    expect(background.toLowerCase()).toBe('101010');
  });

  it('uses website portal dark theme for marketing Calendly surfaces', () => {
    const palette = resolveWebsitePortalCalendlyPalette('dark');
    expect(palette.text.toLowerCase()).toBe('#f7f7fa');
    expect(palette.background.toLowerCase()).toBe('#07071c');
    expect(palette.primary.toLowerCase()).toBe('#ff4a38');
    expect(palette.link.toLowerCase()).toBe('#ff884a');
    const { text, background, primary } = finalizeCalendlyEmbedColorParams(
      {
        background: palette.surface.replace('#', ''),
        text: palette.text.replace('#', ''),
        primary: palette.link.replace('#', ''),
      },
      'dark',
      { background: '07071c', text: 'f7f7fa', primary: 'ff4a38' }
    );
    expect(text.toLowerCase()).toBe('f7f7fa');
    expect(primary.toLowerCase()).toBe('ff884a');
  });

  it('resolves TikTok dark palette from /go/tiktok pathname', () => {
    const palette = resolveCalendlyPaletteForPage('/go/tiktok', 'dark');
    expect(palette).not.toBeNull();
    expect(palette!.link.toLowerCase()).toBe('#fe2c55');
    expect(palette!.surface.toLowerCase()).toBe('#1a1a1a');
  });

  it('resolves Threads dark palette from /go/threads pathname', () => {
    const palette = resolveCalendlyPaletteForPage('/go/threads', 'dark');
    expect(palette).not.toBeNull();
    expect(palette!.text.toLowerCase()).toBe('#fafafa');
    expect(palette!.surface.toLowerCase()).toBe('#101010');
  });

  it('uses website marketing palette on certification pages', () => {
    const palette = resolveCalendlyPaletteForPage('/certifications', 'dark');
    expect(palette).not.toBeNull();
    expect(palette!.background.toLowerCase()).toBe('#07071c');
    expect(palette!.primary.toLowerCase()).toBe('#ff4a38');
  });
});
