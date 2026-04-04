import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  esbuild:
    command === 'build'
      ? {
          drop: ['console', 'debugger'],
        }
      : undefined,
  build: {
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (
            id.includes('framer-motion') ||
            id.includes('motion-dom') ||
            id.includes('motion-utils')
          ) {
            return 'motion-vendor';
          }

          if (id.includes('react-router-dom') || id.includes('react-router') || id.includes('@remix-run')) {
            return 'router-vendor';
          }

          if (id.includes('/react/') || id.includes('react-dom')) {
            return 'react-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
}));
