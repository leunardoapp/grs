/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'api.grs.ir'],
  },
  i18n: {
    locales: ['fa'],
    defaultLocale: 'fa',
  },
  experimental: {
    reactCompiler: true,
  },
}

export default nextConfig
