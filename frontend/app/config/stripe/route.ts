import { NextResponse } from 'next/server';
import { getStripePublishableKey } from '@/lib/stripe-publishable-key';

/** Marketing-site Stripe publishable key (frontend route: not proxied to backend). */
export async function GET() {
  return NextResponse.json({ publishableKey: getStripePublishableKey() });
}
