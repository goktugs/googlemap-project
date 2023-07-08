/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["chart.apis.google.com"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/add-location",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
