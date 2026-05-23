import type { NextConfig } from 'next';

const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/store',
        destination: '/community?view=store',
        permanent: true,
      },
      {
        source: '/compare',
        destination: '/certifications/compare',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/legal/privacy',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
