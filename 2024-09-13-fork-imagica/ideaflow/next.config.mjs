/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/execute',
        destination: 'http://localhost:3001/execute',
      },
    ];
  },
};

export default nextConfig;