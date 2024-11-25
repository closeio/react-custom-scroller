import { defineConfig } from 'tsup';

export default defineConfig(({ watch }) => ({
  entry: ['src/index.ts'],
  format: watch ? ['iife'] : ['cjs', 'esm'],
  cjsInterop: true,
  sourcemap: true,
  clean: true,
  dts: !watch,
  loader: {
    '.css': 'local-css',
  },
}));
