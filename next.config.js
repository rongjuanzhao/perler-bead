/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep the development server's assets separate from production builds.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
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
