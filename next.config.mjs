/** @type {import('next').NextConfig} */
const nextConfig = {
  serverComponentsExternalPackages: ['bcryptjs', 'jose', '@prisma/client'],
  webpack: (config) => {
    config.optimization.minimize = false;
    return config;
  }
};
export default nextConfig;