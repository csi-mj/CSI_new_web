import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**'
      }
    ]
  },
  webpack: (config) => {
    // pdfjs-dist optionally requires the native "canvas" package (Node-only).
    // It isn't needed in the browser, so stub it out to fix the build error.
    config.resolve.alias.canvas = false;
    return config;
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true
      }
    ];
  }
};

export default nextConfig;
