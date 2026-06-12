import path from 'path';
import { defineConfig } from 'vitest/config';

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
        replacement: path.resolve(__dirname, '../packages/booking-crm/src/channel-landing-pages'),
      },
      { find: '@', replacement: path.resolve(__dirname, '.') },
    ],
  },
});
