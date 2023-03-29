//@ts-check
/**
 * @typedef {import('next').NextConfig} NextConfig
 * @typedef {import("webpack").Configuration} WebpackConfig
 */

require('dotenv').config();
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const withTM = require("next-transpile-modules")([
  // `monaco-editor` isn't published to npm correctly: it includes both CSS
  // imports and non-Node friendly syntax, so it needs to be compiled.
  "monaco-editor"
]);
const { patchWebpackConfig } = require("next-global-css");

const prefix = process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY?.match(/\/(.+)$/)?.[1]}` : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: prefix,
  webpack: (/** @type { WebpackConfig } */ config, options) => {
    patchWebpackConfig(config, options);
    config.module?.rules?.push({ test: /\.ttf$/, type: "asset/resource" });
    if (!options.isServer) {
      config.plugins?.push(
        new MonacoWebpackPlugin({
          languages: [
            "javascript",
            "typescript",
            "scss",
            "css",
          ],
          filename: "static/[name].worker.js",
        })
      );
    }
    return config;
  }
}

module.exports = withTM(nextConfig)
