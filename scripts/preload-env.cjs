/** Preload repo root env for Node scripts (gateway, migrations, tests). */
const path = require('path');
const { loadEnvConfig } = require('@next/env');

const repoRoot = path.resolve(__dirname, '..');
loadEnvConfig(repoRoot);

module.exports = { repoRoot };
