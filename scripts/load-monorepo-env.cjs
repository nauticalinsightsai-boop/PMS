/**
 * Load repo root .env + .env.local before Next.js config runs.
 */
const path = require('path');
const { loadEnvConfig } = require('@next/env');

/** @param {string} appDir - __dirname from the app's next.config.ts */
function loadMonorepoEnv(appDir, ...up) {
  const repoRoot = path.resolve(appDir, ...(up.length ? up : ['..']));
  loadEnvConfig(repoRoot);
}

module.exports = { loadMonorepoEnv };
