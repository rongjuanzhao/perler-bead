/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态资源优化
  images: {
    unoptimized: true,
  },
  // 禁用React严格模式以避免hydration问题
  reactStrictMode: false,
  // 确保正确的trailing slash配置
  trailingSlash: false,
}

module.exports = nextConfig
