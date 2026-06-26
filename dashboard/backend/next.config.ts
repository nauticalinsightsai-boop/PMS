import type { NextConfig } from 'next';

const { loadMonorepoEnv } = require('../../scripts/load-monorepo-env.cjs');
loadMonorepoEnv(__dirname, '..', '..');

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: ['@pms/booking-crm'],
  serverExternalPackages: ['@aws-sdk/client-s3'],
};

export default nextConfig;
