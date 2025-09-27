import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.spotify.com https://accounts.spotify.com https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com",
              "frame-src 'self' https://vercel.live",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
