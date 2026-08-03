import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: __dirname,
  test: {
    environment: 'node',
    include: ['**/*.{test,spec}.ts'],
  },
  resolve: {
    alias: [
      {
        find: '@pms/booking-crm/form-submissions',
        replacement: path.resolve(
          __dirname,
          '../../packages/booking-crm/src/form-submissions.ts',
        ),
      },
      {
        find: '@pms/booking-crm',
        replacement: path.resolve(__dirname, '../../packages/booking-crm/src'),
      },
      { find: '@', replacement: path.resolve(__dirname, '.') },
    ],
  },
});
