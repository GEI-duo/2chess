import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    base: env.VITE_BASE_URL || '/',
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;

            // pnpm stores deps under .pnpm/<pkg>/node_modules/<pkg>/..., so use the
            // last node_modules segment to derive the real package name consistently.
            const modulePath = id.split('node_modules/').pop();
            if (!modulePath) return 'vendor';

            const parts = modulePath.split('/');
            const packageName = parts[0].startsWith('@')
              ? `${parts[0]}-${parts[1]}`
              : parts[0];

            return `vendor-${packageName.replace('@', '')}`;
          },
        },
      },
    },
    resolve: {
      alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
    },
    plugins: [
      tailwindcss(),
      react(),
      svgr({
        include: '**/*.svg?react',
      }),
    ],
    server: {
      host: true,
    },
  });
};
