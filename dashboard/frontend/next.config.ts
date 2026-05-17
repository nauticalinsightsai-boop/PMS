import type { NextConfig } from 'next';

const dashboardBackendUrl = process.env.DASHBOARD_BACKEND_URL || 'http://localhost:3002';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${dashboardBackendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
