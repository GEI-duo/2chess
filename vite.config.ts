import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
  },
  plugins: [
    react({
      plugins: [['@swc-jotai/react-refresh', {}]],
    }),
    svgr({
      include: '**/*.svg?react',
    }),
  ],
  server: {
    host: true,
  },
});
