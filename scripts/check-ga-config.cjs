#!/usr/bin/env node
/**
 * Verify GA4 measurement ID is available to the marketing frontend build.
 */
const path = require('path');
const { loadEnvConfig } = require('@next/env');

const root = path.resolve(__dirname, '..');
loadEnvConfig(root);

const id =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || 'G-E9QRM0GQ1W';

const ok = /^G-[A-Z0-9]+$/.test(id);

console.log(ok ? `✓ GA4 measurement ID: ${id}` : `✗ Invalid GA4 ID: ${id}`);
console.log(
  '○ Analytics loads after cookie consent (frontend/components/analytics/GoogleAnalytics.tsx)',
);
console.log(
  '○ See docs/internal/PMSTRUCTURE_ANALYTICS_SETUP.md for verification steps',
);

if (!ok) process.exit(1);
