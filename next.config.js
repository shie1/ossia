/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const prod = process.env.NODE_ENV === 'production'

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  pwa: {
    dest: "public",
    disable: !prod,
    register: true,
    skipWaiting: true,
    runtimeCaching,
    buildExcludes: [/middleware-manifest.json$/]
  },
}

module.exports = withPWA(nextConfig)