import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';

import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const target = env.VITE_TARGET_URL;
  console.log(env.VITE_ENV_NAME);

  return defineConfig({
    esbuild: {
      supported: {
        'top-level-await': true, //browsers can handle top-level-await features
      },
    },
    optimizeDeps: {
      exclude: ['js-big-decimal', 'fsevents'],
      include: ['@chainsafe/bls-keystore'],
      esbuildOptions: {
        target: 'esnext',

        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
      },
    },
    plugins: [
      svgr(),
      react(),
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        },
        overlay: {
          initialIsOpen: false,
        },
      }),

      nodePolyfills({
        include: ['path', 'stream', 'util', 'os', 'crypto', 'fs', 'zlib', 'vm'],
        // exclude: ['http'],
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
        overrides: {
          fs: 'memfs',
        },
        protocolImports: true,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      target: 'esnext',
      // sourcemap: env.VITE_ENV_NAME === 'development' ? 'inline' : false,
      // sourcemap: false,
    },
    server: {
      port: 8088,
      proxy: {
        '/api': {
          target: target,
          secure: false,
          changeOrigin: true,
          // pathRewrite: { '^/api': '' },
        },
        '/server': {
          target: target,
          secure: false,
          changeOrigin: true,
          // pathRewrite: { '^/api': '' },
        },
      },
    },
    preview: {
      port: 8088,
    },
  });
};
