/**
 * Proxies public form POSTs to the dashboard interactions API (full pipeline:
 * Supabase → admin email ping → Google Sheets background sync).
 */
export async function POST(request: Request) {
  const base = (process.env.DASHBOARD_BACKEND_URL || 'http://localhost:3002').replace(/\/$/, '');
  const contentType = request.headers.get('content-type') || 'application/json';
  const body = await request.text();

  const res = await fetch(`${base}/api/interactions`, {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
      ...(request.headers.get('x-forwarded-for')
        ? { 'x-forwarded-for': request.headers.get('x-forwarded-for')! }
        : {}),
      ...(request.headers.get('referer') ? { referer: request.headers.get('referer')! } : {}),
      ...(request.headers.get('user-agent')
        ? { 'user-agent': request.headers.get('user-agent')! }
        : {}),
    },
    body,
  });

  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
  });
}
