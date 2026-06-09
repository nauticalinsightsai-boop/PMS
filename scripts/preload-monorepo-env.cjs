/**
 * Preload repo root .env.local before Next.js starts (monorepo dev).
 */
const path = require('path');
const { loadEnvConfig } = require('@next/env');

const repoRoot = path.resolve(__dirname, '..');
loadEnvConfig(repoRoot);
