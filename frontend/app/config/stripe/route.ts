import path from 'path';
import { NextResponse } from 'next/server';

const { loadMonorepoEnv } = require('../../../../scripts/load-monorepo-env.cjs');

function readPublishableKey(): string {
  loadMonorepoEnv(path.join(process.cwd()));
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? '';
}

/** Marketing-site Stripe publishable key (frontend route: not proxied to backend). */
export async function GET() {
  return NextResponse.json({ publishableKey: readPublishableKey() });
}