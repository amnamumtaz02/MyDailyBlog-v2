/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs', 'jose', 'next-auth', '@auth/core']
  }
};
export default nextConfig;