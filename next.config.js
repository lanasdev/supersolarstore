/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "cdn.shopify.com"],
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
