import "./scripts/generateWorkspaceConfig.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
      {
        source: "/previews/:path*",
        destination: "/previews/:path*",
      },
    ];
  },
};

export default nextConfig;
