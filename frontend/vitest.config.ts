import path from 'path';
import { defineConfig } from 'vitest/config';

const bookingCrm = path.resolve(__dirname, '../packages/booking-crm/src');

export default defineConfig({
  test: {
    environment: 'node',
    include: [
      '**/*.{test,spec}.{ts,tsx}',
      '../packages/booking-crm/src/**/*.{test,spec}.ts',
    ],
  },
  resolve: {
    alias: [
      {
        find: '@/lib/channel-landing-pages',
        replacement: path.resolve(bookingCrm, 'channel-landing-pages'),
      },
      {
        find: '@pms/booking-crm/form-submissions',
        replacement: path.resolve(bookingCrm, 'form-submissions.ts'),
      },
      {
        find: '@pms/booking-crm/lead-attribution',
        replacement: path.resolve(
          bookingCrm,
          'channel-landing-pages/lead-attribution.ts',
        ),
      },
      {
        find: '@pms/booking-crm/repository',
        replacement: path.resolve(
          bookingCrm,
          'channel-landing-pages/repository.ts',
        ),
      },
      {
        find: '@pms/booking-crm/migrateChannelPages',
        replacement: path.resolve(
          bookingCrm,
          'channel-landing-pages/migrateChannelPages.ts',
        ),
      },
      {
        find: '@pms/booking-crm/channel-landing-pages/resolveSchedulerChrome',
        replacement: path.resolve(
          bookingCrm,
          'channel-landing-pages/resolveSchedulerChrome.ts',
        ),
      },
      {
        find: '@pms/booking-crm/channel-landing-pages/resolvePortalTheme',
        replacement: path.resolve(
          bookingCrm,
          'channel-landing-pages/resolvePortalTheme.ts',
        ),
      },
      {
        find: '@pms/booking-crm/channel-landing-pages/channelMarkAssets',
        replacement: path.resolve(
          bookingCrm,
          'channel-landing-pages/channelMarkAssets.ts',
        ),
      },
      {
        find: '@pms/booking-crm/channel-landing-pages/portalStoryRing',
        replacement: path.resolve(
          bookingCrm,
          'channel-landing-pages/portalStoryRing.ts',
        ),
      },
      {
        find: '@pms/booking-crm/calendly/event-registry',
        replacement: path.resolve(bookingCrm, 'calendly/event-registry.ts'),
      },
      {
        find: '@pms/booking-crm/calendly/live-scheduling-urls',
        replacement: path.resolve(
          bookingCrm,
          'calendly/live-scheduling-urls.ts',
        ),
      },
      {
        find: '@pms/booking-crm/calendly/scheduling-urls',
        replacement: path.resolve(bookingCrm, 'calendly/scheduling-urls.ts'),
      },
      {
        find: '@pms/booking-crm/calendly/webhook',
        replacement: path.resolve(bookingCrm, 'calendly/webhook.ts'),
      },
      {
        find: '@pms/booking-crm/calendly/handoff',
        replacement: path.resolve(bookingCrm, 'calendly/handoff.ts'),
      },
      {
        find: '@pms/booking-crm/constants/channelGroups',
        replacement: path.resolve(bookingCrm, 'constants/channelGroups.ts'),
      },
      {
        find: '@pms/booking-crm',
        replacement: bookingCrm,
      },
      {
        find: '@pms/site-content',
        replacement: path.resolve(__dirname, '../packages/site-content/src'),
      },
      { find: '@', replacement: path.resolve(__dirname, '.') },
    ],
  },
});
