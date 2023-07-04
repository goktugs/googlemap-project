/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["chart.apis.google.com"],
  },
};

module.exports = nextConfig;
