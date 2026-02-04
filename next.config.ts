import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // =======================================
  // PERMITIR SVG COMO COMPONENTES (TURBOPACK)
  // =======================================
  // =======================================
  // PERMITIR SVG COMO COMPONENTES (WEBPACK + TURBO)
  // =======================================
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  } as any,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  // =======================================
  // BACKEND PROXY → LOCAL + PRODUCCIÓN
  // =======================================
  async rewrites() {
    return [
      // 🔧 LOCAL
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },

      // 🔧 PRODUCCIÓN
      {
        source: "/api/:path*",
        destination: "https://jlgcars-api.onrender.com/api/:path*",
      },
    ];
  },

  // =======================================
  // PERMITIR IMÁGENES DE CLOUDINARY
  // =======================================
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
