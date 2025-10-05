/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Fix for Node.js modules not available in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ws: false,
        net: false,
        tls: false,
        fs: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        'utf-8-validate': false,
        'bufferutil': false,
      }
    }
    
    // Ignore specific modules that cause issues
    config.externals = config.externals || []
    if (!isServer) {
      config.externals.push({
        ws: 'ws',
      })
    }
    
    return config
  },
}

export default nextConfig
