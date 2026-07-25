import type { NextConfig } from 'next';
import path from 'path';
import { getGoSlugRedirects } from './lib/go-slug-redirects';
import { getKeywordSeoRedirects } from './content/seo/keyword-redirect-map';

const { loadMonorepoEnv } = require('../scripts/load-monorepo-env.cjs');
loadMonorepoEnv(__dirname);

const backendUrl = process.env.BACKEND_URL?.replace(/\/$/, '');
/** Opt-in external API proxy (split deploy). Default: bundled routes from sync-public-api-into-frontend.mjs */
const useBackendProxy = process.env.USE_BACKEND_PROXY === 'true' && Boolean(backendUrl);
const dashboardFrontendUrl = process.env.DASHBOARD_FRONTEND_URL?.replace(/\/$/, '');
const dashboardBackendUrl = (
  process.env.DASHBOARD_BACKEND_URL || 'http://localhost:3002'
).replace(/\/$/, '');
/** External Vercel admin projects (optional). Without these, admin is bundled under frontend/app/admin. */
const productionAdminProxy = Boolean(dashboardFrontendUrl);

const dashFeRoot = path.join(__dirname, '../dashboard/frontend');
const dashBeRoot = path.join(__dirname, '../dashboard/backend');
const publicApiRoot = path.join(__dirname, '../backend');

const nextConfig: NextConfig = {
  // Dev gateway uses localhost:3000 → 127.0.0.1:3050; allow both hosts for /_next/* chunks.
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  serverExternalPackages: ['nodemailer'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion'],
  },
  env: {
    NEXT_PUBLIC_AUTH_USE_API_LOGIN: process.env.NEXT_PUBLIC_AUTH_USE_API_LOGIN ?? 'true',
    NEXT_PUBLIC_BASE_PATH: '/admin',
    NEXT_PUBLIC_DASHBOARD_BUNDLED: 'true',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
      process.env.STRIPE_PUBLISHABLE_KEY ??
      '',
    NEXT_PUBLIC_GA_MEASUREMENT_ID:
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || '',
    NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || '',
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
    '/api/:path*': ['./backend/**/*', './frontend/data/regional-catalogue.json'],
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
      ...getKeywordSeoRedirects(),
      {
        source: '/store',
        destination: '/community?view=store',
        permanent: true,
      },
      {
        source: '/community/sign-in',
        destination: '/join',
        permanent: false,
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
        source: '/terms',
        destination: '/legal/terms',
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
      {
        source: '/go',
        destination: '/go/website',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/newsletter',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/newsletter/:slug',
        permanent: true,
      },
      {
        source: '/pmp-professional-1',
        destination: '/pmp-professional',
        permanent: true,
      },
      {
        source: '/topics/pmp-exam-2026',
        destination: '/pmp-exam-2026',
        permanent: true,
      },
      {
        source: '/pmp-before-8-july-2026',
        destination: '/pmp-after-9-july-2026',
        permanent: true,
      },
      {
        source: '/answers/should-i-rush-pmp-before-july-2026',
        destination: '/pmp-after-9-july-2026',
        permanent: true,
      },
      {
        source: '/answers/should-i-take-pmp-before-july-2026',
        destination: '/pmp-after-9-july-2026',
        permanent: true,
      },
      {
        source: '/answers/should-i-take-pmp-before-8-july-2026',
        destination: '/pmp-after-9-july-2026',
        permanent: true,
      },
      {
        source: '/answers/should-i-take-the-pmp-before-8-july-2026',
        destination: '/pmp-after-9-july-2026',
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

    if (productionAdminProxy && dashboardBackendUrl) {
      rules.push({
        source: '/api/interactions',
        destination: `${dashboardBackendUrl}/api/interactions`,
      });
      rules.push({
        source: '/api/interactions/:path*',
        destination: `${dashboardBackendUrl}/api/interactions/:path*`,
      });
    } else {
      // Bundled admin on same Vercel project → dashboard API lives under /admin/api
      rules.push({
        source: '/api/interactions',
        destination: '/admin/api/interactions',
      });
      rules.push({
        source: '/api/interactions/:path*',
        destination: '/admin/api/interactions/:path*',
      });
    }

    if (useBackendProxy && backendUrl) {
      rules.push({
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      });
    }

    return rules;
  },
  async headers() {
    const securityHeaders = [
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Cross-Origin-Opener-Policy',
        value: 'same-origin-allow-popups',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(self)',
      },
    ];

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/brand/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/marketing/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^@\/(.*)$/, (resource) => {
        const ctx = resource.context ?? '';
        if (ctx.includes(`${path.sep}dashboard${path.sep}backend${path.sep}`)) {
          resource.request = path.join(dashBeRoot, resource.request.replace(/^@\//, ''));
        } else if (ctx.includes(`${path.sep}dashboard${path.sep}frontend${path.sep}`)) {
          resource.request = path.join(dashFeRoot, resource.request.replace(/^@\//, ''));
        } else if (ctx.includes(`${path.sep}backend${path.sep}`)) {
          resource.request = path.join(publicApiRoot, resource.request.replace(/^@\//, ''));
        }
      }),
    );
    return config;
  },
};

export default nextConfig;
