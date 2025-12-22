import { defineConfig } from 'tsup';

export default defineConfig([
  {
    dts: true,
    entry: {
      'event-as-promise': './src/index.ts'
    },
    format: ['cjs', 'esm'],
    sourcemap: true,
    target: 'esnext'
  }
]);
