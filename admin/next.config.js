/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['lucide-react'],
  experimental: {
    optimizeCss: false,
  },
};

module.exports = nextConfig;
