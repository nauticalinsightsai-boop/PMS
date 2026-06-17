#!/usr/bin/env node
/**
 * Verify Stripe env is visible to the backend (same load path as next dev).
 */
const path = require('path');
const { loadEnvConfig } = require('@next/env');

const root = path.resolve(__dirname, '..');
loadEnvConfig(root);

const secret = process.env.STRIPE_SECRET_KEY?.trim() ?? '';
const publishable =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ??
  process.env.STRIPE_PUBLISHABLE_KEY?.trim() ??
  '';
const webhook = process.env.STRIPE_WEBHOOK_SECRET?.trim() ?? '';

const secretLooksValid =
  Boolean(secret && secret.startsWith('sk_')) && !/^sk_(live|test)_mk_/i.test(secret);
const ok = secretLooksValid && Boolean(publishable && publishable.startsWith('pk_'));

console.log(
  secretLooksValid
    ? '✓ STRIPE_SECRET_KEY is set'
    : '✗ STRIPE_SECRET_KEY missing or invalid (use sk_live_51... from Stripe Dashboard, not sk_live_mk_)',
);
console.log(
  publishable
    ? '✓ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set'
    : '✗ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY missing (required for embedded checkout on enrollment)',
);
console.log(
  webhook
    ? '✓ STRIPE_WEBHOOK_SECRET is set'
    : '○ STRIPE_WEBHOOK_SECRET not set (needed for order status updates via webhook)',
);

if (!ok) {
  console.log('\nAdd keys to repo root .env.local, then restart: npm run dev');
  console.log('Production: set STRIPE_SECRET_KEY + NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY on the marketing frontend Vercel project, then redeploy.');
  console.log('See .env.example → Stripe section');
  process.exit(1);
}
