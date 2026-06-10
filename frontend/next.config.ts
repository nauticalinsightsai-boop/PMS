import type { NextConfig } from 'next';
import path from 'path';
import { getGoSlugRedirects } from './lib/go-slug-redirects';

const { loadMonorepoEnv } = require('../scripts/load-monorepo-env.cjs');
loadMonorepoEnv(__dirname);

const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
const dashboardFrontendUrl = process.env.DASHBOARD_FRONTEND_URL?.replace(/\/$/, '');
const dashboardBackendUrl = process.env.DASHBOARD_BACKEND_URL?.replace(/\/$/, '');
/** External Vercel admin projects (optional). Without these, admin is bundled under frontend/app/admin. */
const productionAdminProxy = Boolean(dashboardFrontendUrl);

const dashFeRoot = path.join(__dirname, '../dashboard/frontend');
const dashBeRoot = path.join(__dirname, '../dashboard/backend');

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_AUTH_USE_API_LOGIN: process.env.NEXT_PUBLIC_AUTH_USE_API_LOGIN ?? 'true',
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  outputFileTracingRoot: path.join(__dirname, '..'),
  transpilePackages: ['@pms/booking-crm', '@pms/ui', '@pms/site-content'],
  outputFileTracingIncludes: {
    '/go/[channel]': [
      './packages/booking-crm/data/channel-landing-pages.json',
      './data/channel-landing-pages.json',
    ],
    '/admin/:path*': ['./dashboard/frontend/**/*', './dashboard/backend/**/*'],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.pmstructure.com' }],
        destination: 'https://pmstructure.com/:path*',
        permanent: true,
      },
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
      { source: '/admin', destination: '/admin/login', permanent: false },
      { source: '/login', destination: '/admin/login', permanent: true },
      { source: '/login/:path*', destination: '/admin/login/:path*', permanent: true },
      { source: '/dashboard', destination: '/admin/dashboard', permanent: true },
      { source: '/dashboard/:path*', destination: '/admin/dashboard/:path*', permanent: true },
      {
        source: '/answers/is-pm-structure-a-pmi-authorized-training-partner',
        destination: '/answers/is-pm-structure-an-official-pmi-atp',
        permanent: true,
      },
      {
        source: '/answers/does-pm-structure-guarantee-a-pmp-pass',
        destination: '/answers/does-pm-structure-guarantee-pmp-success',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const rules: { source: string; destination: string }[] = [];

    if (productionAdminProxy && dashboardFrontendUrl) {
      rules.push(
        {
          source: '/admin/api/channel-landing-pages',
          destination: `${dashboardFrontendUrl}/admin/api/channel-landing-pages`,
        },
        {
          source: '/admin/api/channel-landing-pages/:path*',
          destination: `${dashboardFrontendUrl}/admin/api/channel-landing-pages/:path*`,
        },
        { source: '/admin', destination: `${dashboardFrontendUrl}/admin` },
        { source: '/admin/:path*', destination: `${dashboardFrontendUrl}/admin/:path*` },
      );
    }

    if (productionAdminProxy && dashboardBackendUrl) {
      rules.push({
        source: '/admin/api/:path*',
        destination: `${dashboardBackendUrl}/api/:path*`,
      });
    }

    rules.push({
      source: '/api/:path*',
      destination: `${backendUrl}/api/:path*`,
    });

    return rules;
  },
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^@\/(.*)$/, (resource) => {
        const ctx = resource.context ?? '';
        if (ctx.includes(`${path.sep}dashboard${path.sep}backend${path.sep}`)) {
          resource.request = path.join(dashBeRoot, resource.request.replace(/^@\//, ''));
        } else if (ctx.includes(`${path.sep}dashboard${path.sep}frontend${path.sep}`)) {
          resource.request = path.join(dashFeRoot, resource.request.replace(/^@\//, ''));
        }
      }),
    );
    return config;
  },
};

export default nextConfig;
