import { updateWorkspaceConfig } from "./scripts/updateWorkspaceConfig.js";

// 执行更新配置的函数
updateWorkspaceConfig();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 移除以下行
  // webpack: (config) => {
  //   config.externals = [...config.externals, { canvas: "canvas" }];
  //   return config;
  // },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },
};

export default nextConfig;
