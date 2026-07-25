/**
 * Load repo root .env + .env.local before Next.js config runs.
 */
const path = require('path');
const { loadEnvConfig } = require('@next/env');

/** @param {string} appDir - __dirname from the app's next.config.ts */
function loadMonorepoEnv(appDir, ...up) {
  const repoRoot = path.resolve(appDir, ...(up.length ? up : ['..']));
  // Next loads app-local env files before evaluating next.config. Force a
  // second pass here so the monorepo-root files this helper is designed for
  // are not skipped by @next/env's process-wide cache.
  loadEnvConfig(repoRoot, process.env.NODE_ENV !== 'production', console, true);
}

module.exports = { loadMonorepoEnv };
