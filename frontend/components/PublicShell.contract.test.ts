import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./PublicShell.tsx', import.meta.url), 'utf8');

describe('PublicShell skip link and main landmark contract', () => {
  it('places Skip to main content as the first focusable element in the shell DOM', () => {
    const shellReturn = source.slice(source.indexOf('return ('));
    const skipIdx = shellReturn.indexOf('Skip to main content');
    const navbarIdx = shellReturn.indexOf('<Navbar');
    const mainIdx = shellReturn.indexOf('<main');
    expect(skipIdx).toBeGreaterThan(-1);
    expect(navbarIdx).toBeGreaterThan(skipIdx);
    expect(mainIdx).toBeGreaterThan(navbarIdx);
    expect(source).toContain('href={`#${MAIN_CONTENT_ID}`}');
    expect(source).toContain('onClick={focusMainContent}');
  });

  it('keeps the skip link offscreen until focus, >=44px, and above Navbar z-[100]', () => {
    expect(source).toContain("const SKIP_TO_MAIN_CLASS =");
    expect(source).toContain('z-[110]');
    expect(source).toContain('min-h-11');
    expect(source).toContain('min-w-11');
    expect(source).toContain('-translate-y-[160%]');
    expect(source).toContain('focus:translate-y-4');
  });

  it('wires skip activation to focus main#main-content and scroll with header-safe offset', () => {
    expect(source).toContain("export const MAIN_CONTENT_ID = 'main-content'");
    expect(source).toContain('export const MAIN_CONTENT_HEADER_OFFSET_PX = 64');
    expect(source).toContain('document.getElementById(MAIN_CONTENT_ID)');
    expect(source).toContain('main.focus({ preventScroll: true })');
    expect(source).toContain('MAIN_CONTENT_HEADER_OFFSET_PX');
    expect(source).toContain('window.scrollTo({ top: Math.max(0, top), behavior: \'smooth\' })');
  });

  it('applies sole main landmark with id, tabIndex=-1, scroll-margin, and outline-safe classes', () => {
    expect(source).toContain('id={MAIN_CONTENT_ID}');
    expect(source).toContain('tabIndex={-1}');
    expect(source).toContain("export const MAIN_CONTENT_SCROLL_MARGIN_CLASS = 'scroll-mt-16'");
    expect(source).toContain('MAIN_CONTENT_SCROLL_MARGIN_CLASS');
    expect(source).toContain('outline-none');
    expect(source).not.toMatch(/tabIndex=\{[1-9]/);
    expect(source).not.toMatch(/tabIndex="[1-9]/);
    const mainTags = source.match(/<main\b/g) || [];
    expect(mainTags).toHaveLength(1);
  });

  it('keeps CookieConsent as a sibling outside main (not nested inside main)', () => {
    const mainOpen = source.indexOf('<main');
    const mainClose = source.indexOf('</main>');
    const cookie = source.indexOf('<CookieConsent');
    expect(mainOpen).toBeGreaterThan(-1);
    expect(mainClose).toBeGreaterThan(mainOpen);
    expect(cookie).toBeGreaterThan(mainClose);
  });

  it('preserves Navbar, Footer, and existing shell children order around main', () => {
    const shellReturn = source.slice(source.indexOf('return ('));
    expect(shellReturn.indexOf('<Navbar')).toBeLessThan(shellReturn.indexOf('<main'));
    expect(shellReturn.indexOf('</main>')).toBeLessThan(shellReturn.indexOf('<Footer'));
    expect(shellReturn).toContain('<ScrollToTop');
    expect(shellReturn).toContain('<KeywordLeadPopup');
  });
});
