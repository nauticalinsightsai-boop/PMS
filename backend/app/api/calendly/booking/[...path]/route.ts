export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UPSTREAM = 'https://calendly.com/api/booking';

async function proxyBooking(req: Request, pathParts: string[]) {
  const incoming = new URL(req.url);
  const suffix = pathParts.map(encodeURIComponent).join('/');
  const target = `${UPSTREAM}/${suffix}${incoming.search}`;

  const headers = new Headers();
  const pass = [
    'accept',
    'accept-language',
    'content-type',
    'cookie',
    'x-csrf-token',
    'x-requested-with',
    'calendly-csrf-token',
  ];
  for (const h of pass) {
    const v = req.headers.get(h);
    if (v) headers.set(h, v);
  }
  headers.set('Origin', 'https://calendly.com');
  headers.set('Referer', 'https://calendly.com/');
  headers.set(
    'User-Agent',
    req.headers.get('user-agent') || 'Mozilla/5.0 (compatible; PMS-CalendlyProxy/1.0)',
  );

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: 'manual',
  };
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.arrayBuffer();
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, init);
  } catch (err) {
    console.error('[calendly-booking-proxy]', err);
    return new Response(JSON.stringify({ error: 'booking_upstream_failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const outHeaders = new Headers();
  const ct = upstream.headers.get('content-type');
  if (ct) outHeaders.set('content-type', ct);
  const setCookie = upstream.headers.getSetCookie?.() ?? [];
  for (const c of setCookie) outHeaders.append('set-cookie', c);
  outHeaders.set('Cache-Control', 'private, no-store');

  return new Response(await upstream.arrayBuffer(), {
    status: upstream.status,
    headers: outHeaders,
  });
}

type Ctx = { params: Promise<{ path?: string[] }> };

export async function GET(req: Request, ctx: Ctx) {
  const { path = [] } = await ctx.params;
  return proxyBooking(req, path);
}

export async function POST(req: Request, ctx: Ctx) {
  const { path = [] } = await ctx.params;
  return proxyBooking(req, path);
}

export async function PUT(req: Request, ctx: Ctx) {
  const { path = [] } = await ctx.params;
  return proxyBooking(req, path);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { path = [] } = await ctx.params;
  return proxyBooking(req, path);
}

export async function DELETE(req: Request, ctx: Ctx) {
  const { path = [] } = await ctx.params;
  return proxyBooking(req, path);
}
