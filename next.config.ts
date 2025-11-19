import type { NextConfig } from "next";

const nextConfig: NextConfig = {

    async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://jlgcars-api.onrender.com/api/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
