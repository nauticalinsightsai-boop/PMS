import {
  injectIntoCalendlyHtml,
  isPaidCalendlyEventUrl,
  parseProxyThemeFromSearchParams,
} from '@/lib/calendly/proxy-inject';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_HOST = /(^|\.)calendly\.com$/i;

function assertCalendlyUrl(raw: string): URL | null {
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:') return null;
    if (!ALLOWED_HOST.test(u.hostname)) return null;
    return u;
  } catch {
    return null;
  }
}

/**
 * Same-origin Calendly HTML proxy — injects slot/form CSS + booking/i18n shims.
 * Query: url=<calendly event url> + shell/slot_* from resolveSchedulerChrome.
 */
export async function GET(req: Request) {
  const incoming = new URL(req.url);
  const eventRaw = incoming.searchParams.get('url')?.trim() || '';
  const eventUrl = assertCalendlyUrl(eventRaw);
  if (!eventUrl) {
    return new Response('Missing or invalid Calendly url', { status: 400 });
  }

  const theme = parseProxyThemeFromSearchParams(incoming.searchParams);
  theme.calendlyEventUrl = eventUrl.toString();
  theme.paidEscape = theme.paidEscape || isPaidCalendlyEventUrl(eventUrl.toString());

  // Preserve Calendly path/query from event URL for deep links
  const fetchUrl = eventUrl.toString();

  let upstream: Response;
  try {
    upstream = await fetch(fetchUrl, {
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent':
          req.headers.get('user-agent') ||
          'Mozilla/5.0 (compatible; PMS-CalendlyProxy/1.0)',
      },
      redirect: 'follow',
    });
  } catch (err) {
    console.error('[calendly-proxy] fetch failed', err);
    return new Response('Upstream Calendly unavailable', { status: 502 });
  }

  if (!upstream.ok) {
    return new Response(`Calendly returned ${upstream.status}`, { status: 502 });
  }

  const html = await upstream.text();
  const injected = injectIntoCalendlyHtml(html, theme);

  return new Response(injected, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-PMS-Calendly-Proxy': '1',
      'Content-Security-Policy':
        "default-src 'self' https://calendly.com https://*.calendly.com https://*.cloudfront.net https://assets.calendly.com data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://calendly.com https://*.calendly.com https://assets.calendly.com; style-src 'self' 'unsafe-inline' https://calendly.com https://*.calendly.com; img-src 'self' data: blob: https:; connect-src 'self' https://calendly.com https://*.calendly.com https://*.cloudfront.net; frame-src https://calendly.com https://*.calendly.com https://js.stripe.com;",
    },
  });
}
