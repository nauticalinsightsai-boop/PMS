import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import {
  bootstrapGaCommandTarget,
  dispatchLoadedGaPageview,
  type GaDispatchState,
} from '../../components/analytics/GoogleAnalytics';
import { buildGaRoutePageview, shouldDispatchGaRoute } from './ga-route-pageview';

function targetWithCommands() {
  const commands: unknown[][] = [];
  const target: { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void } = {};
  bootstrapGaCommandTarget(target);
  target.gtag = (...args: unknown[]) => commands.push(args);
  return { commands, target };
}

describe('GA route pageview contract', () => {
  it.each(['/', '/newsletter', '/certifications/pmp/professional/enroll'])(
    'builds one deterministic payload for %s',
    (pathname) => {
      const result = buildGaRoutePageview({ origin: 'https://pmstructure.com', pathname, title: 'PM Structure' });
      expect(result?.routeKey).toBe(pathname);
      expect(result?.params.page_location).toBe(`https://pmstructure.com${pathname}`);
    },
  );

  it('retains only five bounded UTMs in deterministic order', () => {
    const long = 'x'.repeat(250);
    const result = buildGaRoutePageview({
      origin: 'https://pmstructure.com',
      pathname: '/newsletter',
      search: `gclid=secret&utm_term=${long}&email=a%40b.test&utm_source=owned&utm_campaign=launch#fragment`,
      title: 'Newsletter',
    });
    expect(result?.params.page_location).toBe(
      `https://pmstructure.com/newsletter?utm_source=owned&utm_campaign=launch&utm_term=${'x'.repeat(200)}`,
    );
    expect(JSON.stringify(result)).not.toMatch(/gclid|email|secret|fragment|a%40b/i);
  });

  it('dedupes unchanged routes but permits a later return after transition', () => {
    expect(shouldDispatchGaRoute(null, '/')).toBe(true);
    expect(shouldDispatchGaRoute('/', '/')).toBe(false);
    expect(shouldDispatchGaRoute('/', '/newsletter')).toBe(true);
    expect(shouldDispatchGaRoute('/newsletter', '/')).toBe(true);
  });

  it('fails closed for malformed or unsafe origins', () => {
    expect(buildGaRoutePageview({ origin: 'not-a-url', pathname: '/', title: '' })).toBeNull();
    expect(buildGaRoutePageview({ origin: 'http://preview.example', pathname: '/', title: '' })).toBeNull();
  });

  it('component owns consent, config ordering, and listener cleanup', () => {
    const source = fs.readFileSync(
      new URL('../../components/analytics/GoogleAnalytics.tsx', import.meta.url),
      'utf8',
    );
    expect(source.indexOf('bootstrapGaCommandTarget')).toBeLessThan(source.indexOf('<Script'));
    expect(source).toContain("loaderState !== 'ready'");
    expect(source).toContain("onLoad={() => setLoaderState('ready')}");
    expect(source).toContain("onError={() => setLoaderState('failed')}");
    expect(source.indexOf("gtag('config', gaId, { send_page_view: false })")).toBeLessThan(
      source.indexOf("gtag('event', 'page_view', payload.params)"),
    );
    expect(source).toContain("window.addEventListener('legal-consent-updated', sync)");
    expect(source).toContain("window.removeEventListener('legal-consent-updated', sync)");
    expect(source).not.toMatch(/Meta|fbq|trackMeta/);
  });

  it('bootstraps the command target before loader execution', () => {
    const target: { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void } = {};
    bootstrapGaCommandTarget(target);
    expect(target.dataLayer).toEqual([]);
    expect(target.gtag).toBeTypeOf('function');
    const commandArgs = ['event', 'test', { send_to: 'G-TEST' }] as const;
    target.gtag?.(...commandArgs);
    const queuedEntry = target.dataLayer?.[0];
    expect(Array.isArray(queuedEntry)).toBe(false);
    expect(Object.prototype.toString.call(queuedEntry)).toBe('[object Arguments]');
    expect(Array.from(queuedEntry as ArrayLike<unknown>)).toEqual(commandArgs);
  });

  it.each(['/', '/newsletter', '/certifications/pmp/professional/enroll'])(
    'waits for loader success, then configures before one page_view for %s',
    (pathname) => {
      const { commands, target } = targetWithCommands();
      const payload = buildGaRoutePageview({ origin: 'https://pmstructure.com', pathname, title: 'PM Structure' });
      const initial: GaDispatchState = { configured: false, lastRouteKey: null };

      expect(
        dispatchLoadedGaPageview({
          target,
          allowed: true,
          loaderReady: false,
          loaderFailed: false,
          gaId: 'G-TEST',
          payload,
          state: initial,
        }),
      ).toEqual(initial);
      expect(commands).toEqual([]);

      const loaded = dispatchLoadedGaPageview({
        target,
        allowed: true,
        loaderReady: true,
        loaderFailed: false,
        gaId: 'G-TEST',
        payload,
        state: initial,
      });
      expect(commands.map((command) => command.slice(0, 2))).toEqual([
        ['js', expect.any(Date)],
        ['config', 'G-TEST'],
        ['event', 'page_view'],
      ]);
      expect(commands[1]?.[2]).toEqual({ send_page_view: false });
      expect(loaded).toEqual({ configured: true, lastRouteKey: pathname });
    },
  );

  it('fails closed for no consent, loader failure, and revocation', () => {
    const { commands, target } = targetWithCommands();
    const payload = buildGaRoutePageview({ origin: 'https://pmstructure.com', pathname: '/', title: 'Home' });
    const state: GaDispatchState = { configured: false, lastRouteKey: null };
    for (const gate of [
      { allowed: false, loaderReady: true, loaderFailed: false },
      { allowed: true, loaderReady: true, loaderFailed: true },
      { allowed: false, loaderReady: false, loaderFailed: true },
    ]) {
      expect(dispatchLoadedGaPageview({ target, gaId: 'G-TEST', payload, state, ...gate })).toEqual(state);
    }
    expect(commands).toEqual([]);
  });

  it('dedupes same-route regrant while allowing a later real navigation', () => {
    const { commands, target } = targetWithCommands();
    const home = buildGaRoutePageview({ origin: 'https://pmstructure.com', pathname: '/', title: 'Home' });
    const newsletter = buildGaRoutePageview({
      origin: 'https://pmstructure.com',
      pathname: '/newsletter',
      title: 'Newsletter',
    });
    const common = { target, allowed: true, loaderReady: true, loaderFailed: false, gaId: 'G-TEST' };
    const homeState = dispatchLoadedGaPageview({
      ...common,
      payload: home,
      state: { configured: false, lastRouteKey: null },
    });
    const regrantState = dispatchLoadedGaPageview({ ...common, payload: home, state: homeState });
    const navigationState = dispatchLoadedGaPageview({ ...common, payload: newsletter, state: regrantState });
    expect(commands.filter((command) => command[0] === 'config')).toHaveLength(1);
    expect(commands.filter((command) => command[0] === 'event')).toHaveLength(2);
    expect(navigationState.lastRouteKey).toBe('/newsletter');
  });
});
