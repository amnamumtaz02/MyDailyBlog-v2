/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs']
  },
  webpack: (config, { isServer, dev }) => {
    if (isServer && !dev) {
      config.optimization.minimize = false
    }
    return config
  }
}

export default nextConfig