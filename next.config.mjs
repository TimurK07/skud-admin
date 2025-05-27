/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kitvision.danya.tech:3003',
        port: '3003',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
