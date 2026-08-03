import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: __dirname,
  test: {
    environment: 'node',
    include: ['**/*.{test,spec}.ts'],
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, '.') }],
  },
});
