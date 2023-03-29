// @ts-check
/** @typedef {import("esbuild").BuildOptions} BuildOptions */

import { context } from "esbuild";
// eslint-disable-next-line
const { default: { dependencies, devDependencies } } = await import("../package.json", { assert: { type: "json" } });

/** @type {Partial<BuildOptions>} */
const defaultOptions = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  target: 'esnext',
  platform: 'neutral',
  external: Object.keys({...dependencies, ...devDependencies}),
  logLevel: 'info',
  minify: process.env.ESBUILD_MINIFY === "true" || process.env.NODE_ENV === 'production',
  sourcemap: process.env.ESBUILD_SOURCEMAP === "true" || process.env.NODE_ENV !== 'production',
}

export const createContext = async (/** @type {Partial<BuildOptions>} */ options = {}) => {
  return {
    cjs: await context({
      ...defaultOptions,
      format: "cjs",
      outfile: "dist/index.js",
      ...options,
    }),
    esm: await context({
      ...defaultOptions,
      format: "esm",
      outfile: "dist/index.mjs",
      ...options,
    }),
  }
}
