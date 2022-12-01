import type { Options } from 'tsup'

const config: Options = {
  entry: ['src/index.ts'],
  sourcemap: true,
  minify: true,
  clean: true,
  dts: true,
  splitting: false,
  format: ['cjs', 'esm']
}

export default config