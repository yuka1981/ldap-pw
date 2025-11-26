/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 支援 YAML 檔案作為 raw 文字導入
  webpack: (config) => {
    config.module.rules.push({
      test: /\.yaml$/,
      resourceQuery: /raw/,
      type: 'asset/source',
    });
    return config;
  },
};

module.exports = nextConfig;

