import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BOOKING_CRM_CTA = '/admin/dashboard/booking-crm/cta';

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname.startsWith('/admin/dashboard/members-revenue')) {
    const nextPath = pathname.replace('/admin/dashboard/members-revenue', '/admin/dashboard/booking-crm');
    const url = request.nextUrl.clone();
    url.pathname = nextPath === '/admin/dashboard/booking-crm' ? BOOKING_CRM_CTA : nextPath;
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (
    pathname === BOOKING_CRM_CTA &&
    (searchParams.has('category') || searchParams.has('channel'))
  ) {
    const url = request.nextUrl.clone();
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/dashboard/booking-crm/cta',
    '/admin/dashboard/members-revenue/:path*',
    '/admin/dashboard',
    '/admin/dashboard/:path*',
  ],
};
