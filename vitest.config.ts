import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import TsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    TsConfigPaths({
      configNames: [
        'tsconfig.json',
        'tsconfig.vitest.json',
      ],
    }),
  ],
  test: {
    watch: false,
    testTimeout: 60 * 1000,
    root: fileURLToPath(new URL('./', import.meta.url)),
    coverage: {
      enabled: true,
      include: ['src/**'],
    },
    open: false,
  },
});
