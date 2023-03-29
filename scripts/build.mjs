// @ts-check

import { createContext } from "./_ctx.mjs";

const ctx = await createContext()

for (
  /** @type {string extends keyof typeof ctx} */
  const c in ctx
) {
  await ctx[c].rebuild();
  await ctx[c].dispose();
  console.log(`[${c}] built`)
}

console.info("Build complete.");
