/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Permite optimizar imágenes servidas desde Firebase Storage
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true, // Compresión gzip/brotli automática
  swcMinify: true,
};

module.exports = nextConfig;
