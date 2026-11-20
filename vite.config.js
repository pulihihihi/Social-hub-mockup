import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const chunkIncludes = (id, patterns) => patterns.some((pattern) => id.includes(pattern));

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? (process.env.VITE_BASE_PATH || '/') : '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    allowedHosts: ['social-hub-mockup.demo.ved.com.vn', '.demo.ved.com.vn'],
  },
  build: {
    chunkSizeWarningLimit: 1400,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');

          if (normalizedId.includes('/node_modules/')) {
            if (chunkIncludes(normalizedId, [
              '/node_modules/@ant-design/pro-components/',
              '/node_modules/@ant-design/pro-provider/',
              '/node_modules/@ant-design/pro-utils/',
              '/node_modules/@ant-design/pro-form/',
              '/node_modules/@ant-design/pro-field/',
              '/node_modules/@ant-design/pro-table/',
              '/node_modules/@ant-design/pro-card/',
              '/node_modules/@ant-design/pro-layout/',
              '/node_modules/@ant-design/pro-descriptions/',
              '/node_modules/@ant-design/pro-list/',
            ])) {
              return 'antd-pro';
            }

            if (chunkIncludes(normalizedId, [
              '/node_modules/react/',
              '/node_modules/react-dom/',
              '/node_modules/scheduler/',
            ])) {
              return 'react-core';
            }

            // Keep the Ant Design runtime together so Rollup doesn't produce circular chunk warnings
            // between `antd`, `rc-*`, and icon packages.
            if (chunkIncludes(normalizedId, [
              '/node_modules/antd/',
              '/node_modules/@ant-design/',
              '/node_modules/rc-',
              '/node_modules/@rc-component/',
            ])) {
              return 'antd-stack';
            }

            if (normalizedId.includes('/node_modules/dayjs/')) {
              return 'dayjs';
            }

            if (normalizedId.includes('/node_modules/react-router')) {
              return 'router';
            }

            return 'vendor';
          }

          if (chunkIncludes(normalizedId, [
            '/src/pages/AiSkill/',
            '/src/features/ai-assets/',
          ])) {
            return 'ai-skill';
          }

          return null;
        },
      },
    },
  },
}));
