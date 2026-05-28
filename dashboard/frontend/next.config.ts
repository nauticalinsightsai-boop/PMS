import type { NextConfig } from 'next';
import path from 'path';

const dashboardBackendUrl = process.env.DASHBOARD_BACKEND_URL || 'http://localhost:3002';
const marketingSiteUrl =
  process.env.NEXT_PUBLIC_MARKETING_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000';

const nextConfig: NextConfig = {
  // Monorepo: resolve modules from repo root (avoids stale/missing chunks in dev)
  outputFileTracingRoot: path.join(__dirname, '../..'),

  transpilePackages: ['@pms/booking-crm'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'motion'],
  },

  async redirects() {
    const cta = '/dashboard/booking-crm/cta';
    const sheets = '/dashboard/booking-crm/interactions/sheets';
    return [
      // /go/* portals are on the marketing app, not dashboard
      { source: '/go', destination: `${marketingSiteUrl}/go`, permanent: false },
      { source: '/go/:path*', destination: `${marketingSiteUrl}/go/:path*`, permanent: false },
      // Legacy members-revenue → booking-crm (path remap)
      { source: '/dashboard/members-revenue', destination: cta, permanent: true },
      { source: '/dashboard/members-revenue/:path*', destination: '/dashboard/booking-crm/:path*', permanent: true },
      // Canonical Booking CRM (X1 parity matrix, booking-crm paths)
      { source: '/dashboard/booking-crm', destination: cta, permanent: false },
      { source: '/dashboard/booking-crm/users', destination: cta, permanent: false },
      { source: '/dashboard/booking-crm/members', destination: cta, permanent: false },
      { source: '/dashboard/booking-crm/members/:id', destination: cta, permanent: false },
      { source: '/dashboard/booking-crm/monetization', destination: cta, permanent: false },
      { source: '/dashboard/booking-crm/newsletter', destination: cta, permanent: false },
      { source: '/dashboard/booking-crm/cta/analytics', destination: cta, permanent: false },
      { source: '/dashboard/booking-crm/cta/audit', destination: cta, permanent: false },
      { source: '/dashboard/booking-crm/interactions', destination: sheets, permanent: false },
      // Short /dashboard/* aliases
      { source: '/dashboard/users', destination: cta, permanent: true },
      { source: '/dashboard/members', destination: cta, permanent: true },
      { source: '/dashboard/members/:id', destination: cta, permanent: true },
      { source: '/dashboard/bookings', destination: '/dashboard/booking-crm/bookings', permanent: true },
      { source: '/dashboard/monetization', destination: cta, permanent: true },
      { source: '/dashboard/newsletter', destination: cta, permanent: true },
      { source: '/dashboard/cta', destination: cta, permanent: true },
      { source: '/dashboard/cta/analytics', destination: cta, permanent: true },
      { source: '/dashboard/cta/audit', destination: cta, permanent: true },
    ];
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
