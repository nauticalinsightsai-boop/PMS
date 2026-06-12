import { describe, expect, it } from 'vitest';
import { meetsContrast } from '@/lib/channel-landing-pages/contrastUtils';
import {
  embedBgMatchesCalendlyMode,
  finalizeCalendlyEmbedColorParams,
  isProConsultationPortalCalendlyPath,
  pickCalendlyEmbedPrimary,
  pickCalendlyEmbedText,
  resolveCalendlyCloseButtonColors,
  resolveCalendlyEmbedColorsForPath,
  resolveCalendlyOverlayScrimForRoute,
  resolveCalendlyPaletteForPage,
  resolveMarketingCalendlyOverlayScrim,
  resolveWebsitePortalCalendlyPalette,
  platformPortalThemeToCalendlyPalette,
  SNAPCHAT_PORTAL_CALENDLY_OVERLAY_SCRIM_LIGHT,
  syncCalendlyEmbedColorsWithCloseButton,
  WEBSITE_MARKETING_CALENDLY_SURFACE,
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
    const palette = resolveCalendlyPaletteForPage('/certifications/pmp', 'dark');
    expect(palette).not.toBeNull();
    expect(palette!.surface.toLowerCase()).toBe('#0f172a');
    expect(palette!.border.toLowerCase()).toBe('#1e293b');
    expect(palette!.primary.toLowerCase()).toBe('#ff4a38');
  });

  it('keeps portal slug palettes separate from marketing slate surface', () => {
    const marketing = resolveCalendlyPaletteForPage('/certifications/pmp', 'dark');
    const tiktok = resolveCalendlyPaletteForPage('/go/tiktok', 'dark');
    expect(marketing!.surface.toLowerCase()).toBe('#0f172a');
    expect(tiktok!.surface.toLowerCase()).toBe('#1a1a1a');
  });

  it('uses site-dialog scrim tokens on every route in light and dark', () => {
    expect(resolveMarketingCalendlyOverlayScrim('light')).toBe('rgba(11, 11, 42, 0.46)');
    expect(resolveMarketingCalendlyOverlayScrim('dark')).toBe('rgba(15, 23, 42, 0.88)');
    expect(WEBSITE_MARKETING_CALENDLY_SURFACE.light.scrim).toBe('rgba(11, 11, 42, 0.46)');
    expect(WEBSITE_MARKETING_CALENDLY_SURFACE.dark.scrim).toBe('rgba(15, 23, 42, 0.88)');
    expect(isProConsultationPortalCalendlyPath('/go/website')).toBe(true);
    expect(isProConsultationPortalCalendlyPath('/go/webinar')).toBe(true);
    expect(isProConsultationPortalCalendlyPath('/go/beehiiv')).toBe(false);
  });

  it('uses Snapchat yellow overlay scrim on /go/snapchat light mode only', () => {
    expect(resolveCalendlyOverlayScrimForRoute('/go/snapchat', 'light')).toBe(
      SNAPCHAT_PORTAL_CALENDLY_OVERLAY_SCRIM_LIGHT
    );
    expect(resolveCalendlyOverlayScrimForRoute('/go/snapchat', 'dark')).toBe(
      'rgba(0, 0, 0, 0.82)'
    );
    expect(resolveCalendlyOverlayScrimForRoute('/go/tiktok', 'light')).toBe(
      WEBSITE_MARKETING_CALENDLY_SURFACE.light.scrim
    );
  });

  it('uses Snapchat Calendly iframe colors on /go/snapchat in light and dark mode', () => {
    const light = resolveCalendlyEmbedColorsForPath('/go/snapchat', 'light');
    expect(light.background.toLowerCase()).toBe('fffc00');
    expect(light.text.toLowerCase()).toBe('000000');
    expect(light.primary.toLowerCase()).toBe('000000');

    const dark = resolveCalendlyEmbedColorsForPath('/go/snapchat', 'dark');
    expect(dark.background.toLowerCase()).toBe('111111');
    expect(dark.text.toLowerCase()).toBe('ffffff');
    expect(dark.primary.toLowerCase()).toBe('fffc00');
  });

  it('uses Snapchat close pill colors on /go/snapchat light mode', () => {
    const lightClose = resolveCalendlyCloseButtonColors('/go/snapchat');
    expect(lightClose.closeBg.toLowerCase()).toBe('#000000');
    expect(lightClose.closeFg.toLowerCase()).toBe('#fffc00');
  });

  it('aligns Calendly iframe text_color with close button foreground on portal slugs (dark)', () => {
    for (const pathname of ['/go/beehiiv', '/go/tiktok', '/go/threads', '/go/website', '/go/webinar']) {
      const colors = resolveCalendlyEmbedColorsForPath(pathname, 'dark');
      const close = resolveCalendlyCloseButtonColors(pathname);
      expect(colors.text.toLowerCase()).toBe(close.closeFg.replace('#', '').toLowerCase());
    }
  });

  it('keeps Ghost dark Calendly primary readable on the embed surface', () => {
    const colors = resolveCalendlyEmbedColorsForPath('/go/ghost', 'dark');
    const bg = `#${colors.background}`;
    const primary = `#${colors.primary}`;
    const text = `#${colors.text}`;
    expect(meetsContrast(text, bg, 4.5)).toBe(true);
    expect(meetsContrast(primary, bg, 3)).toBe(true);
    expect(primary.toLowerCase()).not.toBe('15171a');
  });

  it('aligns Calendly iframe colors with close button on marketing pages (dark)', () => {
    for (const pathname of ['/certifications/pmp', '/pmp', '/']) {
      const colors = resolveCalendlyEmbedColorsForPath(pathname, 'dark');
      const close = resolveCalendlyCloseButtonColors(pathname);
      expect(colors.text.toLowerCase()).toBe(close.closeFg.replace('#', '').toLowerCase());
      expect(colors.primary.toLowerCase()).toBe(close.closeBg.replace('#', '').toLowerCase());
    }
  });

  it('syncCalendlyEmbedColorsWithCloseButton prefers close pill colors when contrast allows', () => {
    const pathname = '/go/beehiiv';
    const theme = 'dark' as const;
    const pal = { background: '07071c', text: 'f7f7fa', primary: 'ff4a38' };
    const portal = resolveCalendlyPaletteForPage(pathname, theme)!;
    const base = finalizeCalendlyEmbedColorParams(
      {
        background: portal.surface.replace('#', ''),
        text: portal.text.replace('#', ''),
        primary: portal.link.replace('#', ''),
      },
      theme,
      pal
    );
    const synced = syncCalendlyEmbedColorsWithCloseButton(base, pathname, theme, pal);
    const close = resolveCalendlyCloseButtonColors(pathname);
    expect(synced.text.toLowerCase()).toBe(close.closeFg.replace('#', '').toLowerCase());
    expect(synced.primary.toLowerCase()).toBe(close.closeBg.replace('#', '').toLowerCase());
  });
});
