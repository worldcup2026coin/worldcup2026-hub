import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
    {
      source: "/account",
      headers: [
        {
          key: "X-Robots-Tag",
          value: "noindex, nofollow",
        },
      ],
    },
    {
      source: "/auth/login",
      headers: [
        {
          key: "X-Robots-Tag",
          value: "noindex, nofollow",
        },
      ],
    },
    {
      source: "/community/profile",
      headers: [
        {
          key: "X-Robots-Tag",
          value: "noindex, nofollow",
        },
      ],
    },
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.api-sports.io",
      },
      {
        protocol: "https",
        hostname: "media.api-football.com",
      },
      {
        protocol: "https",
        hostname: "a.espncdn.com",
      },
      {
        protocol: "https",
        hostname: "static.espn.com",
      },
      {
        protocol: "https",
        hostname: "ichef.bbci.co.uk",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
