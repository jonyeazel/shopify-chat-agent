import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    browserDebugInfoInTerminal: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

export default nextConfig
