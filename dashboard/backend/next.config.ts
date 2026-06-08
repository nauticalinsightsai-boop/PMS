import type { NextConfig } from 'next';

const { loadMonorepoEnv } = require('../../scripts/load-monorepo-env.cjs');
loadMonorepoEnv(__dirname, '..', '..');

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
