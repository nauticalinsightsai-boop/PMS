import type { NextConfig } from 'next';
import path from 'path';
import { getGoSlugRedirects } from './lib/go-slug-redirects';

const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '..'),
  transpilePackages: ['@pms/booking-crm', '@pms/ui'],
  outputFileTracingIncludes: {
    '/go/[channel]': [
      './packages/booking-crm/data/channel-landing-pages.json',
      './data/channel-landing-pages.json',
    ],
  },
  async redirects() {
    return [
      ...getGoSlugRedirects(),
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
      {
        source: '/legalhub',
        destination: '/legal',
        permanent: true,
      },
      {
        source: '/legalhub/:path*',
        destination: '/legal/:path*',
        permanent: true,
      },
      {
        source: '/legal/pricing',
        destination: '/legal/pricing-disclaimers',
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
