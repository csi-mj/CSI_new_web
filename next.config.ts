import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  async redirects() {
    {
      return [
        {
          source: '/',
          destination: '/home',
          permanent: true
        }
      ];
    }
  }
};

export default nextConfig;
