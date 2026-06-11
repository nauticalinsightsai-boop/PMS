#!/usr/bin/env node
/**
 * Verify Stripe env is visible to the backend (same load path as next dev).
 */
const path = require('path');
const { loadEnvConfig } = require('@next/env');

const root = path.resolve(__dirname, '..');
loadEnvConfig(root);

const secret = process.env.STRIPE_SECRET_KEY?.trim() ?? '';
const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? '';
const webhook = process.env.STRIPE_WEBHOOK_SECRET?.trim() ?? '';

const ok = Boolean(secret && secret.startsWith('sk_') && publishable && publishable.startsWith('pk_'));

console.log(ok ? '✓ STRIPE_SECRET_KEY is set' : '✗ STRIPE_SECRET_KEY missing or invalid (must start with sk_)');
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
  console.log('See .env.example → Stripe section');
  process.exit(1);
}
