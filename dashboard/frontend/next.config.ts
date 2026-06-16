import type { NextConfig } from 'next';
import path from 'path';

const { loadMonorepoEnv } = require('../../scripts/load-monorepo-env.cjs');
loadMonorepoEnv(__dirname, '..', '..');

const dashboardBackendUrl = process.env.DASHBOARD_BACKEND_URL || 'http://localhost:3002';
const marketingSiteUrl =
  process.env.NEXT_PUBLIC_MARKETING_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000';
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '/admin').replace(/\/$/, '');

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_AUTH_USE_API_LOGIN: process.env.NEXT_PUBLIC_AUTH_USE_API_LOGIN ?? 'true',
  },
  basePath: basePath || undefined,
  eslint: { ignoreDuringBuilds: true },
  // Monorepo: resolve modules from repo root (avoids stale/missing chunks in dev)
  outputFileTracingRoot: path.join(__dirname, '../..'),

  transpilePackages: ['@pms/booking-crm', '@pms/ui', '@pms/site-content'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'motion'],
  },

  async redirects() {
    const newsletter = '/dashboard/site-system/newsletter';
    return [
      // Newsletter-only admin — retire CRM, social, legacy CMS, media library
      { source: '/dashboard/booking-crm/:path*', destination: newsletter, permanent: false },
      { source: '/dashboard/booking-crm', destination: newsletter, permanent: false },
      { source: '/dashboard/social-media-management/:path*', destination: newsletter, permanent: false },
      { source: '/dashboard/social-media-management', destination: newsletter, permanent: false },
      { source: '/dashboard/control-tower/:path*', destination: newsletter, permanent: false },
      { source: '/dashboard/control-tower', destination: newsletter, permanent: false },
      { source: '/dashboard/cms/:path*', destination: newsletter, permanent: false },
      { source: '/dashboard/cms', destination: newsletter, permanent: false },
      { source: '/dashboard/members-revenue/:path*', destination: newsletter, permanent: false },
      { source: '/dashboard/members-revenue', destination: newsletter, permanent: false },
      { source: '/dashboard/site-system/media-library/:path*', destination: newsletter, permanent: false },
      { source: '/dashboard/site-system/media-library', destination: newsletter, permanent: false },
      { source: '/dashboard/site-system/home', destination: newsletter, permanent: false },
      { source: '/dashboard/site-system/settings', destination: newsletter, permanent: false },
      { source: '/dashboard/site-system/seo', destination: newsletter, permanent: false },
      { source: '/dashboard/site-system/analytics', destination: newsletter, permanent: false },
      { source: '/dashboard/site-system/security', destination: newsletter, permanent: false },
      { source: '/dashboard/site-system/blogs/:path*', destination: newsletter, permanent: false },
      { source: '/dashboard/site-system/blogs', destination: newsletter, permanent: false },
      { source: '/dashboard/site-system/pages/:path*', destination: newsletter, permanent: false },
      { source: '/dashboard/site-system/website-data', destination: newsletter, permanent: false },
      { source: '/dashboard/site-system/insights', destination: newsletter, permanent: false },
      { source: '/dashboard/site-system', destination: newsletter, permanent: false },
      { source: '/dashboard/users', destination: newsletter, permanent: true },
      { source: '/dashboard/members/:path*', destination: newsletter, permanent: true },
      { source: '/dashboard/members', destination: newsletter, permanent: true },
      { source: '/dashboard/bookings', destination: newsletter, permanent: true },
      { source: '/dashboard/monetization', destination: newsletter, permanent: true },
      { source: '/dashboard/cta/:path*', destination: newsletter, permanent: true },
      { source: '/dashboard/cta', destination: newsletter, permanent: true },
      { source: '/dashboard/newsletter', destination: newsletter, permanent: true },
      { source: '/dashboard/newsletter/:path*', destination: '/dashboard/site-system/newsletter/:path*', permanent: true },
      // /go/* portals are on the marketing app, not dashboard
      { source: '/go', destination: `${marketingSiteUrl}/go`, permanent: false },
      { source: '/go/:path*', destination: `${marketingSiteUrl}/go/:path*`, permanent: false },
      { source: '/dashboard/site-system/service-scopes', destination: newsletter, permanent: false },
      { source: '/dashboard/site-system/discovery-call-email', destination: newsletter, permanent: false },
      { source: '/dashboard/site-system/portfolio', destination: newsletter, permanent: false },
      { source: '/dashboard/site-system/discarded', destination: newsletter, permanent: false },
      { source: '/dashboard/migrate', destination: newsletter, permanent: false },
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
