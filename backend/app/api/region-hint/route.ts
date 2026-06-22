import { NextResponse } from 'next/server';
import { regionFromCountryCode } from '@/lib/ip-region-hint';

export const dynamic = 'force-dynamic';

/** Server-side ipapi proxy — avoids browser CORS console noise on public pages. */
export async function GET() {
  try {
    const res = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(4000),
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return NextResponse.json({ hint: null }, { status: 200 });
    }
    const data = (await res.json()) as { country_code?: string };
    const hint = regionFromCountryCode(data.country_code);
    return NextResponse.json({ hint });
  } catch {
    return NextResponse.json({ hint: null }, { status: 200 });
  }
}
