const prefix = process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY?.match(/\/(.+)$/)?.[1]}` : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: prefix,
}

module.exports = nextConfig
