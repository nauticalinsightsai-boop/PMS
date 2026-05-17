import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '../..'), '');
  const dashboardApi = env.VITE_DASHBOARD_API_URL || 'http://localhost:3002';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 5174,
      proxy: {
        '/api': {
          target: dashboardApi,
          changeOrigin: true,
        },
      },
    },
  };
});
