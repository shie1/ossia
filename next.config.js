/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const nextConfig = withPWA({
  reactStrictMode: true,
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    runtimeCaching,
    buildExcludes: [/middleware-manifest.json$/]
  },
})

module.exports = nextConfig
