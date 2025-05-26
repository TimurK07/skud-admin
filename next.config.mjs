/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.10.13',
        port: '3003',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
