/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@confpub/shared'],
  experimental: {
    taint: true,
  },
}

module.exports = nextConfig
