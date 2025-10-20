import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    {
      return [
        {
          source: '/',
          destination: '/membership',
          permanent: true
        }
      ];
    }
  }
};

export default nextConfig;
