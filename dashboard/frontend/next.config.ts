import type { NextConfig } from 'next';
import path from 'path';

const dashboardBackendUrl = process.env.DASHBOARD_BACKEND_URL || 'http://localhost:3002';

const nextConfig: NextConfig = {
  // Monorepo: resolve modules from repo root (avoids stale/missing chunks in dev)
  outputFileTracingRoot: path.join(__dirname, '../..'),

  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'motion'],
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${dashboardBackendUrl}/api/:path*`,
      },
    ];
  },

  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 500,
        ignored: ['**/node_modules/**', '**/.git/**'],
      };
    }
    return config;
  },
};

export default nextConfig;
