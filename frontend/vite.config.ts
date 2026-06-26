import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { qrcode } from 'vite-plugin-qrcode';
export default defineConfig({
  plugins: [
    react(),
    qrcode(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: true,
    port: 5173,
  },
});