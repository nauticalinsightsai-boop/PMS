import type { NextConfig } from 'next';

const { loadMonorepoEnv } = require('../scripts/load-monorepo-env.cjs');
loadMonorepoEnv(__dirname);

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: '2mb' },
  },
};

export default nextConfig;
