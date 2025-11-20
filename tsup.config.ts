import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  outDir: 'dist',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.js' : '.js',
    };
  },
  esbuildOptions(options) {
    options.outdir = options.format === 'cjs' ? 'dist/cjs' : 'dist/esm';
  },
});
