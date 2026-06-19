import { NextResponse } from 'next/server';
import { readMonorepoPublishableKey } from '../../../../backend/lib/ensure-monorepo-env';

/** Marketing-site Stripe publishable key (frontend route: not proxied to backend). */
export async function GET() {
  return NextResponse.json({ publishableKey: readMonorepoPublishableKey() });
}
