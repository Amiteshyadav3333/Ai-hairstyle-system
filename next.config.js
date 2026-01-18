/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['canvas']
  },
  images: {
    domains: ['res.cloudinary.com', 'localhost'],
    unoptimized: true
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      canvas: false
    };
    return config;
  }
}

module.exports = nextConfig