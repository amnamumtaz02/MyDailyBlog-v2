/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs']
  },
  webpack: (config) => {
    config.optimization.minimize = false;
    return config;
  }
};
export default nextConfig;